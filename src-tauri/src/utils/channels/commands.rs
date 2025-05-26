use std::sync::{atomic::{AtomicBool, Ordering}, Arc};

use chrono::{DateTime, Utc};
use rand::Rng;
use serde::{Deserialize, Serialize};
use tauri::{ipc::Channel, State};
use thiserror::Error;
use tokio::time::{sleep, Duration};

use crate::utils::tasks::{state::Tasks, CancellableTask};

use super::state::Channels;

#[derive(Debug, Serialize, Error)]
pub enum Error {}

type Result<T> = core::result::Result<T, Error>;

#[derive(Debug, Serialize, Deserialize)]
pub struct Event {
    id: String,
    value: f64,
    timestamp: DateTime<Utc>,
}

fn generate_random_float() -> f64 {
    let mut rng = rand::thread_rng();

    let int_value = rng.gen_range(-100000..=100000);
    int_value as f64 / 10000.0
}

#[tauri::command]
pub async fn register(
    state: State<'_, Channels>,
    id: String,
    channel: Channel<Event>,
) -> Result<()> {
    let paused = Arc::new(AtomicBool::new(false));

    state.lock().await.channels.insert(
        id.clone(),
        (
            paused.clone(),
            CancellableTask::new(|token| async move {
                loop {
                    tokio::select! {
                        _ = sleep(Duration::from_millis(10)) => {

                            if paused.load(Ordering::Relaxed) {
                                continue;
                            }

                            let value = generate_random_float();

                            let event = Event {
                              id: id.clone(),
                              value: value.clone(),
                              timestamp: Utc::now(),
                            };

                            let _ = channel.send(event);

                            log::info!("Send to {} - value: {}", id, value);
                        }
                        _ = token.cancelled() => {
                            break;
                        }
                    }
                }
            }),
        ),
    );

    Ok(())
}

#[tauri::command]
pub async fn unregister(state: State<'_, Channels>, id: String) -> Result<()> {
    state.lock().await.channels.remove(id.as_str());
    Ok(())
}

#[tauri::command]
pub async fn start(state: State<'_, Channels>, id: String) -> Result<()> {
    if let Some((paused, _)) = state.lock().await.channels.get(id.as_str()) {
        paused.swap(false, Ordering::Relaxed);
    }
    Ok(())
}

#[tauri::command]
pub async fn stop(state: State<'_, Channels>, id: String) -> Result<()> {
    state.lock().await.channels.remove(id.as_str());
    Ok(())
}

#[tauri::command]
pub async fn pause(state: State<'_, Channels>, id: String) -> Result<()> {
    if let Some((paused, _)) = state.lock().await.channels.get(id.as_str()) {
        paused.swap(true, Ordering::Relaxed);
    }
    Ok(())
}
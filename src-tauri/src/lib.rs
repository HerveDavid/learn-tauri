mod commands;
mod state;
mod utils;

use state::Tasks;
use tauri::Manager;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_log::Builder::new().build())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![commands::start, commands::stop])
        .setup(|app| {
            tauri::async_runtime::block_on(async move {
                app.manage(Tasks::default());
            });
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

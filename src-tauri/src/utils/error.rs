use thiserror::Error;

#[derive(Debug, Error)]
pub enum Error {
    #[error("{0}")]
    JoinError(#[from] tokio::task::JoinError),

    #[error("Task was already consumed")]
    AlreadyConsumed,
}

pub type Result<T> = core::result::Result<T, Error>;

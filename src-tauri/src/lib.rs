mod commands;
mod settings;
mod utils;

use tauri::Manager;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_log::Builder::new().build())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            utils::channels::commands::register,
            utils::channels::commands::unregister,
            utils::channels::commands::start,
            utils::channels::commands::stop,
            utils::channels::commands::pause,
            utils::channels::commands::get_status,
            utils::channels::commands::list_channels,
        ])
        .invoke_handler(tauri::generate_handler![
            settings::database::commands::set_setting,
            settings::database::commands::get_setting,
            settings::database::commands::get_setting_with_default,
            settings::database::commands::merge_settings,
            settings::database::commands::set_nested_setting,
            settings::database::commands::get_nested_setting,
            settings::database::commands::delete_setting,
            settings::database::commands::list_all_settings,
            settings::database::commands::setting_exists,
            settings::database::commands::clear_all_settings,
            settings::database::commands::count_settings,
            settings::database::commands::set_string_setting,
            settings::database::commands::get_string_setting,
            settings::database::commands::set_bool_setting,
            settings::database::commands::get_bool_setting,
            settings::database::commands::set_number_setting,
            settings::database::commands::get_number_setting,
        ])
        .setup(|app| {
            tauri::async_runtime::block_on(async move {
                app.manage(utils::channels::state::Channels::default());
                app.manage(utils::tasks::state::Tasks::default());

                let settings_db = settings::database::state::DatabaseState::new(&app.handle())
                    .await
                    .expect("Failed to initialize settings db");
                app.manage(settings_db);
            });
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

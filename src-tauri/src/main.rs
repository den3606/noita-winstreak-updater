// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod memory;
mod target_address;

use std::fs::{self, OpenOptions};
use std::io::{self, Read, Write};
use std::sync::{mpsc, Arc, Mutex};
use std::thread;
use std::time::{Duration, Instant};
use winapi::shared::minwindef::TRUE;
use winapi::um::handleapi::CloseHandle;
use winapi::um::winnt::HANDLE;

const WIN_STREAK_FILE: &str = "C:\\Users\\Den\\Desktop\\win_streak.txt";

#[tauri::command]
async fn start_game_status_monitor(template: String, file_path: String) -> Result<String, String> {
    let (tx, rx) = mpsc::channel();

    thread::spawn(move || {
        let result = monitor_game_status(template, file_path);
        tx.send(result).unwrap(); // 結果を送信
    });

    // スレッドの結果を受信
    match rx.recv() {
        Ok(status) => {
            let sta = status.unwrap();
            match sta {
                MonitorStatus::Close => Ok(String::from("close")),
                MonitorStatus::Timeout => Ok(String::from("timeout")),
                _ => Ok(String::from("undefined")),
            }
        }
        Err(_) => Err(String::from("Failed to receive result from thread")),
    }
}

#[tauri::command]
async fn stop_game_status_monitor() -> Result<(), String> {
    eprint!("stop");
    // フラグを設定してスレッドを停止
    *SHOULD_STOP.lock().unwrap() = true;

    Ok(())
}

enum MonitorStatus {
    Close,
    Timeout,
}

fn monitor_game_status(template: String, file_path: String) -> io::Result<MonitorStatus> {
    // 勝数を記録するファイル

    // 初期化
    if !std::path::Path::new(WIN_STREAK_FILE).exists() {
        fs::write(WIN_STREAK_FILE, b"0")?;
    }

    let process_name = "noita.exe";
    let victory_address: u32 = target_address::ADDRESS_20240430.victory; // 勝利状態を示すアドレス
    let death_address: u32 = target_address::ADDRESS_20240430.death; // 死亡状態を示すアドレス

    let mut start_time = Instant::now();
    let mut updated = false;
    *SHOULD_STOP.lock().unwrap() = false;

    loop {
        if *SHOULD_STOP.lock().unwrap() {
            return Ok(MonitorStatus::Close);
        }

        if let Some((handle, _pid)) = memory::find_process_by_name(process_name) {
            let death_state = read_memory(handle, death_address)?;
            let victory_state = read_memory(handle, victory_address)?;

            if death_state == TRUE as u32 {
                if !updated {
                    // 勝利状態のチェック
                    if victory_state > 0 {
                        eprintln!("{}", victory_state);
                        add_win_streak(1).unwrap();
                    } else {
                        reset_win_streak().unwrap();
                    }
                    updated = true;
                }
            } else {
                if updated {
                    updated = false;
                }
            }

            // プロセスが見つかった場合、タイマーをリセット
            start_time = Instant::now();
            unsafe { CloseHandle(handle) };
        }

        // 5秒以上プロセスが見つからなかった場合、失敗とする
        if start_time.elapsed() > Duration::from_secs(5) {
            eprintln!("Failed to find Noita process within 5 seconds.");
            return Ok(MonitorStatus::Timeout);
        }

        thread::sleep(Duration::from_secs(1));
    }
}

lazy_static::lazy_static! {
    static ref SHOULD_STOP: Arc<Mutex<bool>> = Arc::new(Mutex::new(false));
}

fn read_memory(handle: HANDLE, address: u32) -> io::Result<u32> {
    if let Some(base_address) = memory::get_base_address(handle) {
        let target_address = base_address + address;
        let result = memory::read_memory_address_safe(handle, target_address);

        return match result {
            Some(address) => Ok(address),
            None => Err(io::Error::last_os_error()),
        };
    }
    eprintln!("Failed to get base address.");
    Err(io::Error::last_os_error())
}

fn add_win_streak(change: i32) -> io::Result<()> {
    let mut file = OpenOptions::new()
        .read(true)
        .write(true)
        .open(WIN_STREAK_FILE)?;
    let mut contents = String::new();
    file.read_to_string(&mut contents)?;
    let mut win_streak: i32 = contents.trim().parse().unwrap_or(0);
    win_streak += change;
    file.set_len(0)?;
    file.write_all(win_streak.to_string().as_bytes())?;
    println!("Win streak updated to: {}", win_streak);
    Ok(())
}

fn reset_win_streak() -> io::Result<()> {
    let mut file = OpenOptions::new().write(true).open(WIN_STREAK_FILE)?;
    file.set_len(0)?;
    file.write_all(b"0")?;
    println!("Win streak reset to: 0");
    Ok(())
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            start_game_status_monitor,
            stop_game_status_monitor
        ])
        .plugin(tauri_plugin_persisted_scope::init())
        .plugin(tauri_plugin_fs_watch::init())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

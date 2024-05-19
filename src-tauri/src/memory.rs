use std::mem;
use std::ptr::null_mut;
use sysinfo::System;

use winapi::ctypes::c_void;
use winapi::shared::minwindef::{BOOL, DWORD, HMODULE, TRUE};
use winapi::um::memoryapi::ReadProcessMemory;
use winapi::um::processthreadsapi::OpenProcess;
use winapi::um::psapi::EnumProcessModules;
use winapi::um::winnt::{HANDLE, PROCESS_QUERY_INFORMATION, PROCESS_VM_READ};

pub fn find_process_by_name(name: &str) -> Option<(HANDLE, u32)> {
    let mut system = System::new_all();

    system.refresh_all();

    for (pid, process) in system.processes() {
        if process.name().eq_ignore_ascii_case(name) {
            let pid_u32 = pid.as_u32();
            let handle =
                unsafe { OpenProcess(PROCESS_QUERY_INFORMATION | PROCESS_VM_READ, 0, pid_u32) };

            if handle.is_null() {
                return None;
            }
            return Some((handle, pid_u32));
        }
    }
    None
}

/// 32bitアプリケーションのベースアドレスを返却する
pub fn get_base_address(handle: HANDLE) -> Option<u32> {
    let mut h_mod: HMODULE = null_mut();
    let mut cb_needed = 0;

    let result: BOOL = unsafe {
        EnumProcessModules(
            handle,
            &mut h_mod,
            mem::size_of::<HMODULE>() as DWORD,
            &mut cb_needed,
        )
    };

    if result == TRUE {
        let base_address = h_mod as u32;
        return Some(base_address);
    }
    None
}

pub fn read_memory_address_safe(handle: HANDLE, target_address: u32) -> Option<u32> {
    let mut buffer: [u8; 4] = [0; 4];

    let result: BOOL = unsafe {
        ReadProcessMemory(
            handle,
            target_address as *const c_void,
            buffer.as_mut_ptr() as *mut c_void,
            buffer.len(),
            null_mut(),
        )
    };

    if result == TRUE {
        return Some(u32::from_le_bytes(buffer));
    }
    None
}

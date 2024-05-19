pub struct Address {
    pub victory: u32,
    pub death: u32,
    pub death_count: u32,
}

pub const ADDRESS_20240430: Address = Address {
    victory: 0xE05578,     // 勝利状態
    death: 0xE06704,       // 死亡状態 0/1
    death_count: 0xE06A78, //合計死亡回数
};

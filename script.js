/* ==========================
   Supabase 初期化
========================== */
const { createClient } = supabase;

const supabaseClient = createClient(
  "https://ntsywyieoxbysyrxpyio.supabase.co",
  "sb_publishable_yUFkp0_uTg2muAmPiwK4Qw_oLDdVGS5"
);

/* ==========================
   今日の日付セット
========================== */
document.addEventListener("DOMContentLoaded", () => {
  const today = new Date().toISOString().split("T")[0];
  document.getElementById("play_date").value = today;
  loadData();
});

/* ==========================
   保存
========================== */
async function saveData() {

  const games = Number(document.getElementById("games").value) || 0;
  const bb_single = Number(document.getElementById("bb_single").value) || 0;
  const bb_cherry = Number(document.getElementById("bb_cherry").value) || 0;
  const rb_single = Number(document.getElementById("rb_single").value) || 0;
  const rb_cherry = Number(document.getElementById("rb_cherry").value) || 0;

  const { error } = await supabaseClient
    .from("juggler_data")
    .insert([{
      play_date: document.getElementById("play_date").value,
      store: document.getElementById("store").value,
      machine: document.getElementById("machine").value,
      machine_number: Number(document.getElementById("number").value) || null,
      games: games,
      bb_single: bb_single,
      bb_cherry: bb_cherry,
      rb_single: rb_single,
      rb_cherry: rb_cherry,
      grape: Number(document.getElementById("grape").value) || 0,
      cherry: Number(document.getElementById("cherry").value) || 0
    }]);

  if (error) {
    alert("保存エラー: " + error.message);
    return;
  }

  alert("保存しました");

  // 入力クリア（実戦向け）
  document.querySelectorAll("input").forEach(input => {
    if (input.type !== "date") input.value = "";
  });

  loadData();
}

/* ==========================
   データ取得
========================== */
async function loadData() {

  const { data, error } = await supabaseClient
    .from("juggler_data")
    .select("*")
    .order("play_date", { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

  const list = document.getElementById("dataList");
  list.innerHTML = "";

  data.forEach(row => {

    const totalBB = (row.bb_single || 0) + (row.bb_cherry || 0);
    const totalRB = (row.rb_single || 0) + (row.rb_cherry || 0);
    const totalBonus = totalBB + totalRB;

    const gassan = totalBonus > 0
      ? "1/" + Math.floor(row.games / totalBonus)
      : "-";

    list.innerHTML += `
      <tr>
        <td>${row.play_date || ""}</td>
        <td>${row.machine_number || ""}</td>
        <td>${row.games || 0}</td>
        <td>${totalBB}</td>
        <td>${totalRB}</td>
        <td>${gassan}</td>
        <td>${row.grape || 0}</td>
        <td>${row.cherry || 0}</td>
        <td><button onclick="deleteData(${row.id})">削除</button></td>
      </tr>
    `;
  });
}

/* ==========================
   削除
========================== */
async function deleteData(id) {
  await supabaseClient
    .from("juggler_data")
    .delete()
    .eq("id", id);

  loadData();
}

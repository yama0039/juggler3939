/* ==========================
   Supabase 初期化（1回だけ）
========================== */
const { createClient } = supabase;

const supabaseClient = createClient(
  "https://ntsywyieoxbysyrxpyio.supabase.co",
  "sb_publishable_yUFkp0_uTg2muAmPiwK4Qw_oLDdVGS5"
);

/* ==========================
   今日の日付を自動セット
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

  const totalBonus = bb_single + bb_cherry + rb_single + rb_cherry;
  const gassan = totalBonus > 0 ? Math.floor(games / totalBonus) : null;

  const { error } = await supabaseClient
    .from("juggler_data")
    .insert([{
      play_date: document.getElementById("play_date").value,
      store: document.getElementById("store").value,
      machine: document.getElementById("machine").value,
      number: document.getElementById("number").value,
      games,
      bb_single,
      bb_cherry,
      rb_single,
      rb_cherry,
      grape: document.getElementById("grape").value,
      cherry: document.getElementById("cherry").value,
      gassan
    }]);

  if (error) {
    alert("保存エラー: " + error.message);
    return;
  }

  alert("保存しました");
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

    const totalBB = row.bb_single + row.bb_cherry;
    const totalRB = row.rb_single + row.rb_cherry;

    list.innerHTML += `
      <tr>
        <td>${row.play_date}</td>
        <td>${row.number}</td>
        <td>${row.games}</td>
        <td>${totalBB}</td>
        <td>${totalRB}</td>
        <td>${row.gassan ? "1/" + row.gassan : "-"}</td>
        <td>${row.grape}</td>
        <td>${row.cherry}</td>
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

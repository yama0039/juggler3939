async function saveData() {

  const { error } = await supabaseClient
  .from("juggler_data")
  .insert([{
    play_date: document.getElementById("play_date").value,
    store: document.getElementById("store").value,
    machine: document.getElementById("machine").value,
    machine_number: Number(document.getElementById("number").value) || null,
    games: Number(document.getElementById("games").value) || 0,
    bb_single: Number(document.getElementById("bb_single").value) || 0,
    bb_cherry: Number(document.getElementById("bb_cherry").value) || 0,
    rb_single: Number(document.getElementById("rb_single").value) || 0,
    rb_cherry: Number(document.getElementById("rb_cherry").value) || 0,
    grape: Number(document.getElementById("grape").value) || 0,
    cherry: Number(document.getElementById("cherry").value) || 0,
    invest: Number(document.getElementById("invest").value) || 0,
    payout: Number(document.getElementById("payout").value) || 0
  }]);

  if (error) {
    document.getElementById("msg").innerText = "保存エラー";
  } else {
    document.getElementById("msg").innerText = "保存成功！";
  }
}

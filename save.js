const { createClient } = supabase;

const supabaseClient = createClient(
  "https://ntsywyieoxbysyrxpyio.supabase.co",
  "sb_publishable_yUFkp0_uTg2muAmPiwK4Qw_oLDdVGS5"
);

document.addEventListener("DOMContentLoaded", () => {
  const today = new Date().toISOString().split("T")[0];
  document.getElementById("play_date").value = today;
});

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
      cherry: Number(document.getElementById("cherry").value) || 0
    }]);

  if (error) {
    alert("保存エラー: " + error.message);
    return;
  }

  alert("保存しました");

  document.querySelectorAll("input").forEach(input => {
    if (input.type !== "date") input.value = "";
  });
}

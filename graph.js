const { createClient } = supabase;

const supabaseClient = createClient(
  "https://ntsywyieoxbysyrxpyio.supabase.co",
  "sb_publishable_yUFkp0_uTg2muAmPiwK4Qw_oLDdVGS5"
);

async function loadGraph() {

  const { data, error } = await supabaseClient
    .from("juggler_data")
    .select("*")
    .order("play_date", { ascending: true });

  if (error) {
    console.error(error);
    return;
  }

  const labels = [];
  const gamesData = [];
  const gassanData = [];

  data.forEach(row => {

    const totalBB = (row.bb_single || 0) + (row.bb_cherry || 0);
    const totalRB = (row.rb_single || 0) + (row.rb_cherry || 0);
    const totalBonus = totalBB + totalRB;

    const gassan = totalBonus > 0
      ? row.games / totalBonus
      : null;

    labels.push(row.play_date);
    gamesData.push(row.games || 0);
    gassanData.push(gassan);
  });

  // 回転数グラフ
  new Chart(document.getElementById("gamesChart"), {
    type: "line",
    data: {
      labels: labels,
      datasets: [{
        label: "総回転数",
        data: gamesData,
        borderWidth: 2,
        tension: 0.2
      }]
    }
  });

  // 合算グラフ
  new Chart(document.getElementById("gassanChart"), {
    type: "line",
    data: {
      labels: labels,
      datasets: [{
        label: "合算確率（数値が低いほど良い）",
        data: gassanData,
        borderWidth: 2,
        tension: 0.2
      }]
    }
  });
}

document.addEventListener("DOMContentLoaded", loadGraph);

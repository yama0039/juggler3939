const { createClient } = supabase;

const supabaseClient = createClient(
  "https://ntsywyieoxbysyrxpyio.supabase.co",
  "sb_publishable_yUFkp0_uTg2muAmPiwK4Qw_oLDdVGS5"
);

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

async function deleteData(id) {
  await supabaseClient
    .from("juggler_data")
    .delete()
    .eq("id", id);

  loadData();
}

document.addEventListener("DOMContentLoaded", loadData);

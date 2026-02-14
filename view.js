async function loadData() {

  const { data, error } = await supabaseClient
  .from("juggler_data")
  .select("*")
  .order("play_date", { ascending: false });

  const list = document.getElementById("dataList");
  list.innerHTML = "";

  let total = 0;

  data.forEach(row => {

    const totalBB = (row.bb_single || 0) + (row.bb_cherry || 0);
    const totalRB = (row.rb_single || 0) + (row.rb_cherry || 0);
    const gassan = row.games ? Math.floor(row.games / (totalBB + totalRB || 1)) : "-";

    const invest = row.invest || 0;
    const payout = row.payout || 0;
    const diff = payout - invest;

    total += diff;

    list.innerHTML += `
      <tr>
        <td>${row.play_date || ""}</td>
        <td>${row.store || ""}</td>
        <td>${row.machine_number || ""}</td>
        <td>${row.games || 0}</td>
        <td>${totalBB}</td>
        <td>${totalRB}</td>
        <td>${gassan}</td>
        <td>${row.grape || 0}</td>
        <td>${row.cherry || 0}</td>
        <td>${invest}</td>
        <td>${payout}</td>
        <td style="color:${diff >= 0 ? 'red' : 'blue'}">${diff}</td>
        <td><button onclick="deleteData(${row.id})">削除</button></td>
      </tr>
    `;
  });

  document.getElementById("totalProfit").innerText =
    "累計収支: " + total + " 枚";
}

async function deleteData(id) {
  await supabaseClient
    .from("juggler_data")
    .delete()
    .eq("id", id);

  loadData();
}

loadData();

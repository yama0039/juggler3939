async function saveData() {

  const play_date = document.getElementById("play_date").value;
  const store = document.getElementById("store").value;
  const machine = document.getElementById("machine").value;
  const machine_number = parseInt(document.getElementById("number").value);
  const games = parseInt(document.getElementById("games").value);

  const bb_single = parseInt(document.getElementById("bb_single").value) || 0;
  const bb_cherry = parseInt(document.getElementById("bb_cherry").value) || 0;
  const rb_single = parseInt(document.getElementById("rb_single").value) || 0;
  const rb_cherry = parseInt(document.getElementById("rb_cherry").value) || 0;
  const grape = parseInt(document.getElementById("grape").value) || 0;
  const cherry = parseInt(document.getElementById("cherry").value) || 0;

  if (!play_date || !games) {
    alert("日付と総回転数は必須です");
    return;
  }

  const { error } = await supabaseClient
    .from("juggler_data")
    .insert([{
      play_date,
      store,
      machine,
      machine_number,
      games,
      bb_single,
      bb_cherry,
      rb_single,
      rb_cherry,
      grape,
      cherry
    }]);

  if (error) {
    alert("保存失敗: " + error.message);
  } else {
    alert("保存成功！");
    loadData();
  }
}

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

  data.forEach(record => {

    const bb_total = record.bb_single + record.bb_cherry;
    const rb_total = record.rb_single + record.rb_cherry;
    const bonus_total = bb_total + rb_total;

    const gassan = bonus_total > 0 ? (record.games / bonus_total).toFixed(1) : "-";
    const grape_rate = record.grape > 0 ? (record.games / record.grape).toFixed(1) : "-";
    const cherry_rate = record.cherry > 0 ? (record.games / record.cherry).toFixed(1) : "-";

    const row = `
      <tr>
        <td>${record.play_date}</td>
        <td>${record.store}</td>
        <td>${record.machine}</td>
        <td>${record.machine_number}</td>
        <td>${record.games}</td>
        <td>${bb_total}</td>
        <td>${rb_total}</td>
        <td>1/${gassan}</td>
        <td>1/${grape_rate}</td>
        <td>1/${cherry_rate}</td>
        <td><button onclick="deleteData(${record.id})">削除</button></td>
      </tr>
    `;
    list.innerHTML += row;
  });
}

async function deleteData(id) {
  await supabaseClient
    .from("juggler_data")
    .delete()
    .eq("id", id);

  loadData();
}

loadData();

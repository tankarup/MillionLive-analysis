let colors, labels;

//円グラフを生成
function generateCircle() {
    //colors = document.getElementById("colors").value.split(/\r\n|\n/);
    chart.data.datasets[0].data = Array(colors.length).fill(1);
    chart.data.datasets[0].backgroundColor = colors;
    chart.data.labels = labels;//document.getElementById("labels").value.split(/\r\n|\n/);
    console.log(chart.data);
    chart.update();
}

//ボタンを押したときにデータを更新
function update_data(){
	//カラーコードリスト
	colors = document.getElementById("colors").value.split(/\r\n|\n/);
	//カラーコードに対応した名称リスト
	labels = document.getElementById("labels").value.split(/\r\n|\n/);
}

//初期表示
update_data();
//グラフの初期化
const elem = document.getElementById("myChart");
const chart = new Chart(elem, {
    type: 'doughnut', // チャートのタイプ
    data: { // チャートの内容
        labels: labels,

        datasets: [{
            label: 'doughnut',
            lineTension: 0, // ベジェ曲線を無効化
            data: Array(colors.length).fill(1),
            backgroundColor: colors,
            borderWidth: 2,
        }]
    },
    options: {
        legend:{
            //position: 'right',
			display: false,
        }
    }
});
generateCircle();
generate_color_table();
//
function start_process(){
	update_data();
	generateCircle();
	generate_color_table();
}

//表計算ソフトに貼り付けられる表を生成
function generate_color_table(){
	let html = '<table>';
	html += `
		<tr>
			<td>色</td>
			<td>名称</td>
		</tr>
	`;

	for (let i = 0; i < colors.length; i++){
		html += `
			<tr>
				<td width="100"  style="background-color: ${colors[i]}"></td>
				<td style="font-size: 0.5em;">${labels[i]}</td>
			</tr>
			`;
	}

	html += '</table>';

	document.getElementById('color_table').innerHTML = html;
	console.log(html);
}
function generateCircle() {
    colors = document.getElementById("colors").value.split(/\r\n|\n/);
    chart.data.datasets[0].data = Array(colors.length).fill(1);
    chart.data.datasets[0].backgroundColor = colors;
    chart.data.labels = document.getElementById("labels").value.split(/\r\n|\n/);
    console.log(chart.data);
    chart.update();
}



let colors = document.getElementById("colors").value.split(/\r\n|\n/);
let labels = document.getElementById("labels").value.split(/\r\n|\n/);



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
            position: 'right'
        }
    }
});
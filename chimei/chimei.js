let map;
function init_map(){
	const gsi_pale_layer = L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png', {
		attribution: "<a href='https://maps.gsi.go.jp/development/ichiran.html' target='_blank'>地理院タイル</a>"
	});
	const gsi_std_layer = L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png', {
		attribution: "<a href='https://maps.gsi.go.jp/development/ichiran.html' target='_blank'>地理院タイル</a>"
	});
	let osm_layer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: '© <a href="http://osm.org/copyright">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
	});

	map = L.map('mapid', {
		center: [38.462, 137.582],
		zoom: 6,
		layers: [gsi_pale_layer],
	});
	var hash = new L.Hash(map);

	const url = location.href;
	const match = url.match(/#(\d{1,2})\/(-?\d[0-9.]*)\/(-?\d[0-9.]*)/);
	if (match){
		const [, zoom, lat, lon] = match;
		map.setView([lat, lon], zoom);
	} else {

	}

	//tileLayer.addTo(map);
	var baseMaps = {
		"地理院地図(淡色)": gsi_pale_layer,
		"地理院地図(標準)": gsi_std_layer,		
		"OSM": osm_layer,
	};
	
	var overlayMaps = {
	};
	for (let idol in idol_places){
		overlayMaps[idol] = create_cluster(idol);
	}
	L.control.layers(baseMaps, overlayMaps,
		{
			collapsed: false,
			autoZIndex: false,
		}).addTo(map);
}
function init_menu(){
	let html = '';
	for (let idol in idol_places){
		html += `
			<div class="idol_checkbox">
				<input type="checkbox" id="checkbox${idol}" name="${idol}">
				<label for="checkbox${idol}">${idol}</label>
			</div>
		`;
	}
	document.getElementById('idol_selector').innerHTML = html;
}

function create_cluster(idol_name){

	let chihaya = idol_places[idol_name];
	const className = `cluster${idol_name}`;
	const cluster = L.markerClusterGroup({
		disableClusteringAtZoom: 16,
		
		iconCreateFunction: function (c) {
			const markers = c.getAllChildMarkers();

			return L.divIcon({ html: `${idol_name[0]}${markers.length}`, className: className, iconSize: L.point(40, 40) });
		},
		
	});
	//https://www.it-swarm-ja.com/ja/javascript/javascript%E3%81%A7css%E3%82%AF%E3%83%A9%E3%82%B9%E3%82%92%E5%8B%95%E7%9A%84%E3%81%AB%E4%BD%9C%E6%88%90%E3%81%97%E3%81%A6%E9%81%A9%E7%94%A8%E3%81%99%E3%82%8B%E6%96%B9%E6%B3%95/968930476/
	var style = document.createElement('style');
	const color = chroma(idol2color[idol_name]).alpha(0.8).css();
	style.innerHTML = `.${className} {
		background-color: ${color};
		line-height:40px;
		text-align: center;
		border-radius: 25px;
		border: solid 2px white;
	}`;
	document.getElementsByTagName('head')[0].appendChild(style);

	for (let place of chihaya){

		options = {
			//prefix: 'fa',
		   //icon: 'utensils',
		   iconShape: 'marker',
		   borderColor: 'white',
		   textColor: '#fff',
		   backgroundColor: idol2color[idol_name],
		   isAlphaNumericIcon: true,
		   text: idol_name[0],
		};
		const marker = L.marker([parseFloat(place.lat),parseFloat(place.lon)], { icon: L.BeautifyIcon.icon(options), draggable: false }).bindPopup(`${place.name}<br>${place.kana}`);
		marker.on('mouseover', function (e) {
            this.openPopup();
        });
        marker.on('mouseout', function (e) {
            this.closePopup();
        });
		cluster.addLayer(marker);



	}
	return cluster;
}

function create_markers(idol_name){
	let data = [];
	let chihaya = idol_places[idol_name];
	for (let place of chihaya){

		options = {
			//prefix: 'fa',
		   //icon: 'utensils',
		   iconShape: 'marker',
		   borderColor: 'white',
		   textColor: '#fff',
		   backgroundColor: idol2color[idol_name],
		   isAlphaNumericIcon: true,
		   text: idol_name[0],
		};
		const marker = L.marker([parseFloat(place.lat),parseFloat(place.lon)], { icon: L.BeautifyIcon.icon(options), draggable: true }).bindPopup(`${place.name}<br>${place.kana}`);
		marker.on('mouseover', function (e) {
            this.openPopup();
        });
        marker.on('mouseout', function (e) {
            this.closePopup();
        });
		data.push(marker);


	}
	const places = L.layerGroup(data);

	return places;
}
function create_heatmap(idol_name){
	let data = [];
	let chihaya = idol_places[idol_name];
	for (let place of chihaya){
		data.push([parseFloat(place.lat),parseFloat(place.lon),1]);
	}
	const heat = L.heatLayer(
		data,
		{
			radius: 25,
			minOpacity: 0.4,
			max: 1,
			gradient : {1: idol2color[idol_name]},
		});
	return heat;
}
function init(){
	init_map();
	//create_heatmaps();
}


const idol_colors = `天海春香	#e22b30
如月千早	#2743d2
星井美希	#b4e04b
萩原雪歩	#d3dde9
高槻やよい	#f39939
菊地真	#515558
水瀬伊織	#fd99e1
四条貴音	#a6126a
秋月律子	#01a860
三浦あずさ	#9238be
双海亜美	#ffe43f
双海真美	#ffe43e
我那覇響	#01adb9
春日未来	#ea5b76
最上静香	#6495cf
伊吹翼	#fed552
田中琴葉	#92cfbb
島原エレナ	#9bce92
佐竹美奈子	#58a6dc
所恵美	#454341
徳川まつり	#5abfb7
箱崎星梨花	#ed90ba
野々原茜	#eb613f
望月杏奈	#7e6ca8
ロコ	#fff03c
七尾百合子	#c7b83c
高山紗代子	#7f6575
松田亜利沙	#b54461
高坂海美	#e9739b
中谷育	#f7e78e
天空橋朋花	#bee3e3
エミリー	#554171
北沢志保	#afa690
舞浜歩	#e25a9b
木下ひなた	#d1342c
矢吹可奈	#f5ad3b
横山奈緒	#788bc5
二階堂千鶴	#f19557
馬場このみ	#f1becb
大神環	#ee762e
豊川風花	#7278a8
宮尾美也	#d7a96b
福田のり子	#eceb70
真壁瑞希	#99b7dc
篠宮可憐	#b63b40
百瀬莉緒	#f19591
永吉昴	#aeb49c
北上麗花	#6bb6b0
周防桃子	#efb864
ジュリア	#d7385f
白石紬	#ebe1ff
桜守歌織	#274079
`;
let idol2color = {};
const lines = idol_colors.split('\n');
for (let line of lines){
	const items = line.split('\t');
	if (items.length < 2) continue;
	idol2color[items[0]] = items[1];
}

init();
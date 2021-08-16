// DOM element where the Timeline will be attached
var container = document.getElementById('visualization');
const data = `
アケマス	2005-07-26		game	point	アイマス
箱マス	2007-01-25		game	point	アイマス
L4U!	2008-02-28		game	point	アイマス
SP	2009-02-19		game	point	アイマス
DS	2009-09-17		game	point	アイマス
モバイル	2010-12-21		game	point	アイマス
アイマス2	2011-02-24		game	point	アイマス
モバイルi	2012-03-30	2016-01-18	game	range	アイマス
SHINY FESTA	2012-10-25		game	point	アイマス
OFA	2014-05-15		game	point	アイマス
マストソングス	2015-12-10		game	point	アイマス
プラチナスターズ	2016-07-28		game	point	アイマス
ステラステージ	2017-12-21		game	point	アイマス
スターリットシーズン	2021-10-04		game	point	アイマス
発表	2013-02-04		game	point	ミリオン
ミリオンライブ	2013-02-27	2018-03-19	game	range	ミリオン
ミリシタ	2017-06-29	継続中	game	range	ミリオン
ミリラジ	2013-05-03	継続中	radio	range	ミリオン
ミシシタ	2021-08-16	継続中	radio	range	ミリオン
みりおんコミックシアター	2014-03-26	2018-03-19	comic	range	ミリオン
ゲッサン	2014-07-11	2016-09-12	comic	range	ミリオン
バックステージ	2014-07-22	2016-09-22	comic	range	ミリオン
Road to stage	2016-10-22	2019-04-22	comic	range	ミリオン
輝きの向こう側へ!	2014-01-25		anime	point	アイマス
ミリシタ4コマ	2017-12-27	継続中	comic	range	ミリオン
デレマス	2011-11-28	継続中	game	range	シンデレラ
デレステ	2015-09-03	継続中	game	range	シンデレラ
シャニマス	2018-04-24	継続中	game	range	シャニマス
SideM	2014-02-28	継続中	game	range	SideM
LIVE ON ST@GE!	2017-08-30	継続中	game	range	SideM
ポプマス	2021-01-21	継続中	game	range	ポプマス
ぷちます！	2008-09-01	継続中	comic	point	アイマス
アニマス	2011-07-07	2011-12-22	anime	range	アイマス
アニデレ	2015-01-01	2015-10-01	anime	range	シンデレラ
アニM	2017-10-01	2017-12-01	anime	range	SideM
THE IDOLM@STER RADIO	2006-04-09	2009-07-26	radio	range	アイマス
THE IDOLM@STER STATION!!!	2009-08-02	2013-03-31	radio	range	アイマス
ラジオdeアイマSHOW!	2006-04-27	2007-10-25	radio	range	アイマス
WEBラジ☆ショッピングマスター	2007-03-23	2007-07-27	radio	range	アイマス
アイドルマスター Radio For You!	2007-11-15	2008-09-24	radio	range	アイマス
アイドルマスター P.S.プロデューサー	2008-10-08	2009-09-16	radio	range	アイマス
ラジオdeアイマSTAR☆	2009-10-08	2011-03-31	radio	range	アイマス
ラジオdeアイマCHU!!	2011-04-21	2014-11-27	radio	range	アイマス
アイマスタジオ	2011-04-08	2016-02-20	radio	range	アイマス
THE IDOLM@STER webラジオ	2011-12-23	2019-03-05	radio	range	アイマス
THE IDOLM@STER STATION!!+	2013-04-01	2014-09-29	radio	range	アイマス
THE IDOLM@STER STATION!!!	2014-10-08	2018-10-16	radio	range	アイマス
ディアリーステーション	2009-07-11	2009-08-31	radio	range	アイマス
ぷちます! 増刊号	2012-12-27	2013-03-30	radio	range	アイマス
しんげき	2017-04-04	2019-06-01	anime	range	シンデレラ
XENOGLOSSIA	2007-04-01	2007-09-01	anime	range	アイマス

`;
const lines = data.split('\n');
let datasets = [];
let id = 0;
let group_labels = [];
for (let line of lines) {
    const items = line.split('\t');
    if (items.length < 2) continue;
    let dataset = {
        id: id++,
        content: items[0],
        start: items[1],
        className: items[3],
        type: items[4],
        group: items[5],
        //end: items[2],
		title: `${items[1]}`,
    };
    if (items[2]) {
        if (items[2] == '継続中'){
            dataset.end = new Date();
			dataset.title += '～';
        } else {
            dataset.end = items[2];
			dataset.title += '～' + items[2];
        }
		//ツールチップ
		
        
    }
    datasets.push(dataset);
    group_labels.push(items[5]);
}
group_labels = group_labels.filter(function (x, i, self) {
    return self.indexOf(x) === i;
});
let group_list = [];
for (let group_label of group_labels) {
    group_list.push({
        id: group_label,
        content: group_label,
    });
}
const groups = new vis.DataSet(group_list);

// Create a DataSet (allows two way data-binding)
var items = new vis.DataSet(datasets);

function customOrder(a, b) {
    // order by id
    //return a.id - b.id;
}

// Configuration for the Timeline
var options = {
    order: customOrder,
    width: '100%',
    maxHeight: document.documentElement.clientHeight * 0.8,
    showCurrentTime: true,

};


// Create a Timeline
var timeline = new vis.Timeline(container, items, groups, options);

window.addEventListener('resize', function(){
    timeline.setOptions({
        maxHeight: document.documentElement.clientHeight * 0.8,
    });
});
timeline.addCustomTime(new Date(), 'customtime');
const idol_list = [
    /*
    ["春香","images/haruka.png","#e22b30"],
    ["千早","images/chihaya.png","#2743d2"],
    ["美希","images/miki.png","#b4e04b"],
    ["雪歩","images/yukiho.png","#d3dde9"],
    ["やよい","images/yayoi.png","#f39939"],
    ["真","images/makoto.png","#515558"],
    ["伊織","images/iori.png","#fd99e1"],
    ["貴音","images/takane.png","#a6126a"],
    ["律子","images/ritsuko.png","#01a860"],
    ["あずさ","images/azusa.png","#9238be"],
    ["亜美","images/ami.png","#ffe43f"],
    ["真美","images/mami.png","#ffe43e"],
    ["響","images/hibiki.png","#01adb9"],
    */
   /*
    ["未来","images/mirai.png","#ea5b76"],
    ["静香","images/shizuka.png","#6495cf"],
    ["翼","images/tsubasa.png","#fed552"],
    ["琴葉","images/kotoha.png","#92cfbb"],
    ["エレナ","images/elena.png","#9bce92"],
    ["美奈子","images/minako.png","#58a6dc"],
    ["恵美","images/megumi.png","#454341"],
    ["まつり","images/matsuri.png","#5abfb7"],
    ["星梨花","images/serika.png","#ed90ba"],
    ["茜","images/akane.png","#eb613f"],
    ["杏奈","images/anna.png","#7e6ca8"],
    ["ロコ","images/roco.png","#fff03c"],
    ["百合子","images/yuriko.png","#c7b83c"],
    ["紗代子","images/sayoko.png","#7f6575"],
    ["亜利沙","images/arisa.png","#b54461"],
    ["海美","images/umi.png","#e9739b"],
    ["育","images/iku.png","#f7e78e"],
    ["朋花","images/tomoka.png","#bee3e3"],
    ["エミリー","images/emily.png","#554171"],
    ["志保","images/shiho.png","#afa690"],
    ["歩","images/ayumu.png","#e25a9b"],
    ["ひなた","images/hinata.png","#d1342c"],
    ["可奈","images/kana.png","#f5ad3b"],
    ["奈緒","images/nao.png","#788bc5"],
    ["千鶴","images/chizuru.png","#f19557"],
    ["このみ","images/konomi.png","#f1becb"],
    ["環","images/tamaki.png","#ee762e"],
    ["風花","images/fuka.png","#7278a8"],
    ["美也","images/miya.png","#d7a96b"],
    ["のり子","images/noriko.png","#eceb70"],
    ["瑞希","images/mizuki.png","#99b7dc"],
    ["可憐","images/karen.png","#b63b40"],
    ["莉緒","images/rio.png","#f19591"],
    ["昴","images/subaru.png","#aeb49c"],
    ["麗花","images/reika.png","#6bb6b0"],
    ["桃子","images/momoko.png","#efb864"],
    ["ジュリア","images/julia.png","#d7385f"],
    ["紬","images/tsumugi.png","#ebe1ff"],
    ["歌織","images/kaori.png","#274079"],
    */
   
   ["星梨花(琴葉カラー)","images/serika.png","#92cfbb"],
   ["琴葉(星梨花カラー)","images/kotoha.png","#ed90ba"],
    
];

let idols = [];
for (let item of idol_list){
    idols.push({
        label: item[0],
        image: item[1],
        color: item[2],
    });
}

function init(){
    const image_area = document.getElementById('image_area');
    for (let idol of idols){
        const font_color = chroma.contrast(idol.color, 'white') > chroma.contrast(idol.color, 'black') ? 'white' : 'black';
        let idol_html = '';
        idol_html += `
            <div style="float:left; text-align: center;">
                
                <canvas id="orig${idol.label}">${idol.label}</canvas>
                <canvas id="new${idol.label}">${idol.label}</canvas>
                
                <p style="background-color: ${idol.color}; color: ${font_color}">${idol.label}</p>
            </div>
        `;
        image_area.insertAdjacentHTML('beforeend', idol_html);
        
        const canvas = document.getElementById('orig' + idol.label);
        const context = canvas.getContext('2d');
        const new_canvas = document.getElementById('new' + idol.label);
        const new_context = new_canvas.getContext('2d');
        const img = new Image();
        img.src = idol.image;
        img.onload = () => {
            const scale = 0.3;
            const width = img.width * scale;
            const height = img.height * scale;
            canvas.width = width;
            canvas.height = height;
            context.drawImage(img, 0, 0, img.width, img.height, 0, 0, width, height);

            new_canvas.width = width;
            new_canvas.height = height;
            new_context.globalAlpha = 0.1; //透過させて薄く表示
            new_context.drawImage(img, 0, 0, img.width, img.height, 0, 0, width, height);
            
            const image_data = context.getImageData(0,0,width,height);
            let new_image_data = new_context.getImageData(0,0,width,height);
            for (let i = 0; i < image_data.data.length; i += 4){
                const r = image_data.data[i];
                const g = image_data.data[i+1];
                const b = image_data.data[i+2];

                const color = chroma([r,g,b]);
                if (chroma.deltaE(color, idol.color) < 15){
                    new_image_data.data[i] = 255;
                    new_image_data.data[i+1] = 0;
                    new_image_data.data[i+2] = 0;
                    new_image_data.data[i+3] = 255;
                }

            }
            new_context.putImageData(new_image_data,0,0);


            /*
            for (let w = 0; w < canvas.width; w++){
                for (let h = 0; h < canvas.height; h++){
                    const image_data = context.getImageData(w,h,1,1);
                    const d = image_data.data;
                    //console.log(image_data.data);
                    
                    const color = chroma([d[0],d[1],d[2]]);
                    //console.log(image_data.data.slice(0,3));
                    if (chroma.deltaE(color, idol.color) < 15){
                        let new_image_data = image_data;
                        new_image_data.data[0] = 255;
                        new_image_data.data[1] = 0;
                        new_image_data.data[2] = 0;
                        new_context.putImageData(new_image_data,w,h);
                    }
                }
            }
            */

        }
    }

}
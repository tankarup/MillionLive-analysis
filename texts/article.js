/*
    article.js  -- a programme to give html some LaTeX like features

    Copyright (C) 2016 Kabipanotoko

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

/*------------------------------------設定--------------------------------------------*/

/* 図番号書式 */
var figurePrefix="<span class=\"figureNum\">図";  // a 要素が空の場合の接頭辞
var figureSuffix="</span>";                       // 同じく接尾辞
var figurePrefixAux="(<span class=\"figureNum aux\">図"; // a 要素が空でない場合の接頭辞
var figureSuffixAux="</span>)";                          // 同じく接尾辞

/* 表番号書式 */
var tablePrefix="<span class=\"tableNum\">表"    // a 要素が空の場合の接頭辞
var tableSuffix="</span>";                       // 同じく接尾辞
var tablePrefixAux="(<span class=\"tableNum aux\">表"    // a 要素が空でない場合の接頭辞
var tableSuffixAux="</span>)";                           // 同じく接尾辞

/* 文献参照書式 */
var biblioPrefix="<span class=\"biblioNum\">[";     // a 要素が空の場合の接頭辞
var biblioSuffix="]</span>";                        // 同じく接尾辞
var biblioPrefixAux="<span class=\"biblioNum aux\">[";    // a 要素が空でない場合の接頭辞
var biblioSuffixAux="]</span>";                           // 同じく接尾辞

/* 注釈書式 */
var notePosition="h4";      // 注釈本体を挿入する単位とする要素名
                            // h1,h2,...   h1,h2,...
                            // h           h6 に同じ
                            // body        文書の最後
                            // here        その場
var noteElementName="p";    // 注釈本体を入れる要素名
var noteClass="note";       // 注釈本体を入れる要素につけられるクラス名
var noteNumPrefix="<span class=\"noteNum\">";       // 注釈本体につく番号の接頭辞
var noteNumSuffix="</span>";                        // 同じく接尾辞
var noteTextPrefix="<span class=\"noteText\">";     // 注釈本体テキストの前に置く
var noteTextSuffix="</span>";                       // 注釈本体テキストの後に置く
var noteNumRef="noteNumRef"  // 本文に挿入する注釈番号を入れる span のクラス名



/* その他 */
var  captionSeparator="&nbsp;";  // 図・表番号とキャプション文字列の区切り
var dummyText="[link]";  // a 要素がこの文字列のみの場合、a 要素は空と見倣す

/*------------------------------------設定おわり--------------------------------------*/

window.addEventListener("load",doArticle,false);

function doArticle () {
    addBiblioNum();        // 文献番号生成
    addSectionNum ();      // 章節番号生成
    addFigureNum ();       // 図番号生成
    addTableNum ();        // 表番号生成
    expandRefs();          // 本文中の参照生成
    makeNotes();           // 注釈生成
    makeIndex ();          // 目次生成
}

function makeIndex () {
    var ul = document.querySelector("ul.tableOfContents");
    if (ul) {
	var body = document.getElementsByTagName("body")[0];
	var nodes = document.querySelectorAll("h1,h2,h3,h4,h5,h6");
	var h1AsTitle = document.getElementsByTagName("h1").length < 2;
	for (var i=0; i < nodes.length; i++ ) {
	    if (h1AsTitle && nodes[i].tagName=="H1") {
		continue;
	    }
	    var li = document.createElement("li");
	    var link = document.createElement("a");
	    link.innerHTML = nodes[i].innerHTML;
	    var refName = nodes[i].getAttribute("id") || "ref" + i.toString();
	    link.setAttribute("href", "#" + refName);
	    nodes[i].getAttribute("id") || nodes[i].setAttribute("id",refName);
	    li.appendChild(link);
	    li.setAttribute("class",nodes[i].nodeName);
	    ul.appendChild(li);
	}
    }
}

function addSectionNum () {
    var body = document.getElementsByTagName("body")[0];
    var nodes = document.querySelectorAll("h1,h2,h3,h4");
    var h1AsIndex = document.getElementsByTagName("h1").length > 1;
    var h1n = 0;
    var h2n = 0;
    var h3n = 0;
    var h4n = 0;
    for (var i=0; i < nodes.length; i++ ) {
	if (nodes[i].tagName == "H1") {
	    nodes[i].setAttribute("data-h1n",++h1n); 
	    nodes[i].setAttribute("data-h2n",0);     h2n=0;
	    nodes[i].setAttribute("data-h3n",0);     h3n=0;
	    nodes[i].setAttribute("data-h4n",0);     h4n=0;
	    if (h1AsIndex) {
		nodes[i].innerHTML=h1n.toString()+"."+" "+nodes[i].innerHTML;
	    }
	} else if (nodes[i].tagName == "H2") {
	    nodes[i].setAttribute("data-h2n",++h2n);
	    nodes[i].setAttribute("data-h3n",0);     h3n=0;
	    nodes[i].setAttribute("data-h4n",0);     h4n=0;
	    if (h1AsIndex) {
		nodes[i].innerHTML=h1n.toString()+"."+h2n.toString()+"."+
		    " "+nodes[i].innerHTML;
	    } else {
		nodes[i].innerHTML=h2n.toString()+"."+" "+nodes[i].innerHTML;
	    }
	} else if (nodes[i].tagName == "H3") {
	    nodes[i].setAttribute("data-h2n",h2n);
	    nodes[i].setAttribute("data-h3n",++h3n);
	    nodes[i].setAttribute("data-h4n",0);     h4n=0;
	    if (h1AsIndex) { 
		nodes[i].innerHTML=h1n.toString()+"."+h2n.toString()+
		    "."+h3n.toString()+"."+" "+nodes[i].innerHTML;
	    } else {
		nodes[i].innerHTML=h2n.toString()+
		    "."+h3n.toString()+"."+" "+nodes[i].innerHTML;
	    } 
	} else if (nodes[i].tagName == "H4") {
	    nodes[i].setAttribute("data-h2n",h2n);
	    nodes[i].setAttribute("data-h3n",h3n);
	    nodes[i].setAttribute("data-h4n",++h4n);
	    if (h1AsIndex) { 
		nodes[i].innerHTML=h1n.toString()+"."+
		    h2n.toString()+"."+h3n.toString()+"."+
		    h4n.toString()+"."+" "+nodes[i].innerHTML;
	    } else {
		nodes[i].innerHTML=
		    h2n.toString()+"."+h3n.toString()+"."+
		    h4n.toString()+"."+" "+nodes[i].innerHTML;
	    }
	}
    }
}

function expandRefs () {
    var body = document.getElementsByTagName("body")[0];
    var cites = document.querySelectorAll("[href]");
    var h1AsIndex = document.getElementsByTagName("h1").length > 1;
    for (var i=0; i < cites.length; i++ ) {
	var ref = cites[i].getAttribute("href");
	if (! /^#/.test(ref)) continue;
	ref=ref.replace(/^#/,"");
	var target = document.getElementById(ref);
	if (/^h[1-4]$/i.test(target.tagName)) {
	    if (h1AsIndex) {
		var section = target.getAttribute("data-h1n")+"."+target.getAttribute("data-h2n")+"."+
		target.getAttribute("data-h3n")+"."+target.getAttribute("data-h4n");
	    } else {
		var section = target.getAttribute("data-h2n")+"."+
		target.getAttribute("data-h3n")+"."+target.getAttribute("data-h4n");
	    }
	    section = section.replace(/(\.0)*\.0$/,"");
	    if (cites[i].innerHTML && cites[i].innerHTML != dummyText) {
		cites[i].innerHTML = cites[i].innerHTML + "(" + section + ")";
	    } else {
		cites[i].textContent=section;
	    }
	} else if (/^li$/i.test(target.tagName) && 
		   target.parentNode.getAttribute("class")=="biblio") {
	    var bibNum = target.getAttribute("bibnum").toString();
	    if(cites[i].innerHTML) {
		cites[i].innerHTML = cites[i].innerHTML + 
		    biblioPrefixAux + bibNum + biblioSuffixAux;
	    } else {
		cites[i].innerHTML = biblioPrefix + bibNum+ biblioSuffix;
	    }
	} else if (/^table$/i.test(target.tagName) &&
		   target.getElementsByTagName("caption").length >0 ) {
	    var tblNum = target.getAttribute("tblnum").toString();
	    if(cites[i].innerHTML) {
		cites[i].innerHTML = cites[i].innerHTML + tablePrefixAux + tblNum + tableSuffixAux;
	    } else {
		cites[i].innerHTML=tablePrefix + tblNum + tableSuffix;
	    }
	} else if (/^figure$/i.test(target.tagName)) {
	    var figNum = target.getAttribute("fignum").toString();
	    if(cites[i].innerHTML) {
		cites[i].innerHTML = cites[i].innerHTML + 
		    figurePrefixAux + figNum + figureSuffixAux;
	    } else {
		cites[i].innerHTML=figurePrefix + figNum + figureSuffix;
	    }
	}
    }
}

function bibSortByAppearanceOrder () {
    var ul = document.querySelector("ul.biblio");
    var liList = ul.querySelectorAll("li");
    var aList = document.getElementsByTagName("a");
    for (var i=0; i < liList.length; i++ ) {
	for (var k=0; k < aList.length; k++) {
	    if (liList[i].getAttribute("id") == aList[k].getAttribute("href").replace(/^#/,"")) {
		ul.insertBefore(ul.removeChild(liList[i]),ul.childNodes[0]);
	    }
	}
    }
}

function bibSortByKey () {
    var ul = document.querySelector("ul.biblio");
    var liList = ul.querySelectorAll("li");
    var liArray = Array.prototype.slice.call(liList, 0);
    liArray.sort(function(a,b){var ak=a.getAttribute("data-key"); 
			       var bk = b.getAttribute("data-key");
			       if (ak > bk) return -1;
			       if (ak < bk) return 1;
			       return 0;})
    for (var i=0; i < liArray.length; i++) {
	ul.insertBefore(ul.removeChild(liArray[i]),ul.childNodes[0]);
    }
}

function compareKeys (a,b) {
    if (a[1] > b[1]) return 1;
    if (a[1] < b[1]) return -1;
    return 0;
}

function addBiblioNum () {
    var ul = document.querySelector("ul.biblio");
    if (ul) {
	if (ul.getAttribute("data-sort")=="byAppearanceOrder") {  
	    bibSortByAppearanceOrder (); 
	} else if (ul.getAttribute("data-sort")=="byKey") {  
	    bibSortByKey (); 
	}
	var liList = ul.querySelectorAll("li");
	var aList = document.querySelectorAll("a");
	for (var i=0; i < liList.length; i++ ) {
	    j=i+1;
	    liList[i].setAttribute("bibnum",j.toString());
	    liList[i].innerHTML = biblioPrefix + j.toString() + biblioSuffix + liList[i].innerHTML;
	}
    }
}

function addFigureNum () {
    var lis = document.querySelectorAll("figure");
    var figNum = 1;
    for (var i=0; i < lis.length; i++ ) {
	var figCaps = lis[i].getElementsByTagName("figcaption");
	if (figCaps.length<1) {
	    var figCap=document.createElement("figcaption");
	    figCap.innerHTML = figurePrefix + figNum.toString()+"." + figureSuffix;
	    lis[i].appendChild(figCap);
	} else {
	    figCaps[0].innerHTML = figurePrefix + figNum.toString()+"." + figureSuffix + captionSeparator
		+ figCaps[0].innerHTML;
	}
	lis[i].setAttribute("fignum", figNum.toString());
	figNum++;
    }
}

function addTableNum () {
    var lis = document.querySelectorAll("table");
    var tblNum=1;
    for (var i=0; i < lis.length; i++ ) {
	var tblCaps = lis[i].getElementsByTagName("caption");
	if (tblCaps.length>0) {
	    tblCaps[0].innerHTML = tablePrefix+tblNum.toString()+"."+tableSuffix + captionSeparator
		+ tblCaps[0].innerHTML;
	    tblCaps[0].parentNode.setAttribute("tblnum", tblNum.toString());
	    tblNum++;
	}
    }
}
   
function makeNotes () {
    var body = document.getElementsByTagName("BODY")[0];
    var allElementsList = document.querySelectorAll("*");
    var lis = document.querySelectorAll("span.note");
    var notePositionRule;
    if (notePosition == "h") { notePosition="h6"; }
    if (notePosition == "h6") { notePositionRule=/^H[1-6]$/; }
    else if (notePosition == "h5") { notePositionRule=/^H[1-5]$/; }
    else if (notePosition == "h4") { notePositionRule=/^H[1-4]$/; }
    else if (notePosition == "h3") { notePositionRule=/^H[1-3]$/; }
    else if (notePosition == "h2") { notePositionRule=/^H[12]$/; }
    else if (notePosition == "h1") { notePositionRule=/^H1$/; }
    else if (notePosition == "here") { notePositionRule=null; }
    else if (notePosition == "body") { notePositionRule=null; }
    var hs = {};
    if (notePositionRule) {
	for (var i=0; i < allElementsList.length; i++) {
	    if (notePositionRule.test(allElementsList[i].nodeName)) {
		hs[i]=true;
	    }
	}
    }
    var noteCounter=1;
    for (var i=0; i < lis.length; i++) {
	var noteElement = document.createElement(noteElementName);
	noteElement.setAttribute("class", noteClass);
	if (notePositionRule) {
	    block_a: {
		for(var j=0; j < allElementsList.length; j++){
		    if(lis[i]===allElementsList[j]){
			for (var k=j+1; k < allElementsList.length; k++){
			    if (notePositionRule.test(allElementsList[k].nodeName)) {
				if(hs[k]) {hs[k]=false; noteCounter=0; }
				noteCounter++;
				noteElement.innerHTML = noteNumPrefix + noteCounter.toString() 
				    + noteNumSuffix 
				    + noteTextPrefix + lis[i].innerHTML + noteTextSuffix;
				allElementsList[k].parentNode.insertBefore(noteElement,
									   allElementsList[k]);
				break block_a;
			    }
			}
			body.appendChild(noteElement);
		    }
		}
	    }
	} else if (notePosition=="body") {
	    body.appendChild(noteElement);
	}
    	lis[i].innerHTML = noteCounter.toString();
	lis[i].setAttribute("class", "noteNumRef");
    }
}


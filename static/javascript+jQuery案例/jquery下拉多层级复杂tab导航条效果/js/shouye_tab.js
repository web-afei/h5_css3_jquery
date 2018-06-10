// JavaScript Document
//选项卡
function setTab(name,cursel,n){
for(i=1;i<=n;i++){
var menu=document.getElementById(name+i);
var con=document.getElementById("con_"+name+"_"+i);
menu.className=i==cursel?"hover01":"";
con.style.display=i==cursel?"block":"none";
}
} 


function setTab1(name,cursel,n){
for(i=1;i<=n;i++){
var menu=document.getElementById(name+i);
var con=document.getElementById("con_"+name+"_"+i);
menu.className=i==cursel?"hover02":"";
con.style.display=i==cursel?"block":"none";
}
} 

function setTab3(name,cursel,n){
for(i=1;i<=n;i++){
var menu=document.getElementById(name+i);
var con=document.getElementById("con_"+name+"_"+i);
menu.className=i==cursel?"hover03":"";
con.style.display=i==cursel?"block":"none";
}
} 


function setTab2(name, cursel, n,obj) {
		obj.t=setTimeout(function(){
				for (i = 1; i <= n; i++) {
					var menu = document.getElementById(name + i);
					var con = document.getElementById("con_" + name + "_" + i);
					menu.className = i == cursel ? "hover03" : "";
					con.style.display = i == cursel ? "block" : "none";
				}
										},1000)
			//当鼠标在规定时间内移开时，停止切换
			obj.onmouseout=function(){clearTimeout(this.t)}
        }

function setTab8(name,cursel,n){
for(i=1;i<=n;i++){
var menu=document.getElementById(name+i);
var con=document.getElementById("con_"+name+"_"+i);
menu.className=i==cursel?"hover01":"";
con.style.display=i==cursel?"block":"none";
}
} 

var ym=0;
var ny=0;

createElement = function(container, type, param){
	o=document.createElement(type);
	for(var i in param)o[i]=param[i];
	container.appendChild(o);
	return o;
}

mooz = {
	O:[],
	/////////
	mult:6,
	nbI:5,
	/////////
	rwh:0,
	imgsrc:0,
	W:0,
	H:0,

	Xoom:function(N){
		this.o = createElement(document.getElementById("screen"), "span", {
			'className':'spanSlide'
		});
		img = createElement(this.o, "img", {
			'className':"imgSlide",
			'src':mooz.imgsrc[N%mooz.imgsrc.length].src
		});
		spa = createElement(this.o, "span", {
			'className':"imgSlide"
		});
		txt = createElement(spa, "span", {
			'className':"txtSlide",
			'innerHTML':mooz.imgsrc[N%mooz.imgsrc.length].title
		});
		this.N = 10000+N;
	},

	mainloop:function(){
		with(this){
			for(i=0; i<mooz.nbI; i++) {
				O[i].N += (ym-ny)/8000;
				N = O[i].N%nbI;
				ti = Math.pow(mult,N);
				with(O[i].o.style){
					left   = Math.round((W-(ti*rwh))/(W+ti)*(W*.5))+"px";
					top    = Math.round((H-ti)/(H+ti)*(H*.5))+"px";
					zIndex = Math.round(10000-ti*.1);
					width  = Math.round(ti*rwh)+"px";
					height = Math.round(ti)+"px";
				}
			}
		}
		setTimeout("mooz.mainloop();", 16);
	},

	oigres:function(){
		with(this){
			W = parseInt(document.getElementById("screen").style.width);
			H = parseInt(document.getElementById("screen").style.height);
			imgsrc = document.getElementById("images").getElementsByTagName("img");
			rwh = imgsrc[0].width/imgsrc[0].height;
			for(var i=0;i<nbI;i++) O[i] = new Xoom(i);
			mainloop();
		}
	}
}

document.onmousemove = function(e){
	if(window.event) e=window.event;
	ym = (e.y || e.clientY);
	if(ym/2>ny)ny=ym/2;
}

window.onload = function(){
	ym = ny+50;
	mooz.oigres();
}
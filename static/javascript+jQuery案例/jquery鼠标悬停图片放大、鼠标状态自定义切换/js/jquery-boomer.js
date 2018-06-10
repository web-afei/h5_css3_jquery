;(function($){
var boomer={

init:function(options){
	var o=options,
		$this=$(this);

	$this.each(function(i){
		// MERGE USER OPTIONS WITH DEFAULTS
		var $this=$(this);

		$this
		// HIDE THIS LINE FOR POSITIONING
		.css('cursor','none')
		// ^^^
		.on('mousemove.boomer', function(e){
			// USER SETS TOP/LEFT MARGINS IN CSS FOR OFFSETTING CURSOR BASED ON CURSOR IMAGE SIZE
			var $cur=$this.find('div.boomer:first'),
				curX=e.pageX-$cur.css('margin-left').pF(),
				curY=e.pageY-$cur.css('margin-top').pF();
			if($cur[0].style.display==='none') $cur[0].style.display='block';
			$cur.offset({left:curX-$cur.outerWidth(), top:curY-$cur.outerHeight()});
			e.stopImmediatePropagation();
		
		}).on('mouseenter.boomer',function(){
			var $cursors=$('div.boomer'),
				$cur=$this.find('div.boomer:first');
			$cursors.not($cur).css('display','none');
			$cur[0].style.display='block';			

		}).on('mouseleave.boomer',function(){
			var $cursors=$('div.boomer'),
				$cur=$this.find('div.boomer:first');
			$cur[0].style.display='none';
		});
	});
}}

$.fn.boomer=function(method,options){
	if(boomer[method]){ return boomer[method].apply(this,Array.prototype.slice.call(arguments,1));
	}else if(typeof method==='object'||!method){ return boomer.init.apply(this,arguments);
	}else{ $.error('Method '+method+' does not exist'); }
}})(jQuery);

String.prototype.removeWS=function(){return this.toString().replace(/\s/g, '');};
String.prototype.pF=function(){return parseFloat(this);};
Number.prototype.pF=function(){return parseFloat(this);};
/* 代码整理：小白 www.mysite.com */
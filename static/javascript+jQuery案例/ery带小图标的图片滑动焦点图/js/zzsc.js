function StringBuffer(){this.__strings__=new Array;}
StringBuffer.prototype.append=function(str){this.__strings__.push(str);};StringBuffer.prototype.toString=function(){return this.__strings__.join("");};String.prototype.trim=function(){return this.replace(/(^\s*)|(\s*$)/g,"");}
String.prototype.ltrim=function(){return this.replace(/(^\s*)/g,"");}
String.prototype.rtrim=function(){return this.replace(/(\s*$)/g,"");}
function addCookie(objName,objValue,objHours){var str=objName+"="+escape(objValue);if(objHours>0){var date=new Date();var ms=objHours*3600*1000;date.setTime(date.getTime()+ms);str+="; expires="+date.toGMTString();}
document.cookie=str;}
function getCookie(objName){var arrStr=document.cookie.split("; ");for(var i=0;i<arrStr.length;i++){var temp=arrStr[i].split("=");if(temp[0]==objName)
return unescape(temp[1]);}}
function explode(separators,inputstring,includeEmpties){inputstring=new String(inputstring);separators=new String(separators);if(separators=="undefined"){separators=" :;";}
fixedExplode=new Array(1);currentElement="";count=0;for(x=0;x<inputstring.length;x++){str=inputstring.charAt(x);if(separators.indexOf(str)!=-1){if(((includeEmpties<=0)||(includeEmpties==false))&&(currentElement=="")){}else{fixedExplode[count]=currentElement;count++;currentElement="";}}else{currentElement+=str;}}
if((!(includeEmpties<=0)&&(includeEmpties!=false))||(currentElement!="")){fixedExplode[count]=currentElement;}
return fixedExplode;}
(function($){$.fn.isExist=function(){if($(this).length==0)return false;else return true;};$.fn.isChecked=function(){var checked=false;$(this).each(function(){if($(this).attr('checked')){checked=true;return false;}});return checked;};jQuery.fn.setLightBox=function(options){var layoverBg=options.layoverBg?options.layoverBg:'#fff';var layoverOpa=options.layoverOpa?options.layoverOpa:'0.5';var alertdivWidth=options.alertdivWidth?options.alertdivWidth:'auto';var alertdivHeight=options.alertdivHeight?options.alertdivHeight:'auto';var alertdivBg=options.alertdivBg?options.alertdivBg:'#fff';var overflow=options.overflow?'overflow:'+options.overflow:'';var closebut=options.closeBut;var layerdiv,alertdiv;var isfirst=true;jQuery('.layoverdiv').remove();jQuery('.alertdiv').remove();if(true||jQuery('.layoverdiv').length==0){layerdiv=jQuery('<div class="layoverdiv" style="position:absolute;width:100%;height:100%;z-index:9998;left:0;top:0;display:none;"></div>');alertdiv=jQuery('<div class="alertdiv" style="'+overflow+';position:absolute;background:transparent;top:50%;left:50%;display:none;z-index:9999;"></div>');jQuery('body').append(alertdiv).append(layerdiv);}else{isfirst=false;layerdiv=jQuery('.layoverdiv');if(options.multil){off=jQuery('.alertdiv').length*3+50+'%';alertdiv=jQuery('<div class="alertdiv alertmultil" style="'+overflow+'position:absolute;background:transparent;top:'+off+';left:'+off+';display:none;z-index:9999;"></div>');jQuery('body').append(alertdiv);}else{jQuery('.alertmultil').remove();alertdiv=jQuery('.alertdiv');}}
layerdiv.css('background',layoverBg);layerdiv.width(jQuery('body').outerWidth(true));layerdiv.height(jQuery('body').outerHeight(true));alertdiv.css('background',alertdivBg);alertdiv.css({'width':alertdivWidth,'height':alertdivHeight}).html('').append(jQuery(this));if(!options.multil){layerdiv.css('opacity','0').css('display','block').fadeTo(500,layoverOpa);}
var mtop=-(alertdiv.outerHeight()/2);var clientH=document.documentElement.clientHeight;var clientW=document.documentElement.clientWidth;var stop=clientH/2+document.documentElement.scrollTop+document.body.scrollTop;if(stop+mtop<0){stop=20;mtop=0;}
var inwindow_padding=15;alertdiv.css('top',stop+'px');alertdiv.css({'margin-left':'-'+(alertdiv.outerWidth()/2+'px'),'margin-top':mtop+'px'});jQuery(this).add(jQuery(this).find('img')).load(function(){if(options.inWindow){if(($(this).height())>clientH){$(this).height(clientH-inwindow_padding*2);}
if((false&&$(this).width())>clientH){$(this).width(clientW-inwindow_padding*2);}}
stop=clientH/2+document.documentElement.scrollTop+document.body.scrollTop;mtop=-(alertdiv.outerHeight()/2);if(stop+mtop<0){stop=20;mtop=0;alertdiv.css('top',stop+'px');}
alertdiv.css('top',stop+'px');alertdiv.css({'margin-left':'-'+(alertdiv.outerWidth()/2+'px'),'margin-top':mtop+'px'});});alertdiv.hide();alertdiv.fadeIn();if(!options.canNotDrag){var dragbodys=options.dragbody?alertdiv.find(options.dragbody):alertdiv;if(alertdiv.find('img').length!=0){if(options.closeBut){dragbodys.drag({dragbody:alertdiv,opacity:'0.8',preventEvent:true});}else{dragbodys.drag({dragbody:alertdiv,opacity:'0.8',preventEvent:true,mouseupFn:function(){if(!draged){$.ml.closeLightBox();}}});}}else{if(options.closeBut){dragbodys.drag({dragbody:alertdiv,opacity:'0.8'});}else{dragbodys.drag({dragbody:alertdiv,opacity:'0.8',mouseupFn:function(){if(!draged){$.ml.closeLightBox();}}});}}}
if(!options.layerdivClick&&!options.multil){layerdiv.click(function(){if(!options.closeFn(options.closePara));$.ml.closeLightBox();});}
if(closebut!=undefined){jQuery(closebut).click(function(){if(alertdiv.find('#bigR').attr("title")!=undefined){if(!options.closeFn(options.closePara));$.ml.closeLightBox();}
else
{$.ml.closeLightBox();}});}
if(options.sureBut!=undefined){jQuery(options.sureBut).click(function(){if(!options.sureFn(options.suerPara))return;$.ml.closeLightBox();});}
if(options.closeSelfBut!=undefined){alertdiv.find(options.closeSelfBut).click(function(){alertdiv.remove();});}};$.ml={butShowTab:function(buts,tabs,tabs2,num,targe,backfn,startfn,speed){if(num>=0){$(tabs.join()).css('display','none');$(tabs.join()).eq(num).css('display','block');$(tabs2.join()).css('display','none');$(tabs2.join()).eq(num).css('display','block');}
$(buts.join()).each(function(i){eval('$(this).'+targe+'(function(){'+'if(!startfn||(startfn(i)!=false)){'+'if(speed!=0){$(tabs.join()).stop(null,true).fadeTo(speed,0.1,function(){$(tabs.join()).css("display","none");$(tabs.join()).eq(i).css("display","block");});'+'$(tabs.join()).eq(i).stop(null,true).fadeTo(speed,1,function(){backfn?backfn(i):";"});}else{'+'$(tabs.join()).css("display","none");'+'$(tabs.join()).eq(i).css("display","block");'+'backfn?backfn(i):";"}'+'}});');eval('$(this).'+targe+'(function(){'+'if(!startfn||(startfn(i)!=false)){'+'if(speed!=0){$(tabs2.join()).stop(null,true).fadeTo(speed,0.1,function(){$(tabs2.join()).css("display","none");$(tabs2.join()).eq(i).css("display","block");});'+'$(tabs2.join()).eq(i).stop(null,true).fadeTo(speed,1,function(){backfn?backfn(i):";"});}else{'+'$(tabs2.join()).css("display","none");'+'$(tabs2.join()).eq(i).css("display","block");'+'backfn?backfn(i):";"}'+'}});');});},closeLightBox:function(options){alertdiv=$('.alertdiv,.layoverdiv').fadeOut();}};})(jQuery);(function($){$.fn.showPartImg=function(options){if(!options)options={};var src=$(this).attr('bigsrc');src=src?src:$(this).attr('src');var imgW=$(this).width();var imgH=$(this).height();var width=options.width?options.width:(imgW+'px');var height=options.height?options.height:(imgH+'px');var x=options.x?options.x:($(this).width()+10+'px');var y=options.y?options.y:0;var imgoff=$(this).offset();var img=$(this);img.wrap('<div style="position:relative;"></div>');img.parent().append('<div class="bigimgdiv" style="visibility:hidden;position:absolute;left:'+x+';top:'+y+';width:'+width+';height:'+height+';overflow:hidden;background:url('+src+') no-repeat;"><img style="display:none;width:auto;height:auto;" src="'+src+'"/></div>');img.parent().find('.bigimgdiv img').load(function(){var bigimgW=img.parent().find('.bigimgdiv img').width();var bigimgH=img.parent().find('.bigimgdiv img').height();var moveW=((parseInt)(width))*imgW/bigimgW;var moveH=((parseInt)(height))*imgH/bigimgH;img.parent().append('<div class="bigimgmove" style="left:0;top:0;border:1px solid #ccc;background-color:#eee;position:absolute;width:'+moveW+'px;height:'+moveH+'px;display:none;">&nbsp;</div>');img.parent().find('.bigimgmove').css({'opacity':'0.6','cursor':'pointer'});img.parent().mouseover(function(){$(this).find('.bigimgmove').css('display','block');$(this).find('.bigimgdiv').css('visibility','visible');});img.parent().mouseout(function(){$(this).find('.bigimgmove').css('display','none');$(this).find('.bigimgdiv').css('visibility','hidden');});img.parent().mousemove(function(e){var bigimgmove=$(this).find('.bigimgmove');bigimgmove.css('display','block');var offX=bigimgmove.width()/2;var offY=bigimgmove.height()/2;var left=(window.event||e).clientX+document.documentElement.scrollLeft;var top=(window.event||e).clientY+document.documentElement.scrollTop;var imgleft=imgoff.left;var imgtop=imgoff.top;var truex=((left-offX)-imgleft)>0&&left<((imgleft-offX)+imgW);var truey=((top-offY)-imgtop)>0&&top<((imgtop-offY)+imgH);var bigimgpos=bigimgmove.position();if(truex){bigimgmove.css('left',left-offX-imgleft+'px');}
if(truey){bigimgmove.css('top',top-offY-imgtop+'px');}
if(((left)-imgleft)<0||left>((imgleft)+imgW)||((top)-imgtop)<0||top>((imgtop)+imgH)){bigimgmove.css('display','none');}
$(this).find('.bigimgdiv').css('background-position','-'+bigimgW*bigimgpos.left/imgW+'px -'+bigimgH*bigimgpos.top/imgH+'px');});img.parent().find('.bigimgdiv').mousemove(function(){$(this).css('visibility','hidden');});});}
$.fn.searchRemind=function(options){var left=options.left?options.left:'0';var top=options.top?options.top:'25px';var width=options.width?options.width:'200px';var url=options.url;var theinput=$(this);var index=0;var getstr='';var inputstr='';$(this).parent().css('position','relative');$(this).attr('autocomplete','off');var outdiv=$('<div class="searchoutdiv" style="z-index:999999;left:'+left+';top:'+top+';width:'+width+';position:absolute;background-color:#fff;border:1px solid #888;display:none;"></div>');$(this).parent().append(outdiv);$(this).keyup(function(event){if(inputstr==$(this).val()){return;}else{inputstr=$(this).val();getstr='';}
if(event.keyCode==38||event.keyCode==40)return;$.ajax({url:url,data:'keyword='+theinput.val(),type:'post',dataType:'text',timeout:15000,error:function(){alert('通信失败，请重试');},success:function(text){if(getstr==$.trim(text)){return;}else{getstr=text;index=0;}
if($.trim(text)==''){outdiv.html('');return;}
index=0;var items=$.trim(text).split('#@!');outdiv.css('display','block');index=0;outdiv.html('');for(i in items){if($.trim(items[i])=='')continue;outdiv.append('<div>'+items[i]+'</div>');}
outdiv.find('div').each(function(i){$(this).mouseover(function(){index=i+1;outdiv.find('div').css('background-color','#fff');$(this).css('background-color','#888');}).mouseout(function(){index=0;outdiv.find('div').css('background-color','#fff');$(this).css('background-color','#fff');}).click(function(){theinput.attr('value',$(this).text());}).css('cursor','default');});}});});$('body').click(function(){outdiv.css('display','none');});$('body').keydown(function(event){if(event.keyCode==38){if(index==1)index=outdiv.find('div').length+1;index--;outdiv.find('div').css('background-color','#fff');outdiv.find('div').eq(index-1).css('background-color','#888');theinput.attr('value',outdiv.find('div').eq(index-1).text());}
if(event.keyCode==40){if(index==outdiv.find('div').length)index=0;index++;outdiv.find('div').css('background-color','#fff');outdiv.find('div').eq(index-1).css('background-color','#888');theinput.attr('value',outdiv.find('div').eq(index-1).text());}});}})(jQuery);$(document).ready(function(){PointsPlus.init();IntroductionInteration.initHover();horizontalSwitcher();hrpagechange();milestonPageAction();productShare();moduleContact();if($('.add-plus')[0]!=undefined){$('.add-plus').hover(function(){$(this).css({'border':'1px solid #E0E0E0','background':'#EFEFEF'});$(this).find('.add-plus-one').css({'display':'block'});},function(){$(this).css({'border':'0','background':'none'});$(this).find('.add-plus-one').css({'display':'none'});});}});$(document).ready(function(){$("#backto-top").click(function(){$(window).scrollTop(10);goto_top();});$(window).scroll(function(){var top=$(this).scrollTop();var clientH=document.documentElement.clientHeight;var clientW=document.documentElement.clientWidth;if(top==0){$('#backto-top').fadeOut();}
else
{$('#backto-top').fadeIn();}});});var goto_top_type=-1;var goto_top_itv=0;function goto_top_timer()
{var y=goto_top_type==1?document.documentElement.scrollTop:document.body.scrollTop;var moveby=15;y-=Math.ceil(y*moveby/100);if(y<0){y=0;}
if(goto_top_type==1){document.documentElement.scrollTop=y;}
else{document.body.scrollTop=y;}
if(y==0){clearInterval(goto_top_itv);goto_top_itv=0;}}
function goto_top()
{if(goto_top_itv==0){if(document.documentElement&&document.documentElement.scrollTop){goto_top_type=1;}
else if(document.body&&document.body.scrollTop){goto_top_type=2;}
else{goto_top_type=0;}
if(goto_top_type>0){goto_top_itv=setInterval('goto_top_timer()',20);}}}
function validateform()
{var isValidated=true;$(".required-input").each(function(){if($(this).val()=="")
{isValidated=false;}
if(!$("#demand").hasClass("active"))isValidated=false;});if(!isValidated)
{alert('请确保要求填写的项目不为空');return isValidated;}
var emailreg=/^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;var email=$("#r-email").val();if(!emailreg.test(email))
{alert('请填写正确的E-mail以便我们的客服人员联系您');return false;}}
function moduleContact()
{$("#demand").focus(function(){var pro=$(this).val();if(!$(this).hasClass("active"))
{$(this).addClass("active");$(this).val("");}});$("#demand").blur(function(){var text="请您在此填写需求，我们将尽快给予您答复。";if($(this).val()=="")
{$(this).val(text);$(this).removeClass("active");}});$("#message-online").click(function(){$(".fiexd-hover").fadeTo("slow",0.5);$(".fixed-message-frame").animate({height:490},700);});$(".closefixed,#l-reset").click(function(){$(".fiexd-hover").fadeOut();$(".fixed-message-frame").animate({height:0},700);});}
function productShare()
{$(".product-share-frame").hover(function(){$(".add-plus-proudct").show();$(".add-plus-proudct").css("height","150px");$(".add-plus-proudct a").show();},function(){$(".add-plus-proudct").hide();$(".add-plus-proudct").css("height","50px");});}
function hrpagechange(){var buts1=['.jobitem'];var tabs1=['.hrbannerimg'];var tabs2=['.hr-desc'];function backfn1(i){var key=jQuery('.hr-memu .active').attr('key');jQuery(buts1.join()).removeClass('active active'+key);jQuery(buts1.join()).eq(i).addClass('active active'+i);}
jQuery.ml.butShowTab(buts1,tabs1,tabs2,-1,'click',backfn1,'',0);jQuery('.jobitem').each(function(){jQuery(this).click(function(){jQuery('#job').val(jQuery(this).attr('title'));})});}
function doShare(ele,stype){var sitetitle='木兰设计';var stitle=$(ele).attr("stitle")+' - '+sitetitle;var simg=$(ele).attr("simg");var surl=document.getElementById('baseurl').value;var annuncement_link=$('#collect_'+parseInt($(ele).attr("sid"))).attr('href');var product_link=$("#product_link").attr("href");if(typeof(annuncement_link)!='undefined')
{surl+=annuncement_link;}
else
{surl+=product_link;}
u=encodeURIComponent(surl);t=encodeURIComponent(stitle);p=encodeURIComponent(simg);switch(stype){case"fav":if(document.all){window.external.addFavorite(surl,stitle);}else if(window.sidebar){window.sidebar.addPanel(stitle,surl,"");}else{alert("当前浏览器不支持此操作，请按住鼠标左键，将此链接拖动到浏览器的书签即可。");}
break;case"sina":window.open('http://www.jiathis.com/send/?webid=tsina&url='+u+'&title='+t+(p!='undefined'&&p!=undefined?'&pic='+p:''),'_blank');break;case"tqq":window.open('http://www.jiathis.com/send/?webid=tqq&url='+u+'&title='+t+(p!='undefined'&&p!=undefined?'&pic='+p:''),'_blank');x
break;case"qzone":window.open('http://www.jiathis.com/send/?webid=qzone&url='+u+'&title='+t+(p!='undefined'&&p!=undefined?'&pic='+p:''),'_blank');break;case"renren":window.open('http://www.jiathis.com/send/?webid=renren&url='+u+'&title='+t+(p!='undefined'&&p!=undefined?'&pic='+p:''),'_blank');break;case"douban":window.open('http://www.jiathis.com/send/?webid=douban&url='+u+'&title='+t+(p!='undefined'&&p!=undefined?'&pic='+p:''),'_blank');break;case"kaixin001":window.open('http://www.jiathis.com/send/?webid=kaixin001&url='+u+'&title='+t+(p!='undefined'&&p!=undefined?'&pic='+p:''),'_blank');break;case"tsohu":window.open('http://www.jiathis.com/send/?webid=tsohu&url='+u+'&title='+t+(p!='undefined'&&p!=undefined?'&pic='+p:''),'_blank');break;case"tieba":window.open('http://www.jiathis.com/send/?webid=tieba&url='+u+'&title='+t+(p!='undefined'&&p!=undefined?'&pic='+p:''),'_blank');break;}
return false;}
var PointsPlus={setting:{hover_animate_time:200,point_animate_interval:3000,point_animate_hide_time:200,point_animate_show_time:30,point_animate_stop:false,cur_hover_point:null},init:function(){if($('.service-point')[0]!=undefined){this.init_points();this.init_points_animate();}},init_points:function(){var point_showed=0;$('.service-point').each(function(){point_showed++;PointsPlus.hide_show_point(this,150*point_showed);});},hide_show_point:function(ele,delay){if(PointsPlus.setting.point_animate_stop==false&&PointsPlus.setting.cur_hover_point==null||$(ele).attr('id')!=PointsPlus.setting.cur_hover_point){$(ele).delay(delay).animate({opacity:0.4},PointsPlus.setting.point_animate_hide_time,function(){if(PointsPlus.setting.point_animate_stop==false&&PointsPlus.setting.cur_hover_point==null||$(ele).attr('id')!=PointsPlus.setting.cur_hover_point){$(this).animate({opacity:1},PointsPlus.setting.point_animate_show_time,function(){if(PointsPlus.setting.point_animate_stop==false&&PointsPlus.setting.cur_hover_point==null||$(ele).attr('id')!=PointsPlus.setting.cur_hover_point){$(this).delay(200).animate({opacity:0.4},PointsPlus.setting.point_animate_hide_time,function(){if(PointsPlus.setting.point_animate_stop==false&&PointsPlus.setting.cur_hover_point==null||$(ele).attr('id')!=PointsPlus.setting.cur_hover_point){$(this).animate({opacity:1},PointsPlus.setting.point_animate_show_time);}else{$(this).css({opacity:1});}});}});}else{$(this).css({opacity:1});}});}
setTimeout(function(){PointsPlus.hide_show_point(ele,delay);},PointsPlus.setting.point_animate_interval);},init_points_animate:function(){$('.service-point').hover(function(){PointsPlus.setting.point_animate_stop=true;$(this).stop().css({opacity:1});PointsPlus.setting.cur_hover_point=$(this).attr('id');var posw=$(this).attr('posw');var pos=$(this).attr('pos2').split(',');$(this).css({'left':pos[0]+'px','top':pos[1]+'px','width':posw+'px','height':'135px'});if($(this).attr('class').indexOf('point-left')>0){$(this).find('span').css({'display':'block','right':'-10px'}).stop().animate({opacity:1,right:'0px'},PointsPlus.setting.hover_animate_time);$(this).find('p').css({'display':'block','left':'-10px'}).stop().animate({opacity:1,left:'0px'},PointsPlus.setting.hover_animate_time);}else{$(this).find('span').css({'display':'block','left':'-10px'}).stop().animate({opacity:1,left:'0px'},PointsPlus.setting.hover_animate_time);$(this).find('p').css({'display':'block','right':'-10px'}).stop().animate({opacity:1,right:'0px'},PointsPlus.setting.hover_animate_time);}},function(){PointsPlus.setting.point_animate_stop=false;var pos=$(this).attr('pos1').split(',');var point_id=$(this).attr('id');if($(this).attr('class').indexOf('point-left')>0){$(this).find('span').stop().animate({opacity:0,right:'-10px'},PointsPlus.setting.hover_animate_time,function(){$(this).css({'display':'none'});});$(this).find('p').stop().animate({opacity:0,left:'-10px'},PointsPlus.setting.hover_animate_time,function(){$(this).css({'display':'none'});$('#'+point_id).css({'left':pos[0]+'px','top':pos[1]+'px','width':'0px','height':'30px'});});}else{$(this).find('span').stop().animate({opacity:0,left:'-10px'},PointsPlus.setting.hover_animate_time,function(){$(this).css({'display':'none'});});$(this).find('p').stop().animate({opacity:0,right:'-10px'},PointsPlus.setting.hover_animate_time,function(){$(this).css({'display':'none'});$('#'+point_id).css({'left':pos[0]+'px','top':pos[1]+'px','width':'0px','height':'30px'});});}
PointsPlus.setting.cur_hover_point=null;});}}
var IntroductionInteration={setting:{movieObj:null,movieTime:400},initHover:function(){if($('.introduction-hover')[0]!=undefined){$('.introduction-hover').hover(function(){if(IntroductionInteration.setting.movieObj!=undefined){IntroductionInteration.setting.movieObj.stop();}
IntroductionInteration.setting.movieObj=tween($('#introduction-hover-bg').css('left'),(parseInt($(this).attr('id'))*313+1)+'px',IntroductionInteration.setting.movieTime/1000,'easeoutelastic');IntroductionInteration.setting.movieObj.run=function(ps){$('#introduction-hover-bg').css('left',ps);}},function(){return false;});}}}
function milestonPageAction()
{if(!$('.year-tab').isExist()){return;}
$(".year-tab").each(function(){$(this).bind("click",function(){var year=$(this).html();$(".command-bar").find(".active").removeClass("active");$(this).addClass("active");$(".milestone-list").find(".active").removeClass("active");$(".year-frame").hide();$(".m-list-frame").removeClass("block");$(".m-list-frame").addClass("none");$(".m-frame"+year).addClass("block");$(".m-frame"+year).find(".scrollcontent").css("top","0");$(".m-frame"+year).find(".scroll-bar").css("top","12px");$(".year"+year).fadeIn(500);$(".year"+year).addClass("active");$(".year"+year+" li:first-child").click();});});$(".milestone-item").each(function(){$(this).bind("click",function(){var barMoved=$(this).parent().parent().css('top');barMoved=parseInt(barMoved.match(/^(-?\d+)/)[0],10);var thisPosition=$(this).attr("position");$("#pointer-left").animate().stop();$("#pointer-left").animate({top:67*thisPosition+17+barMoved},400);$(".milestone-item").removeClass("active");$(this).addClass("active");$("#current-title").html($(this).find(".info-title").html());$("#current-date").html($(this).find(".info-date").attr("title"));$("#current-intro").html($(this).find(".info-intro").html());$("#current-img").html($(this).find(".info-img").html());});});}
$(document).ready(function(){var animateDone=true;function getInDirectionTween(e,moveDirecrion,moveInSpeed,moveInType)
{moveInSpeed=parseInt(moveInSpeed);e.css("opacity","0");switch(moveDirecrion)
{case'0':e.css("left","0").css("top","0");e.animate({"left":"0","opacity":"1"},{duration:moveInSpeed,easing:moveInType});break;case'1':e.css("left","0").css("top","-460px");e.animate({"top":"0","opacity":"1"},{duration:moveInSpeed,easing:moveInType});break;case'2':e.css("left","460px").css("top","-460px");e.animate({"top":"0","left":"0","opacity":"1"},{duration:moveInSpeed,easing:moveInType});break;case'3':e.css("left","460px").css("top","0");e.animate({"left":"0","opacity":"1"},{duration:moveInSpeed,easing:moveInType});break;case'4':e.css("left","460px").css("top","460px");e.animate({"left":"0","top":"0","opacity":"1"},{duration:moveInSpeed,easing:moveInType});break;case'5':e.css("left","0").css("top","460px");e.animate({"top":"0","opacity":"1"},{duration:moveInSpeed,easing:moveInType});break;case'6':e.css("left","-460px").css("top","460px");e.animate({"left":"0","top":"0","opacity":"1"},{duration:moveInSpeed,easing:moveInType});break;case'7':e.css("left","-460px").css("top","0");e.animate({"left":"0","opacity":"1"},{duration:moveInSpeed,easing:moveInType});break;case'8':e.css("left","-460px").css("top","-460px");e.animate({"left":"0","top":"0","opacity":"1"},{duration:moveInSpeed,easing:moveInType});break;}}
function getOutDirectionTween(e,moveDirecrion,moveInSpeed,moveInType)
{moveInSpeed=parseInt(moveInSpeed);switch(moveDirecrion)
{case'0':e.animate({"left":"0","opacity":0},{duration:moveInSpeed,easing:moveInType});break;case'1':e.animate({"left":"0","top":"-460px","opacity":0},{duration:moveInSpeed,easing:moveInType});break;case'2':e.animate({"top":"-460px","left":"460px","opacity":0},{duration:moveInSpeed,easing:moveInType});break;case'3':e.animate({"left":"460px","top":"0","opacity":0},{duration:moveInSpeed,easing:moveInType});break;case'4':e.animate({"left":"460px","top":"460px","opacity":0},{duration:moveInSpeed,easing:moveInType});break;case'5':e.animate({"top":"460px","left":"0","opacity":0},{duration:moveInSpeed,easing:moveInType});break;case'6':e.animate({"left":"-460px","top":"460px","opacity":0},{duration:moveInSpeed,easing:moveInType});break;case'7':e.animate({"left":"-460px","top":"0","opacity":0},{duration:moveInSpeed,easing:moveInType});break;case'8':e.animate({"left":"-460px","top":"-460px","opacity":0},{duration:moveInSpeed,easing:moveInType});break;}}
function animateIn(e)
{var moveInDerection=e.attr('moveInDerection');var moveInSpeed=e.attr('moveInSpeed');var moveInType=e.attr('moveInType');getInDirectionTween(e,moveInDerection,moveInSpeed,moveInType);}
function animateOut(e)
{var moveOutDerection=e.attr('moveOutDerection');var moveOutSpeed=e.attr('moveOutSpeed');var moveOutType=e.attr('moveOutType');getOutDirectionTween(e,moveOutDerection,moveOutSpeed,moveOutType);}
function getMaxFromArray(arr)
{var max=arr[0];for(i=0;i<arr.length;i++)
{if(arr[i]>max)
max=arr[i];}
return max;}
$(".banner-bt .pointer").click(function(){var currentClick=false;var current=$(".banner-bt").find(".active");var pretarget=current.attr("target");var target=$(this).attr("target");if(pretarget==target)currentClick=true;if(!currentClick)
{if(animateDone)
{current.removeClass("active");$(this).addClass("active");animateDone=false;var preObjectLeft=$(".left"+pretarget);var preObjectRight=$(".right"+pretarget);var objectLeft=$(".left"+target);var objectRight=$(".right"+target);preObjectLeft.css("z-index","0");preObjectRight.css("z-index","0");objectLeft.css("z-index","9999");objectRight.css("z-index","9999");var speedArray=[objectLeft.attr('moveInSpeed'),objectLeft.attr('fadeInSpeed'),objectRight.attr('moveInSpeed'),objectRight.attr('fadeInSpeed'),];var animateTime=parseInt(getMaxFromArray(speedArray))+1000;animateOut(preObjectLeft);animateOut(preObjectRight);animateIn(objectLeft);animateIn(objectRight);setTimeout(animateDoneFunction,animateTime);}}});function animateDoneFunction()
{animateDone=true;}
function initilAnimate()
{$($(".banner-bt .pointer")[0]).click();var autoSwitch=function(){$(".banner-bt .pointer").each(function(e){if($(this).hasClass("active"))
{if(e==6)
$(".banner-bt .pointer:eq(0)").click();else
$(".banner-bt .pointer:eq("+(e+1)+")").click();}
else
{}});}
window.setInterval(autoSwitch,3750);}
initilAnimate();});function initalTopAddsAnimate()
{var isChecked=getCookie("checkedTopAdds");var showTime=parseInt($("#t-showtime").val());var openspeed=parseInt($("#t-openspeed").val());var closespeed=parseInt($("#t-closespeed").val());var autoclose=parseInt($("#t-autoclose").val())==0?false:true;var showType=$("#t-showType").val();var $moveAbleFrame=$("#top-add-show");var $closeButton=$("#top-add-close");var $mainImg=$("#add-img");var frameHeight=$("#add-img").height();var $showButton=$("#get-adds-blinking");$closeButton.css("opacity","0");$mainImg.show();function showButtonBlinking(){$showButton.animate({opacity:1},2000,function(){setTimeout(showButtonBinkingOut,1000);});}
function showButtonBinkingOut()
{$showButton.animate({opacity:0},2000);setTimeout(showButtonBlinking,3000);}
showButtonBlinking();$showButton.bind("click",function(){if(showType=='slideDown')
{slideDownAnimate(frameHeight);}
else if(showType=='fadeIn')
{fadeInAnimate(frameHeight);}
else
{}});if(!isChecked)
{$showButton.click();}
function slideDownAnimate(frameHeight)
{$mainImg.show();$moveAbleFrame.css("width","100%").css("z-index","99999").css("position","fixed").css("opacity","0").css("left","0");$moveAbleFrame.animate({height:frameHeight,opacity:1},openspeed,function(){if(autoclose)
{setTimeout(function(){$closeButton.click();},showTime);}
else
{$closeButton.animate({opacity:0.8},500);}});$closeButton.bind('click',function(){$(this).animate({opacity:0},500);$moveAbleFrame.animate({height:0,opacity:0},closespeed,function(){addCookie("checkedTopAdds",'1',24);});});}
function fadeInAnimate(frameHeight)
{$mainImg.show();$moveAbleFrame.css("width","100%").css("z-index","99999").css("position","fixed").css("opacity","0").css("height",frameHeight).css("left","0");$moveAbleFrame.animate({opacity:1},openspeed,function(){if(autoclose)
{setTimeout(function(){closeThis();},showTime);}
else
{function closeBlinking(){setTimeout(closeBlinkingOut,1000);}
function closeBlinkingOut()
{$closeButton.animate({opacity:0.8},2000,function(){$closeButton.animate({opacity:0.05},2000);setTimeout(closeBlinking,3000);});}
closeBlinking();$closeButton.bind('click',function(){$(this).animate({opacity:0},500);$moveAbleFrame.animate({opacity:0},closespeed,function(){addCookie("checkedTopAdds",'1',24);$moveAbleFrame.css("height",0);$mainImg.hide();});});}});}}
function horizontalSwitcher(){if(!$('.horizontal-switcher').isExist()){return;}
$(".horizontal-switcher").each(function(){var thisSwitcher=$(this);var items=$(this).find(".item");var itemWidth=items.outerWidth();var barWidth=items.length*itemWidth;var moveableBar=$(this).find(".moveable");moveableBar.width(barWidth);var leftButton=$(this).find(".left-button");var rightButton=$(this).find(".right-button");switcher(leftButton,rightButton,moveableBar,items,itemWidth,thisSwitcher);});}
function switcher(leftButton,rightButton,moveableBar,items,itemWidth,thisSwitcher)
{var showCount=thisSwitcher.attr("show");var fadein=thisSwitcher.attr("fadein");var pagebt=thisSwitcher.attr("pagebt");var itemCount=items.length;var currentPoninter=0;leftButton.css("opacity",0);rightButton.addClass("cursor-pointer");rightButton.bind("click",function(){var action=0;if((currentPoninter+3)<itemCount)
{currentPoninter++;moveableBar.animate().stop();moveableBar.animate({left:-itemWidth*currentPoninter},300,function(){if(currentPoninter+3==itemCount)
{leftButton.addClass("cursor-pointer");leftButton.fadeTo(300,1);rightButton.removeClass("cursor-pointer");rightButton.fadeTo(300,0);}});if(fadein==1)
{var preItem=moveableBar.find(".item:eq("+(currentPoninter-1)+")");var endItem=moveableBar.find(".item:eq("+(currentPoninter+2)+")");endItem.css("opacity",0);preItem.fadeTo(300,0);endItem.fadeTo(800,1);}}});leftButton.bind("click",function(){if(currentPoninter>=1)
{currentPoninter--;moveableBar.animate().stop();moveableBar.animate({left:-itemWidth*currentPoninter},300,function(){if(currentPoninter==0)
{leftButton.removeClass("cursor-pointer");leftButton.fadeTo(300,0);rightButton.addClass("cursor-pointer");rightButton.fadeTo(300,1);}});if(fadein==1)
{var preItem=moveableBar.find(".item:eq("+(currentPoninter)+")");var endItem=moveableBar.find(".item:eq("+(currentPoninter+3)+")");endItem.fadeTo(300,0);preItem.fadeTo(800,1);}}});if(pagebt==1&&thisSwitcher.find(".bigpagenation").isExist())
{var pageButton=thisSwitcher.find(".pagenation-b");var lastLose=itemCount%showCount!=0?showCount-itemCount%showCount:0;pageButton.bind("click",function(){pageButton.removeClass("active");$(this).addClass("active");var gotoPage=$(this).attr("title");var pointer=(gotoPage-1)*3;if(gotoPage!=pageButton.length){currentPoninter=pointer;moveableBar.animate({left:-itemWidth*pointer},500);}
else
{currentPoninter=pointer-lastLose;moveableBar.animate({left:-itemWidth*(pointer-lastLose)},500);}});}}
(function(){window.tween=function(startProps,endProps,timeSeconds,animType,delay)
{var tw=new Tween();tw.start(startProps,endProps,timeSeconds,animType,delay);return tw;}
function Tween()
{this._frame=20;this._animType=linear;this._delay=0;this.run=function(){}
this.complete=function(){}}
Tween.prototype.getValue=function(prop)
{this._valueType='';if(prop.constructor==Array)return prop;if(typeof(prop)=='string')
{if(isColor(prop))
{this._valueType='color';return c2a(prop);}
if(prop.split('px').length>1)
{this._valueType='px';return[prop.split('px')[0]];}}
return[prop];}
Tween.prototype.setValue=function(prop)
{if(this._valueType=='color')return a2c(prop);if(this._valueType=='px')return prop[0]+'px';return prop;}
Tween.prototype.start=function(startProps,endProps,timeSeconds,animType,delay)
{if(animType!=undefined)this._animType=this.animTypes[animType];if(delay!=undefined)this._delay=delay;this._timeSeconds=timeSeconds;this._startTimer=new Date().getTime()+this._delay*1000;this._endProps=this.getValue(endProps);this._startProps=this.getValue(startProps);this._currentProps=[];var $this=this;clearInterval(this._runID);this._runID=setInterval(function(){$this._run();},this._frame);}
Tween.prototype.stop=function(state)
{for(var i in this._startProps)
{if(Number(state)>0)
this._currentProps[i]=this._endProps[i];else if(Number(state)<0)
this._currentProps[i]=this._startProps[i];}
this.callListener();this.complete();clearInterval(this._runID);}
Tween.prototype.callListener=function()
{this.run(this.setValue(this._currentProps));}
Tween.prototype._run=function()
{if(new Date().getTime()-this._startTimer<0)return;var isEnd=false;for(var i in this._startProps)
{this._currentProps[i]=this._animType(new Date().getTime()-this._startTimer,Number(this._startProps[i]),Number(this._endProps[i])-Number(this._startProps[i]),this._timeSeconds*1000);if(this._startTimer+(this._timeSeconds*1000)<=new Date().getTime())
{this._currentProps[i]=this._endProps[i];isEnd=true;}}
if(isEnd)this.stop();else this.callListener();}
function linear(t,b,c,d)
{return c*t/d+b;}
function easeinquad(t,b,c,d)
{return c*(t/=d)*t+b;}
function easeoutquad(t,b,c,d)
{return-c*(t/=d)*(t-2)+b;}
function easeinoutquad(t,b,c,d)
{if((t/=d/2)<1)return c/2*t*t+b;return-c/2*((--t)*(t-2)-1)+b;}
function easeincubic(t,b,c,d)
{return c*(t/=d)*t*t+b;}
function easeoutcubic(t,b,c,d)
{return c*((t=t/d-1)*t*t+1)+b;}
function easeinoutcubic(t,b,c,d)
{if((t/=d/2)<1)return c/2*t*t*t+b;return c/2*((t-=2)*t*t+2)+b;}
function easeinquart(t,b,c,d)
{return c*(t/=d)*t*t*t+b;}
function easeoutquart(t,b,c,d)
{return-c*((t=t/d-1)*t*t*t-1)+b;}
function easeinoutquart(t,b,c,d)
{if((t/=d/2)<1)return c/2*t*t*t*t+b;return-c/2*((t-=2)*t*t*t-2)+b;}
function easeinquint(t,b,c,d)
{return c*(t/=d)*t*t*t*t+b;}
function easeoutquint(t,b,c,d)
{return c*((t=t/d-1)*t*t*t*t+1)+b;}
function easeinoutquint(t,b,c,d)
{if((t/=d/2)<1)return c/2*t*t*t*t*t+b;return c/2*((t-=2)*t*t*t*t+2)+b;}
function easeinsine(t,b,c,d)
{return-c*Math.cos(t/d*(Math.PI/2))+c+b;}
function easeoutsine(t,b,c,d)
{return c*Math.sin(t/d*(Math.PI/2))+b;}
function easeinoutsine(t,b,c,d)
{return-c/2*(Math.cos(Math.PI*t/d)-1)+b;}
function easeinexpo(t,b,c,d)
{return(t==0)?b:c*Math.pow(2,10*(t/d-1))+b;}
function easeoutexpo(t,b,c,d)
{return(t==d)?b+c:c*(-Math.pow(2,-10*t/d)+1)+b;}
function easeinoutexpo(t,b,c,d)
{if(t==0)return b;if(t==d)return b+c;if((t/=d/2)<1)return c/2*Math.pow(2,10*(t-1))+b;return c/2*(-Math.pow(2,-10*--t)+2)+b;}
function easeincirc(t,b,c,d)
{return-c*(Math.sqrt(1-(t/=d)*t)-1)+b;}
function easeoutcirc(t,b,c,d)
{return c*Math.sqrt(1-(t=t/d-1)*t)+b;}
function easeinoutcirc(t,b,c,d)
{if((t/=d/2)<1)return-c/2*(Math.sqrt(1-t*t)-1)+b;return c/2*(Math.sqrt(1-(t-=2)*t)+1)+b;}
function easeinelastic(t,b,c,d)
{var s=1,a=1,p=0;if(t==0)return b;if((t/=d)==1)return b+c;if(!p)p=d*.3;if(a<Math.abs(c)){a=c;s=p/4;}
else s=p/(2*Math.PI)*Math.asin(c/a);return-(a*Math.pow(2,10*(t-=1))*Math.sin((t*d-s)*(2*Math.PI)/p))+b;}
function easeoutelastic(t,b,c,d)
{var s=1,a=1,p=0;if(t==0)return b;if((t/=d)==1)return b+c;if(!p)p=d*.3;if(a<Math.abs(c)){a=c;s=p/4;}
else s=p/(2*Math.PI)*Math.asin(c/a);return a*Math.pow(2,-10*t)*Math.sin((t*d-s)*(2*Math.PI)/p)+c+b;}
function easeinoutelastic(t,b,c,d)
{var s=1,a=1,p=0;if(t==0)return b;if((t/=d/2)==2)return b+c;if(!p)p=d*(.3*1.5);if(a<Math.abs(c)){a=c;s=p/4;}
else s=p/(2*Math.PI)*Math.asin(c/a);if(t<1)return-.5*(a*Math.pow(2,10*(t-=1))*Math.sin((t*d-s)*(2*Math.PI)/p))+b;return a*Math.pow(2,-10*(t-=1))*Math.sin((t*d-s)*(2*Math.PI)/p)*.5+c+b;}
function easeinback(t,b,c,d)
{var s;if(s==undefined)s=1.70158;return c*(t/=d)*t*((s+1)*t-s)+b;}
function easeoutback(t,b,c,d)
{var s;if(s==undefined)s=1.70158;return c*((t=t/d-1)*t*((s+1)*t+s)+1)+b;}
function easeinoutback(t,b,c,d)
{var s;if(s==undefined)s=1.70158;if((t/=d/2)<1)return c/2*(t*t*(((s*=(1.525))+1)*t-s))+b;return c/2*((t-=2)*t*(((s*=(1.525))+1)*t+s)+2)+b;}
function easeinbounce(t,b,c,d)
{return c-easeoutbounce(d-t,b,c,d)+b;}
function easeoutbounce(t,b,c,d)
{if((t/=d)<(1/2.75)){return c*(7.5625*t*t)+b;}else if(t<(2/2.75)){return c*(7.5625*(t-=(1.5/2.75))*t+.75)+b;}else if(t<(2.5/2.75)){return c*(7.5625*(t-=(2.25/2.75))*t+.9375)+b;}else{return c*(7.5625*(t-=(2.625/2.75))*t+.984375)+b;}}
function easeinoutbounce(t,b,c,d)
{if(t<d/2)return easeinbounce(t*2,b,c,d)*.5+b;return easeoutbounce(t*2-d,b,c,d)*.5+c*.5+b;}
Tween.prototype.animTypes={linear:linear,easeinquad:easeinquad,easeoutquad:easeoutquad,easeinoutquad:easeinoutquad,easeincubic:easeincubic,easeoutcubic:easeoutcubic,easeinoutcubic:easeinoutcubic,easeinquart:easeinquart,easeoutquart:easeoutquart,easeinoutquart:easeinoutquart,easeinquint:easeinquint,easeoutquint:easeoutquint,easeinoutquint:easeinoutquint,easeinsine:easeinsine,easeoutsine:easeoutsine,easeinoutsine:easeinoutsine,easeinexpo:easeinexpo,easeoutexpo:easeoutexpo,easeinoutexpo:easeinoutexpo,easeincirc:easeincirc,easeoutcirc:easeoutcirc,easeinoutcirc:easeinoutcirc,easeinelastic:easeinelastic,easeoutelastic:easeoutelastic,easeinoutelastic:easeinoutelastic,easeinback:easeinback,easeoutback:easeoutback,easeinoutback:easeinoutback,easeinbounce:easeinbounce,easeoutbounce:easeoutbounce,easeinoutbounce:easeinoutbounce};function isColor(v)
{return v.split('rgb').length>1||v.split('#').length>1;}
function c2a(c)
{if(c.split('rgb').length>1)
{return c.split('(')[1].split(')')[0].split(',');}
if(c.split('#').length>1)c=c.split('#')[1];if(c.length==3)
{c=c.charAt(0)+c.charAt(0)+c.charAt(1)+c.charAt(1)+c.charAt(2)+c.charAt(2);}
c='0x'+c;return[Number((c>>16)&0xff),Number((c>>8)&0xff),Number(c&0xff)];}
function a2c(arr)
{var c=((parseInt(Math.abs(arr[0]))<<16)+(parseInt(Math.abs(arr[1]))<<8)+parseInt(Math.abs(arr[2]))).toString(16);while(c.length<6)c='0'+c;return'#'+c;}})();
$(function(){var i=$(window).width(),t=$(window).height();$(".model").width(i),$(".model").height(t),$(".model-title img").on("click",function(){$(".model").hide(),$(".model-title").hide(),$("body").css("overflow","auto")}),$.ajax({type:"post",url:"/me/cate-all",async:!1,success:function(i){console.log(i);for(var t=[],a=0;a<i.data.length;a++)t.push(i.data[a]);t.unshift({cname:"推荐",cid:"null"});for(var s=0;s<t.length;s++){var n="";n+="<div class='swiper-slide'>","null"==t[s].cid?n+="<span class='community-article-span-color' cid = '"+t[s].cid+"'>"+t[s].cname+"</span>":n+="<span class='community-article-span' cid = '"+t[s].cid+"'>"+t[s].cname+"</span>",n+="</div>",$("#community-art .swiper-container .swiper-wrapper").append(n)}if(i.data.length>3)new Swiper("#community-art .swiper-container",{slidesPerView:"auto",paginationClickable:!0,freeMode:!0});else{var e=i.data.length;new Swiper("#community-art .swiper-container",{slidesPerView:e,paginationClickable:!0,freeMode:!0})}$(".community-article-span").on("click",function(){"null"==$(this).attr("cid")||(window.location="communityclasstiy.html?cid="+$(this).attr("cid"))})},error:function(i){alert("请求超时")}}),$.ajax({type:"post",url:"/me/home-rotation",async:!0,success:function(i){if(0==i.state){console.log("轮播图",i);for(var t=0;t<i.data.length;t++){var a="";a+="<div class='swiper-slide' data-content='"+i.data[t].content.description+"' data-type='"+i.data[t].type+"'>",a+=`<img src = '${i.data[t].image}' onerror="this.onerror=null; this.src='../images/w-banner.jpg'"/>`,a+="</div>",$(".community-frist-banner  .swiper-container  .swiper-wrapper").append(a)}new Swiper(".community-all .community-frist .community-frist-banner  .swiper-container",{pagination:".swiper-pagination",paginationClickable:!0,centeredSlides:!0,autoplay:2500,autoplayDisableOnInteraction:!1,loop:!0});$(".community-frist-banner .swiper-slide").on("click",function(){var i=$(this).attr("data-type"),t=$(this).attr("data-content");"weibo"==i?window.location="postint.html?wid="+t:"html"==i&&(window.location=t)})}},error:function(i){}});var a=1,s=!0,n=null;function e(){s=!1,$.ajax({type:"post",url:"/me/home-recommend",async:!0,data:{pageId:a},success:function(i){if(console.log("微博",i),0==i.state)for(var t=0;t<i.data.items.length;t++){var n="";if(1==i.data.items[t].type)n+="<div class='community-frist-shows-one'>",n+="<div class='community-frist-shows-one-free' uid='"+i.data.items[t].subData.uid+"'>",n+=`<img src = '${i.data.items[t].subData.icon}'  class='community-frist-tie' onerror="this.onerror=null; this.src='../images/w-yuan.jpg'"/ >`,n+="<div class='community-frist-cen'>",n+="<p>"+i.data.items[t].subData.nickName+"</p>",n+="<p>"+i.data.items[t].subData.ctime+"</p>",n+="</div>",n+="</div>",n+="<div class='community-frist-shows-one-fre'  wid = '"+i.data.items[t].subData.wid+"'>",null==i.data.items[t].subData.turnData?(n+="<div class='community-frist-one-cen'>"+dy.icon.replaceText(i.data.items[t].subData.content)+"<span class='redcolor' tid='"+i.data.items[t].subData.tid+"'>#"+i.data.items[t].subData.tname+"#</span></div>",null!=i.data.items[t].subData.picture&&(n+="<div class='community-imgbox'>",n+=`<img class='community-frist-img' src='${i.data.items[t].subData.picture.imgUrl}' onload='loadImg(this)'  onerror="this.onerror=null; this.src='../images/ooooo.png'"/>`,n+="</div>")):(n+="<div class='community-frist-one-cen'>"+dy.icon.replaceText(i.data.items[t].subData.content)+"</div>",null!=i.data.items[t].subData.picture&&(n+="<div class='community-imgbox'>",n+=`<img class='community-frist-img' src='${i.data.items[t].subData.picture.imgUrl}' onload='loadImg(this)'  onerror="this.onerror=null; this.src='../images/ooooo.png'"/>`,n+="</div>"),n+="<div class='community-xintian'>",n+="<div class='community-frist-one-cen'><span class='bluecolor'>@"+i.data.items[t].subData.turnData.nickName+"</span>"+dy.icon.replaceText(i.data.items[t].subData.turnData.content)+"<span class='redcolor' tid='"+i.data.items[t].subData.tid+"'>#"+i.data.items[t].subData.tname+"#</span></div>",null!=i.data.items[t].subData.turnData.picture&&null!=i.data.items[t].subData.turnData.picture&&(n+="<div class='community-imgbox'>",n+=`<img class='community-frist-img' src='${i.data.items[t].subData.turnData.picture.imgUrl}' onload='loadImg(this)'  onerror="this.onerror=null; this.src='../images/ooooo.png'"/>`,n+="</div>"),n+="</div>"),n+="</div>",n+="<div class='community-frist-bot'>",n+="<img src = 'images/ic_index_03.png'  class='community-frist-ic_index_03' wid = '"+i.data.items[t].subData.wid+"'/>",n+="<span>"+i.data.items[t].subData.comments+"</span>",0==i.data.items[t].subData.isLike?(n+="<span class='community-frist-bot-likes community-black'>"+i.data.items[t].subData.likes+"</span>",n+="<img src='images/zanh.png'  class='community-frist-zanh' wid = '"+i.data.items[t].subData.wid+"'/>"):1==i.data.items[t].subData.isLike&&(n+="<span class='community-frist-bot-likes community-red'>"+i.data.items[t].subData.likes+"</span>",n+="<img src='images/inzan.png'  class='community-frist-zanh' wid = '"+i.data.items[t].subData.wid+"'/>"),n+="</div>",n+="</div>";else if(2===i.data.items[t].type&&i.data.items[t].subData.length>0){n+="<div class='community-frist-subData'>",n+="<p class='community-frist-subData-p'>推荐用户</p>",n+="<div class='community-frist-subData-div'>",n+="<div class='swiper-container'>",n+="<div class='swiper-wrapper'>";for(var e=0;e<i.data.items[t].subData.length;e++)n+="<div class='swiper-slide'>",n+="<div class='community-frist-subData-div-div' >",n+="<div class='community-frist-subData-div-div-click' uid='"+i.data.items[t].subData[e].uid+"'>",n+="<img src="+i.data.items[t].subData[e].icon+" class='community-frist-subData-div-div-img'/>",n+="<p class='community-frist-subData-div-div-p1'>"+i.data.items[t].subData[e].nickName+"</p>",n+="</div>",0==i.data.items[t].subData[e].isFollow?n+="<img src='images/weiguanhong.png' class='community-frist-subData-div-div-p2' data-uid = "+i.data.items[t].subData[e].uid+">":n+="<img src='images/yiguanhei.png' class='community-frist-subData-div-div-p2' data-uid = "+i.data.items[t].subData[e].uid+">",n+="</div>",n+="</div>";n+="</div>",n+="</div>",n+="</div>",n+="</div>"}$(".community-frist-shows").append(n)}new Swiper(".community-frist-subData .swiper-container",{slidesPerView:"auto",paginationClickable:!0,freeMode:!0});homepages($(".community-frist-subData-div-div-click")),zan($(".community-frist-zanh")),postint($(".community-frist-ic_index_03")),homepages($(".community-frist-shows-one-free")),$(".community-frist-subData-div-div-p2").on("click",function(){var i=$(this).attr("data-uid"),t=$(this).attr("src"),a=$(this);"images/weiguanhong.png"==t?$.ajax({type:"post",url:"/me/follow",async:!0,dataType:"json",data:{uid:i,type:1},success:function(i){if("none"==i.token){var t=window.location.href;window.sessionStorage.setItem("historyURL",t),window.location="myself.html"}0==i.state&&a.attr("src","images/yiguanhei.png")},error:function(i){}}):"images/yiguanhei.png"==t&&$.ajax({type:"post",url:"/me/follow",async:!0,dataType:"json",data:{uid:i,type:0},success:function(i){if("none"==i.token){var t=window.location.href;window.sessionStorage.setItem("historyURL",t),window.location="myself.html"}0==i.state&&a.attr("src","images/weiguanhong.png")},error:function(i){}})}),$(".community-frist-shows-one-fre").on("click",function(i){var t=(i=i||window.event).target;"redcolor"==$(t).attr("class")?window.location="topic.html?tid="+$(t).attr("tid")+(dy.util.isWeiXin()?"&q=wx":""):window.location="postint.html?wid="+$(this).attr("wid")+(dy.util.isWeiXin()?"&q=wx":"")}),i.data.pageTotal>a?a++:($(".community-bottom").text("已经到底了"),setTimeout(function(){$(".community-bottom").hide()},2e3),setInterval(function(){s=!1},100))},complete:function(){clearTimeout(n),n=setTimeout(function(){s=!0},150)},error:function(i){alert("请求超时")}})}e(),$(window).on("scroll",function(){Math.ceil($(window).scrollTop())>=$(document).height()-$(window).height()&&1==s&&e()}),window.loadImg=function(i){var t=i,a=$(t),s=($(t).attr("src"),t.width),n=t.height;if(s>=n)a.css("width","29.2rem");else if(s<n){var e=$("<div><div>").css({width:"29.2rem",height:"29.2rem",overflow:"hidden"});a.css("width","29.2rem");var o=a.parent();e.append(a),o.append(e)}},rank(),wx.ready(function(){share("大鱼优品购物社区-购物分享社交平台","我在大鱼优选社区，赶快跟我来看看大家都买了什么好物吧~",dyyp.DOMAIN+"/community1.html?random="+(new Date).toLocaleTimeString(),dyyp.DOMAIN+"/img/new.jpg")})});
function rank(){$.ajax({url:"/getsignature",type:"post",async:!1,data:{url:location.href.split("#")[0]}}).done(function(e){wx.config({debug:!1,appId:e.appId,timestamp:e.timestamp,nonceStr:e.nonceStr,signature:e.signature,jsApiList:["checkJsApi","onMenuShareTimeline","onMenuShareAppMessage","onMenuShareQQ","onMenuShareWeibo","onMenuShareQZone","hideMenuItems","showMenuItems","chooseImage","chooseWXPay","getLocation","getNetworkType","showAllNonBaseMenuItem"]})})}function share(e,n,o,t){wx.onMenuShareAppMessage({title:e,desc:n,link:o,imgUrl:t,type:"",dataUrl:"",success:function(){},cancel:function(){}}),wx.onMenuShareTimeline({title:e,link:o,imgUrl:t,success:function(){console.log("分享到朋友圈")},cancel:function(){}}),wx.onMenuShareQQ({title:e,desc:n,link:o,imgUrl:t,success:function(){},cancel:function(){}}),wx.onMenuShareWeibo({title:e,desc:n,link:o,imgUrl:t,success:function(){},cancel:function(){}}),wx.onMenuShareQZone({title:e,desc:n,link:o,imgUrl:t,success:function(){},cancel:function(){}})}function hideMenuItems(){wx.hideMenuItems({menuList:["menuItem:readMode"],success:function(){console.log("隐藏成功")}})}function showMenuItems(){wx.showMenuItems({menuList:["menuItem:profile","menuItem:addContact"],success:function(){console.log("显示成功")},fail:function(e){console.log("no")}})}

$(function(){
    //2018.9.1新加需求开店礼包自己判改变样式
    var shopAuth=GetQueryString("shopAuth");
    //2018.7.13 新加需求 佣金卡发放
    var refereeCode=GetQueryString("refereeCode");
    // alert("佣金"+refereeCode);
    //下载APP 佣金
    downLoadApp($(".spreader-download-app"));
    //调试工具
    // var vConsole = new VConsole();
    //调用分享获取身份认证
    rank();
    //页面加载时清除sku里面得图片，在轮播图回来得数据里再加上，然后sku弹出时取值
    sessionStorage.removeItem("productImages");
    //数量清理
    sessionStorage.removeItem("quantity");
    //秒杀未开始状态的清除
    sessionStorage.removeItem("seckillState");
    //单买价清除
    // sessionStorage.removeItem("sepPrice");
    //清除orderType 点击按钮时存储
    sessionStorage.removeItem("orderType");
    //清除orderType为3或者4时清除luckPrice价钱
    sessionStorage.removeItem("luckPrice");
    //清除团ID
    sessionStorage.removeItem("packClusterId");
    var fressStatus=GetQueryString("status");
    //增加从团详情页跳转过来的packClusterId
    var packClusterId;
    if(GetQueryString("packClusterId")!=null){
       sessionStorage.setItem("packClusterId",GetQueryString("packClusterId"));
       packClusterId=sessionStorage.getItem("packClusterId");
    }
    // alert(packClusterId);
    // alert(packClusterId);null
    var pid;
    if(GetQueryString("pid")!=undefined){
        pid=GetQueryString("pid");
        // console.log("url里的:"+pid);
    }else{
        pid=sessionStorage.getItem("pid");
        // console.log("session里的:"+pid);
    }
// //console.log(pid);
    //遮罩层的实现
        var winW=$(window).width();
        var winH=$(window).height();
        ////console.log( winH);
        // //console.log(winW,winH);
        $(".seckilldetails-all-model").width(winW);
        $(".seckilldetails-all-model").height(winH);
        //遮罩层的实现
        $(".comment-model").width(winW);
        $(".comment-model").height(winH);



    //控制遮罩层和模块的显示/隐藏公共函数
    function show(sel1,sel2){
        $(sel1).show();
        $(sel2).show();
        //模态框出现底部页面不能滑动
        $("body").height($(window).height()).css("overflow","hidden");
    }
    function hide(sel1,sel2){
        $(sel1).hide();
        $(sel2).hide();
        //消失后取消事件
        $("body").height($(document).height()).css("overflow","auto");
    }

    //获取正在参团中的信息
    $.ajax({
        url:"/me/getFakeClusterInfo",
        type:"POST",
        async:false,
        data:{productId:pid},
        success:function(result){
            console.log("获取正在参团中的信息",result);
            if(result.state==0){
                var items=result.data;
                if(items.length>0){
                    var html=``;
                    for(var i=0;i<items.length;i++){
                        html+=`<div class="seckilldetails-newGroup-list">`
						<!--左-->
						html+=`<div class="seckilldetails-newGroup-list-left">`;
						if(items[i].initiatorIcon!=undefined){
                            html+=`<img src="${items[i].initiatorIcon}" alt="">`;
                        }else{
                            html+=`<img src="../img/ooooo.png" alt="">`;
                        }
						html+=`</div>
						<!--右-->
						<div class="seckilldetails-newGroup-list-right">
							<!--name-->
							<div class="seckilldetails-newGroup-list-right-name">
								${items[i].initiatorName}的团
							</div>
							<!--按钮-->
							<div class="seckilldetails-newGroup-list-right-go" data-clusterId="${items[i].clusterId}">去参团</div>
							<!--成团人数-->
							<div class="seckilldetails-newGroup-list-right-people">
								<p class="seckilldetails-newGroup-list-right-people-p1">还差<b>${items[i].surplusNum}人</b>成团</p>`;
                        html+=`<p class="seckilldetails-newGroup-list-right-time-start">
									<b>剩余</b>
									<span style="display: inline-block;width:3rem;" class="hours${i}">00</span>
									<b>:</b>
									<span style="display: inline-block;width:3rem;" class="minutes${i}">00</span>
									<b>:</b>
									<span style="display: inline-block;width:3rem;" class="seconds${i}">00</span>
									<b>.</b>
									<span style="display: inline-block;width:2rem;" class="ms${i}">0</span>
								</p>`;
                        //活动剩余时间
                        var time=items[i].endTime;
                        // console.log(time);
                        //毫秒数换算为秒
                        var num =parseInt(time)/ 1000;
                        //调用时间函数
                        times(num,i);
                        //倒计时
                        countDown(10,i);
                        html+=`</div>
						</div>
					</div>`
                    }
                    $(".seckilldetails-newGroup-container").html(html);
                    if(items.length==1){
                        $(".seckilldetails-newGroup-container").css("height","auto");
                    }
                }else{
                    $(".seckilldetails-newGroup").hide();
                }
            }else{
                $(".seckilldetails-newGroup").hide();
                $(".seckilldetails-group-line").hide();
            }
            //剩余时间函数
            function times(num,n){
                if(num>0){
                    //启动定时器
                    var timer= setInterval(function(){
                        num--;
                        var  day=parseInt(num/3600/24);
                        //console.log.log(day);
                        var hours = parseInt(num / 3600 % 24);
                        var minutes = parseInt(num / 60 % 60);
                        var seconds = parseInt(num % 60);
                        // var ms=parseInt(num % 1000);
                        // $(".ms"+n).html(ms);
                        if (hours < 10) {
                            $(".hours"+n).html("0" + hours);
                        } else {
                            $(".hours"+n).html(hours);
                        }
                        if (minutes < 10) {
                            $(".minutes"+n).html("0" + minutes);
                        } else {
                            $(".minutes"+n).html(minutes);
                        }
                        if (seconds < 10) {
                            $(".seconds"+n).html("0" + seconds);
                        } else {
                            $(".seconds"+n).html(seconds);
                        }
                        //小于等于0时清除定时器，显示已结束
                        if (day<=0&&hours <= 0 && minutes <= 0 && seconds <= 0) {
                            clearInterval(timer);
                            timer = null;
                            $(".hours"+n).html("00");
                            $(".minutes"+n).html("00");
                            $(".seconds"+n).html("00");
                            $(".ms"+n).html("0");
                            // location.reload();
                        }
                    },1000);
                }
            }
            //倒计时函数
            function countDown(num,n){
                if(num>=0){
                    //启动定时器
                    var timers= setInterval(function(){
                        num--;
                        // alert(num)
                        $(".ms"+n).html(num);
                        console.log()
                        //小于等于0时清除定时器，显示已结束
                        if (num<=0) {
                            num=10;
                        }
                    },100);
                }
            }
        },
        error:function(e){
            console.log(e);
        }
    })





   //  产品参数
    $("#seckilldetails-product-num-1").on("click",function () {
        show(".seckilldetails-all-model",".seckilldetails-all-productNum");
        //模态框出现底部页面不能滑动
        $("body").height($(window).height()).css("overflow","hidden");
        $("body").css("position","fixed");
    });
    $(".seckilldetails-all-productNum div.d-bottom").on("click",function () {
        hide(".seckilldetails-all-model",".seckilldetails-all-productNum");
        //消失后取消事件
        $("body").height($(window).height()).css("overflow","auto");
        $("body").css("position","");
    });

//尺寸规格    页面上没有尺寸规格了
//     $("#seckilldetails-product-num-2").on("click",function () {
//         show(".seckilldetails-all-model",".seckilldetails-all-sizeNum");
//     });
     //点击关闭按钮
    $(".seckilldetails-all-sizeNum p.close").on("click",function () {
        hide(".seckilldetails-all-model");
        $(".seckilldetails-all-sizeNum").css("bottom","-200rem");
        $("body").css("position","");
    });
    //点击模态框sku框消失，参数框消失
    $(".seckilldetails-all-model").on("click",function(){
        hide(".seckilldetails-all-model");
        $(".seckilldetails-all-sizeNum").css("bottom","-200rem");
        hide(".seckilldetails-all-model",".seckilldetails-all-productNum");
        $("body").css("position","");
    });
    /*****************商品详情页的商品轮播部分 接收上一个页面的商品pid*************************/
    //专场ID
    var specialId= GetQueryString("specialId");
    // alert("专场ID:"+specialId);
    sessionStorage.setItem('specialId', specialId);
    //秒杀活动为1  ，新品推荐为2
    //1为秒杀，2为新品推荐
    var activityType=GetQueryString("activityType");
    // alert("活动类型："+activityType);
    sessionStorage.setItem('activityType', activityType);

    //	定义两个数组放评价的图片
    var commentImg=[];
    var appendImg=[];
    $.ajax({
        type: "post",
        url: "/me/product-detail",
        data:{productId:pid,specialId:specialId,activityType:activityType},
        async: true,
        success: function (result) {
            console.log(result);
            if(result.state==0){
                //判断是不是佣金商品
                var commissionDes=result.data.productDetails.commissionDes;
                var baseCommissionPrice=result.data.productDetails.baseCommissionPrice;
                var commissionMultiplePrice=result.data.productDetails.commissionMultiplePrice;
                    if (commissionDes != undefined) {
                        $(".yongjincontainer").show();
                        $(".nine-box-yongjin-s1").html(commissionDes);
                        $(".nine-box-yongjin-s").html(baseCommissionPrice);
                        $(".nine-box-yongjin-s2").html(commissionMultiplePrice);
                    }
                    if (commissionDes == undefined && baseCommissionPrice != undefined) {
                        $(".yongjincontainer").show();
                        $(".nine-box-yongjin-s1").html(dayu.lang.commission);
                        $(".nine-box-yongjin-s").hide();
                        $(".nine-box-yongjin-s2").html(baseCommissionPrice);
                    }
                var shopIcon = result.data.productShopInfo.iconUrl;
                // var shopId = result.data.productShopInfo.shopId;
                // var shopName = result.data.productShopInfo.shopName;
                window.sessionStorage.setItem("shopIcon",shopIcon);
                // window.sessionStorage.setItem("shopId",shopId);
                // window.sessionStorage.setItem("shopName",shopName);

                // //console.log(token);
                //几人团
                var groupNum=result.data.productDetails.groupNum;
                if(groupNum!=undefined){
                    $("#seckilldetails-bottom-right-2 p:eq(1)").html(groupNum+dayu.lang.peoplesGroup);
                }
                //判断秒杀限购
                var limitQuantity = result.data.productDetails.limitQuantity;
                //console.log("判断秒杀："+limitQuantity);
                if(limitQuantity!=null&&limitQuantity!=undefined){
                    sessionStorage.setItem("limitQuantity",limitQuantity);
                }
                // //console.log(result.data.commentList);
                //评价信息2条
                if(result.data.commentList!=null&&result.data.commentList.length>0){
                    var commentList=result.data.commentList;
                    ////console.log(commentList);
                    var html='';
                    for(var i=0;i<commentList.length;i++){
                        ////console.log(commentList[i]);
                        var pid=commentList[i].productId;//商品id
                        var shopId=commentList[i].shopId;//店铺id
                        var userId=commentList[i].userId;//用户id
                        var score=commentList[i].score;//分数
                        console.log(score);
                        var anonymity=commentList[i].anonymity;//是否匿名;
                        var attitude=commentList[i].attitude;//服务态度
                        var logistics=commentList[i].logistics;//物流评分
                        var evaluateData=commentList[i].evaluateData;//评价时间修改，不要时分秒
                        evaluateData=evaluateData.substring(0,11);
                        // alert(evaluateData);

                        html+='<div class="seckilldetails-comment-comments-1">';
                        html+='<div class="seckilldetails-comment-comments-img">';
                            if(commentList[i].userIcon!=null&&commentList[i].userIcon!=""&&commentList[i].userIcon!="null"){
							    html+='<img src="'+commentList[i].userIcon+'" alt="" onerror="this.onerror=null; this.src=\'img/s-commentIcon.png\'"/>';
                            }else{
                                html+='<img src="img/ooooo.png" alt="" onerror="this.onerror=null; this.src=\'img/s-commentIcon.png\'"/>';
                            }

						html+='</div>';
                        html+='<div class="com-user">';
                        html+='<div class="com-user-niming">';
                                if(commentList[i].userName!=null&&commentList[i].userName!=""&&commentList[i].userName!="null"){
								    html+='<span class="com-user-1" style="display:inline-block;white-space:nowrap; overflow:hidden; text-overflow:ellipsis; width:10rem;">'+commentList[i].userName+'</span>';
                                }else{
                                    html+='<span class="com-user-1" style="display:inline-block;white-space:nowrap; overflow:hidden; text-overflow:ellipsis; width:10rem;">'+dayu.lang.anonymousUser+'</span>';
                                }
                        html+='<span class="start-backs">';
                        html+='<b class="start-sizes">';
                        //评分得小数判断
                        var reg=/^\d+$/;
                        var boolean=reg.test(score);
                       // console.log(boolean);
                        if (!boolean) {
                            //console.log("不是整数");
                            var score1 = Math.floor(score);
                            console.log(score1);
                            for (var x = 0;x < score1; x++) {
                                html+='<img src="img/star@2x.png"/>';
                            }
                            html+='<img src="img/bange.png"/>';
                            for (var g = 0; g < 5 - score1 - 1; g++) {
                                html+='<img src="img/greestar@2x.png"/>';
                            }
                        } else {
                            for(var h=0;h<Math.ceil(score);h++){
                                html+='<img src="img/star@2x.png"/>';
                            }
                            for(var y=0;y<5-Math.ceil(score);y++){
                                html+='<img src="img/greestar@2x.png"/>';
                            }
                        }
                        html+='</b>';
                        html+='</span>';
                        html+='<span class="com-user-3">'+evaluateData+'</span>';
                        html+='</div>';
                        html+='<div class="com-user-pingjia">'+commentList[i].content+'</div>';
                        if(commentList[i].imgs!=null){
                            html+='<div class="com-user-img">';
                            for(var j=0;j<commentList[i].imgs.length;j++){
                                html+='<img src="'+commentList[i].imgs[j]+'" alt="" class="com-user-img-img" onerror="this.onerror=null; this.src=\'img/s-comment.png\'"/>';
                                //把评价图片放入数组
                                commentImg.push(commentList[i].imgs[j]);
                            }
                            html+='</div>';
                        }
                        if(commentList[i].replyMsg!=null){
                            html+='<div class="com-user-sell-huifu">';
                            html+='<span>'+dayu.lang.merchantResponse+'：</span>';
                            html+='<span>'+commentList[i].replyMsg+'</span>';
                            html+='</div>';
                        }
                        html+='<div class="com-user-zhuiping">';

                        if(commentList[i].appendComment!=undefined&&commentList[i].appendComment!=null){
                            // alert(commentList[i].appendComment)
                            var str1 = commentList[i].evaluateData;
                            var str2 =commentList[i].appendCommentTime;
                            var str3 = str1.replace(/-/g, '\/');
                            var str4 = str2.replace(/-/g, '\/');
                            var oldTime1 = (new Date(str3)).getTime() / 1000;
                            var oldTime2 = (new Date(str4)).getTime() / 1000;
                            var oldtime = oldTime2 - oldTime1;
                            if(oldtime > 84600) {
                                html += '<p class="com-user-zhuiping-1">'+dayu.lang.userReview+'</p>';
                            }else{
                                html += '<p class="com-user-zhuiping-1">'+dayu.lang.sameDay+'</p>';
                            }
                            html+='<p class="com-user-pingjia">'+commentList[i].appendComment+'</p>';
                            if(commentList[i].appendImgs!=null){
                                html+='<p class="com-user-img com-uesr-quborder">';
                                for(var k=0;k<commentList[i].appendImgs.length;k++){
                                    html+='<img src="'+commentList[i].appendImgs[k]+'" class="com-uesr-quborder-img" alt="" onerror="this.onerror=null; this.src=\'img/s-comment.png\'"/>';
                                    appendImg.push(commentList[i].appendImgs[k]);
                                }
                                html+='</p>';
                                html+='</div>';
                                if(commentList[i].replyAppendMsg!=null){
                                    html+='<div class="com-user-sell-huifu">';
                                    html+='<span>'+dayu.lang.merchantResponse+'：</span>';
                                    html+='<span>'+commentList[i].replyAppendMsg+'</span>';
                                    html+='</div>';
                                }
                            }
                        }

                        html+='<div class="com-user-biaozhun">';
                        if(commentList[i].skuName=="undefined"||commentList[i].skuName==undefined){
                            $(".com-user-biaozhun").hide();
                        }else{
                            html+='<span>'+commentList[i].skuName+'</span>';
                        }
                        html+='</div>';
                        html+='</div>';
                        html+='</div>';
                        html+='</div>';
                    }
                    $(".seckilldetails-comment-comments").html(html);

                    //点击评论区域跳转到全部评价页 点击评论区域的图片到大图
                    $(".seckilldetails-comment-comments").on("click",function(e){
                        //console.log($(".com-uesr-quborder"));
                        var that=$(e.target);
                        var commentClass=that.attr("class");
                        //console.log(commentClass);
                        if(commentClass=="com-user-img-img"){
                           //console.log(1);
                        }else if(commentClass=="com-uesr-quborder-img"){
                            //console.log(2);
                        }else{
                            location.href="s-comment.html?pid="+pid+"&score="+productDetails.score+"&comments="+productDetails.comments;
                        }
                    });
                    // //console.log(commentImg);
                    // //console.log(appendImg);
                    //成功利用闭包，点击评价图片跳转到大图
                    for(var i=0;i<$(".com-user-img-img").length;i++){
                        $(".com-user-img-img")[i]=i;
                        $(".com-user-img-img")[i].onclick=(function(i){
                            return function(){
                                //console.log("评价的图片index:"+i);
                                //模态框出现
                                $(".comment-model").show();

                                //点击模态框自己消失
                                $(".comment-model").on("click",function(){
                                    $(this).hide();
                                    $(".swiper-container .swiper-wrapper").html("");

                                });
                                var html='';
                                for(var e=0;e<commentImg.length;e++){
                                    //console.log(commentImg[e]);
                                    html += '<div class="swiper-slide" style="vertical-align: middle">';
                                    html += '<div class="imgs-div">';
                                    html += '<img id="image'+e+'"  src="'+commentImg[e]+'" class="imagesa" style="width:75rem;height:120rem;" />';
                                    html += '</div>';
                                    html += '</div>';
                                }

                                $(".swiper-container .swiper-wrapper").html(html);
                                var mySwiper = new Swiper('.swiper-container', {
                                    pagination: '.swiper-pagination',
                                    paginationClickable: true,
//							控制图片的index
                                    paginationType: 'fraction',
                                    autoHeight: true,
                                    initialSlide: i
                                });
                            }
                        })(i);
                    }

                    //点击追评图片，到大图
                    for(var j=0;j<$(".com-uesr-quborder-img").length;j++){
                        $(".com-uesr-quborder-img")[j]=j;
                        $(".com-uesr-quborder-img")[j].onclick=(function(j){
                                return function(){
                                    //console.log("追评的图片index:"+j);
                                    //模态框出现
                                    $(".comment-model").show();
                                    //点击模态框自己消失
                                    $(".comment-model").on("click",function(){
                                        $(this).hide();
                                        $(".swiper-container .swiper-wrapper").html("");
                                    });
                                    var str='';
                                    for(var g=0;g<appendImg.length;g++){
                                        //console.log(appendImg[g]);
                                        str += '<div class="swiper-slide">';
                                        str += '<div class="imgs-div">';
                                        str += '<img id="image'+g+'"  src="'+appendImg[g]+'" class="imagesa" style="width:75rem;height:120rem;"/>';
                                        str += '</div>';
                                        str += '</div>';
                                    }

                                    $(".swiper-container .swiper-wrapper").html(str);
                                    var mySwiper = new Swiper('.swiper-container', {
                                        pagination: '.swiper-pagination',
                                        paginationClickable: true,
//							控制图片的index
                                        paginationType: 'fraction',
                                        autoHeight: true,
                                        initialSlide: j
                                    });
                                }
                        })(j);
                    }
                }else{
                    //没有评价或者length<0，让“全部评价”的字段消失
                    $(".seckilldetails-comment-comments").hide();
                    $(".seckilldetails-comment-all").hide();
                }
                //商品详情信息
                var productDetails=result.data.productDetails;

                //设秒杀活动未开始的状态
                var seckillState = productDetails.seckillState;
                //console.log(seckillState);
                sessionStorage.setItem('seckillState',seckillState);



                //收藏字段用于判断页面初始化后“收藏”的颜色
                var isCollect=productDetails.isCollect;
                if(isCollect==1){
                    $("#seckilldetails-bottom-left-13 dt img").attr("src","img/shoucang@2x.png");
                    $("#seckilldetails-bottom-left-13 dd").html(dayu.lang.bookmarked).css("color","#fd6363");
                }else{
                    $("#seckilldetails-bottom-left-13 dt img").attr("src", "img/sc@2x.png");
                    $("#seckilldetails-bottom-left-13 dd").html(dayu.lang.favorite).css("color","#444444");
                }
                //判断是否为秒杀商品
                ////console.log(productDetails.activityType);
                //activityType=1为秒杀抢购，2为新品    3为拼手气   4为合伙买
                if(productDetails.activityType!=null&&productDetails.activityType==2){
                    //console.log(productDetails.seckillSepPrice);
                    $(".sepprice").html("￥"+productDetails.sepPrice);
                    $(".group").html("￥"+productDetails.groupPrice);
                }
                // alert(!productDetails.activityType)
                if(productDetails.activityType!=null){
                    if(productDetails.activityType==1) {
                        $(".seckilldetails-miaosha").show();
                        if (productDetails.seckillGroupPrice != undefined) {
                            $(".seckilldetails-miaosha-txt-seckillGroupPrice").html("<b style='font-weight:normal;font-size:3.6rem'>&yen;</b>" + productDetails.seckillGroupPrice);
                            $(".sepprice").html("￥" + productDetails.sepPrice);
                            $(".group").html("￥" + productDetails.groupPrice);
                        } else {
                            $(".seckilldetails-miaosha-txt-seckillGroupPrice").html("<b style='font-weight:normal;font-size:3rem'>&yen;</b>" + productDetails.seckillGroupPrice);
                            $(".sepprice").html("￥" + productDetails.sepPrice);
                            $(".group").html("￥" + productDetails.groupPrice);
                        }
                        //是秒杀商品的话，隐藏下面的价格
                        $(".p1").hide();
                        $(".seckilldetails-miaosha-txt-surplusStock").html(productDetails.surplusStock);
                        var seckillState = productDetails.seckillState;
                        //console.log(seckillState);
                        if (seckillState == 0) {
                            $(".seckilldetails-miaosha-txt").css("background-image", "url('img/seckilldetailsmiaoshabeijing.png')");
                            $(".seckilldetails-miaosha-txt-time").html("<p id='seckilldetails-miaosha-txt-time-p'>"+dayu.lang.completed+"</p>");
                        } else if (seckillState == 1) {
                            //如果库存为0显示已抢光
                            if (productDetails.stock == 0) {
                                console.log("秒杀判断库存"+productDetails.stock);
                                // $(".seckilldetails-miaosha-txt").css("background-image", "url('img/seckilldetailsmiaoshabeijing.png')");
                                $(".seckilldetails-miaosha-txt-time").html("<p id='seckilldetails-miaosha-txt-time-p'>"+dayu.lang.alreadyGrabbed+"</p>");
                                $("#seckilldetails-bottom-right-1").hide();
                                $("#seckilldetails-bottom-right-2").hide();
                                $(".seckilldetails-bottom-right-3").show().html(dayu.lang.alreadyGrabbed);
                            } else {
                                var time = productDetails.panicTimeLeft;
                                // //console.log(time);
                                //毫秒数换算为秒
                                var num = time / 1000;
                                var timer = setInterval(function () {
                                    num--;
                                    var num3 = parseInt(num / 3600);
                                    var num4 = parseInt(num / 60 % 60);
                                    var num5 = parseInt(num % 60);
                                    var html = '<p>'+dayu.lang.endTime+'：</p>';
                                        html+='<p>';
                                    html+='<span class="hourse"></span>';
                                    html+='<b>:</b>';
                                    html+='<span class="second"></span>';
                                    html+='<b>:</b>';
                                    html+='<span class="miao"></span>';
                                    html+='<b></b>';
                                    html+='</p>';
                                    $(".seckilldetails-miaosha-txt-time").html(html);
                                    if (num3 < 10) {
                                        $(".hourse").html("0" + num3);
                                    } else {
                                        $(".hourse").html(num3);
                                    }
                                    if (num4 < 10) {
                                        $(".second").html("0" + num4);
                                    } else {
                                        $(".second").html(num4);
                                    }
                                    if (num5 < 10) {
                                        $(".miao").html("0" + num5);
                                    } else {
                                        $(".miao").html(num5);
                                    }
                                    //小于等于0时清除定时器，显示已结束
                                    if (num3 <= 0 && num4 <= 0 && num5 <= 0) {
                                        clearInterval(timer);
                                        timer = null;
                                        $(".hourse").html("00");
                                        $(".second").html("00");
                                        $(".miao").html("00");
                                    }
                                }, 1000);
                            }
                        } else {
                            $(".seckilldetails-miaosha-txt-time").html("<p id='seckilldetails-miaosha-txt-time-p'>"+dayu.lang.notnBeginning+"</p>");
                            $(".sepprice").html("￥" + productDetails.sepPrice);
                            $(".group").html("￥" + productDetails.groupPrice);
                        }
                    }else if(productDetails.activityType==5){//0元购
                        $(".product-top-gundong").hide();
                        $(".seckilldetails-newGroup").hide();
                        $(".seckilldetails-miaosha").hide();
                        // 单独购买的价格  调用价格保留两位小数
                        if (productDetails.sepPrice != null) {
                            var sepPrice = productDetails.sepPrice;
                            $(".sepprice").html("&yen;" + sepPrice);
                        }
                        // 组团价格
                        console.log(productDetails.groupPrice);
                        if (productDetails.groupPrice != null) {
                            var groupPrice =productDetails.groupPrice;
                            console.log(groupPrice);
                            $(".seckilldetails-details-text p.p1 .s1").html("&yen;" + groupPrice);
                            $(".group").html("&yen;" + groupPrice);
                            $(".seckilldetails-miaosha-txt-groupprice").html(groupPrice);
                        }

                        $(".seckilldetails-shop").hide();
                        $(".seckilldetails-shop-show").hide();
                        //要判断的免单库存是否有
                        if(productDetails.stock==0){
                            $(".seckilldetails-bottom").html(dayu.lang.alreadyGrabbed).css("background","#bcbbbb").css("text-align","center").css("color","#ffffff").css("font-size","2.8rem").css("line-height","10rem");
                        }else{
                            $(".seckilldetails-bottom").html(dayu.lang.freeOrder).css("background","#da2f25").css("text-align","center").css("color","#ffffff").css("font-size","3.2rem").css("line-height","10rem");
                        }


                       //我要免单底部按钮
                        $(".seckilldetails-bottom").on("click",function(){
                            if($(".seckilldetails-bottom").html()==dayu.lang.alreadyGrabbed){
                                location.href="s-inviteFreeOrderProduct.html?random="+new Date().getTime();
                            }else{
                                location.href="s-downLoadApp.html?freeId="+productDetails.fbId;
                            }
                        });
                    }else if(productDetails.activityType==6){//礼包商品我自己判了，因为暂时没更新接口
                           $(".seckilldetails-newGroup").hide();
                          // $(".yongjincontainer").hide();
                           $(".seckilldetails-group-line").hide();
                           $(".s1").html("&yen;" + productDetails.groupPrice);
                           $(".sepprice").html("&yen;" + productDetails.sepPrice);
                           $("#seckilldetails-bottom-right-2").hide();
                           $("#seckilldetails-bottom-right-1").css({"background":"#da2f25","width":"100%"});
                           $("#seckilldetails-bottom-right-1 p:last-child").html("立即购买");
                    }else if(productDetails.activityType==0){//为了兼容后台接口第一次和第二次数据给的不统一问题
                        $(".seckilldetails-miaosha").hide();
                        // 单独购买的价格  调用价格保留两位小数
                        if (productDetails.sepPrice != null) {
                            var sepPrice = productDetails.sepPrice;
                            $(".sepprice").html("&yen;" + sepPrice);
                        }
                        // 组团价格
                        console.log(productDetails.groupPrice);
                        if (productDetails.groupPrice != null) {
                            var groupPrice =productDetails.groupPrice;
                            // alert(groupPrice);
                            $(".seckilldetails-details-text p.p1 .s1").html("&yen;" + groupPrice);
                            $(".group").html("&yen;" + groupPrice);
                            $(".seckilldetails-miaosha-txt-groupprice").html(groupPrice);
                        }
                    }else{
                        $(".sepprice").html("&yen;" + productDetails.sepPrice);
                        $(".group").html("&yen;" + productDetails.groupPrice);
                        $(".s1").html("&yen;" + productDetails.seckillGroupPrice);
                    }

                }else{
                    $(".seckilldetails-miaosha").hide();
                    // 单独购买的价格  调用价格保留两位小数
                    if (productDetails.sepPrice != null) {
                        var sepPrice = productDetails.sepPrice;
                        $(".sepprice").html("&yen;" + sepPrice);
                    }
                    // 组团价格
                    console.log(productDetails.groupPrice);
                    if (productDetails.groupPrice != null) {
                        var groupPrice =productDetails.groupPrice;
                        // alert(groupPrice);
                        $(".seckilldetails-details-text p.p1 .s1").html("&yen;" + groupPrice);
                        $(".group").html("&yen;" + groupPrice);
                        $(".seckilldetails-miaosha-txt-groupprice").html(groupPrice);
                    }
                }
                //从订单详情页进入的商品详情页，新品商品为0   新品活动库存为0时显示已抢光
                if(productDetails.activityType!=undefined&&productDetails.activityType==2&&productDetails.stock==0){
                    $("#seckilldetails-bottom-right-1").hide();
                    $("#seckilldetails-bottom-right-2").hide();
                    $(".seckilldetails-bottom-right-3").show().html(dayu.lang.alreadyGrabbed);
                }
                /********************判断是否是拼手气3或者合伙买4***************************************/
                if(productDetails.activityType!=null&&productDetails.activityType==3||productDetails.activityType==4){
                    $(".seckilldetails-pinshouqi").show();
                   // alert(dayu.lang.remaining+"："+productDetails.stock+""+dayu.lang.pieces);
                    $(".seckilldetails-pinshouqi-stock").html(dayu.lang.remaining+"："+productDetails.stock+""+dayu.lang.pieces);
                    $(".seckilldetails-pinshouqi-price b").html(productDetails.luckPrice);
                    $(".seckilldetails-pinshouqi-price .seckilldetails-pinshouqi-name").html(productDetails.activityName);
                    // $(".s1").html("&yen;"+productDetails.groupPrice);
                    $(".s1").hide();
                    $(".line-hide").hide();
                    $(".seckilldetails-tab").hide();
                    //判断库存
                    if(productDetails.stock==0){
                        // $(".seckilldetails-pinshouqi-time").css("background-image","url('img/seckilldetailsmiaoshabeijing.png')");
                        $(".seckilldetails-pinshouqi-time").html("<p id='seckilldetails-pinshouqi-time-p' style='color:#ffffff;font-size:2.8rem;text-align:right;padding-right:2rem;margin-top:3rem;'>"+dayu.lang.alreadyGrabbed+"</p>");
                        $("#seckilldetails-bottom-right-1").hide();
                        $("#seckilldetails-bottom-right-2").hide();
                        $(".seckilldetails-bottom-right-3").show().html(dayu.lang.alreadyGrabbed);
                    }
                    // 时间
                    var time=productDetails.panicTimeLeft;
                    //毫秒数换算为秒
                    var num = time / 1000;
                    var timer = setInterval(function () {
                        num--;
                        var day=parseInt(num/3600/24);
                        //console.log(day);
                        var hours = parseInt(num / 3600 % 24);
                        var minutes = parseInt(num / 60 % 60);
                        var seconds = parseInt(num % 60);
                        $(".day").html(day);
                        if (hours < 10) {
                            $(".hours").html("0" + hours);
                        } else {
                            $(".hours").html(hours);
                        }
                        if (minutes < 10) {
                            $(".minutes").html("0" + minutes);
                        } else {
                            $(".minutes").html(minutes);
                        }
                        if (seconds < 10) {
                            $(".seconds").html("0" + seconds);
                        } else {
                            $(".seconds").html(seconds);
                        }
                        //小于等于0时清除定时器，显示已结束
                        if (day<=0&&hours <= 0 && minutes <= 0 && seconds <= 0) {
                            clearInterval(timer);
                            timer = null;
                            $(".day").html("00");
                            $(".hours").html("00");
                            $(".minutes").html("00");
                            $(".seconds").html("00");
                        }
                    }, 1000);
                    //规则
                    $(".seckilldetails-active-rule").show();
                    $(".seckilldetails-active-rule-txt p").html(productDetails.activityRuleContext);
                    // 下面按钮内容
                    $(".sepprice").html("&yen;"+productDetails.groupPrice);
                    $("#seckilldetails-bottom-right-1 p:last-child").html(productDetails.groupNum+dayu.lang.peoplesGroup);
                    $(".group").html("&yen;"+productDetails.luckPrice);
                    $("#seckilldetails-bottom-right-2 p:last-child").html(productDetails.luckButVal);
                }else{
                    $(".line-hide").hide();
                }

                //******************商品展示的轮播图***********************/
                var str = '';
                for (var i = 0; i < productDetails.productImages.length; i++) {
                    if (productDetails.productImages.length == 1) {
                        $(".seckilldetails-top-img .swiper-pagination").hide();
                        str += '<div class="swiper-slide"><img src="'+productDetails.productImages[i]+'" /></div>';
                    } else {
                        str += '<div class="swiper-slide"><img src="'+productDetails.productImages[i]+'" /></div>';
                    }
                    sessionStorage.setItem('productImages', productDetails.productImages[0]);
                    //console.log(sessionStorage.getItem("productImages"));
                }
                $(".seckilldetails-top-img-box .swiper-wrapper").html(str);

                //点击图片进入展示productImg页面
                $(".seckilldetails-top-img-box .swiper-slide").on("click", function () {
                    var index = $(this).index();
                    //console.log(index);
                    var pid = GetQueryString("pid");
                    //console.log(pid);
                    location.href = "productImg.html?productId=" + pid + "&index=" + index;
                });

                var swiper = new Swiper(' .seckilldetails-all .seckilldetails-top-img .seckilldetails-top-img-box  .swiper-container', {
                    pagination: '.swiper-pagination',
                    paginationClickable: true,
                    spaceBetween: 30,
                    centeredSlides: true,
                    // autoplay: 2500,
                    autoplayDisableOnInteraction: false
                });
                // 商品名称
                $(".seckilldetails-details-text h1").html(productDetails.productName);
                // <!--极速退款，7天退货部分-->
                var html = '';
                for (var i = 0; i < productDetails.committed.length; i++) {
                    html += '<p><img src="img/duihao@2x.png" alt=""/><span>'+productDetails.committed[i]+'</span></p>';
                }
                $(".seckilldetails-tab").html(html);
                // 详情介绍文字
                // alert(productDetails.description);
                $(".seckilldetails-details-text p.p3").html(productDetails.description);


                // //console.log("名字："+productDetails.productName+"描述："+productDetails.description+"商品id:"+GetQueryString("pid")+"图片："+productDetails.productImages[0]);
                //调用ready，保证回来的先后数据一致
                wx.ready(function () {
                    // showMenuItems();
                    share(productDetails.productName,productDetails.description,productDetails.shareUrl+"?random=" + new Date().getTime() + "&pid=" + GetQueryString("pid"), productDetails.productImages[0]);
                });
                //  原来价格
                if (productDetails.originalPrice != null) {
                    var originalPrice =productDetails.originalPrice;
                    // $(".seckilldetails-details-text p.p1 .s2").html("<s>&yen;" + originalPrice + "</s>");
                    $(".seckilldetails-miaosha-txt-count-yuanjia").html("&yen;" + originalPrice);
                }
                //累计销量
                $(".sales").html("累计销量：" + productDetails.sales + dayu.lang.pieces);
                $(".seckilldetails-newGroup-title span").html("已有"+productDetails.sales +"人参加");
                //几人评价
               // $(".com-num").html(productDetails.comments + "人评价");
                //评价晒单 后面的人数
                $(".seckilldetails-comment-shai").html(dayu.lang.evaluation+"（" + productDetails.comments + "）");
                //分数 判断星星
                var score = productDetails.score;
                console.log(score);
                if(score==undefined){
                    $(".comment-score").html("0");
                }else{
                    $(".comment-score").html(score+"分");
                }

                // //console.log(score);
                if (score == undefined) {
                    for (var i = 0; i < 5; i++) {
                        var img = $("<img src='img/greestar@2x.png'/>");
                        $(".start-size").append(img);
                    }
                } else {
                    if (!/^\d+$/.test(score)) {
                        //console.log("不是整数");
                        var score1 = Math.floor(score);
                        //console.log(score1)
                        for (var i = 0; i < score1; i++) {
                            var img = $("<img src='img/star@2x.png'>");
                            $(".start-size").append(img);
                        }
                        var img2 = $("<img src='img/bange.png'>");
                        $(".start-size").append(img2);
                        for (var j = 0; j < 5 - score1 - 1; j++) {
                            var img = $("<img src='img/greestar@2x.png'>");
                            $(".start-size").append(img);
                        }
                    } else {
                        // //console.log("整数");
                        for (var i = 0; i < score; i++) {
                            var img = $("<img src='img/star@2x.png'>");
                            $(".start-size").append(img);
                        }
                        for (var j = 0; j < 5 - score; j++) {
                            var img = $("<img src='img/greestar@2x.png'>");
                            $(".start-size").append(img);
                        }
                    }
                }

                //点击全部评论跳转到s-comment.html；
                $(".all-comment").on("click", function () {
                    location.href = "s-comment.html?pid=" + pid + "&score=" + productDetails.score + "&comments=" + productDetails.comments + "&random=" + new Date().getTime();
                });


                //判断是否为单品  是的话跳转到我的订单页，不是的话弹出SQ  这里的type是为区别单买，还是组团价   单品跳转做处理了，非单品待做处理
                if (productDetails.isSingle == true) {
                    $("#seckilldetails-bottom-right-1").on("click", function () {
                        MtaH5.clickStat("031");
                        //alert(packClusterId);
                        sessionStorage.setItem("skuId", "");
                        sessionStorage.setItem('pid', GetQueryString("pid"));
                        // sessionStorage.setItem('type', 0);
                        sessionStorage.setItem('quantity', 1);
                        if(productDetails.activityType!=undefined&&productDetails.activityType!=null&&productDetails.activityType==6){
                            // alert(productDetails.activityType);
                            sessionStorage.setItem('orderType', productDetails.activityType);
                        }else{
                            sessionStorage.setItem('orderType', productDetails.leftOrderType);
                        }
                        if(packClusterId!=undefined){
                            location.href = "s-payment.html?quantity=1" + "&random=" + new Date().getTime() + "&activityType=" + activityType + "&specialId=" + specialId+"&orderType="+sessionStorage.getItem('orderType')+"&productId="+GetQueryString("pid")+"&packClusterId="+packClusterId+"&refereeCode="+refereeCode;
                        }else{
                            location.href = "s-payment.html?quantity=1" + "&random=" + new Date().getTime() + "&activityType=" + activityType + "&specialId=" + specialId+"&orderType="+sessionStorage.getItem('orderType')+"&productId="+GetQueryString("pid")+"&refereeCode="+refereeCode;
                        }
                        //console.log(pid);
                    });
                    $("#seckilldetails-bottom-right-2").on("click", function () {
                        MtaH5.clickStat("032");
                        //alert(packClusterId);
                        sessionStorage.setItem("skuId", "");
                        sessionStorage.setItem('pid', GetQueryString("pid"));
                        // sessionStorage.setItem('type', 1);
                        sessionStorage.setItem('quantity', 1);
                        sessionStorage.setItem('orderType', productDetails.rightOrderType);
                        if(packClusterId!=undefined){
                            location.href = "s-payment.html?quantity=1" + "&random=" + new Date().getTime() + "&activityType=" + activityType + "&specialId=" + specialId+"&orderType="+productDetails.rightOrderType+"&productId="+GetQueryString("pid")+"&packClusterId="+packClusterId+"&refereeCode="+refereeCode;
                        }else{
                            location.href = "s-payment.html?quantity=1" + "&random=" + new Date().getTime() + "&activityType=" + activityType + "&specialId=" + specialId+"&orderType="+productDetails.rightOrderType+"&productId="+GetQueryString("pid")+"&refereeCode="+refereeCode;
                        }
                    });
                   // 点击虚拟去参团   单品
                    $(".seckilldetails-newGroup-list-right-go").on("click",function(){
                        MtaH5.clickStat("029");
                        sessionStorage.setItem("skuId", "");
                        sessionStorage.setItem('pid', GetQueryString("pid"));
                        // sessionStorage.setItem('type', 1);
                        sessionStorage.setItem('quantity', 1);
                        sessionStorage.setItem('orderType', productDetails.rightOrderType);
                        location.href = "s-payment.html?quantity=1" + "&random=" + new Date().getTime() + "&activityType=" + activityType + "&specialId=" + specialId+"&orderType="+productDetails.rightOrderType+"&productId="+GetQueryString("pid")+"&packClusterId="+$(this).attr("data-clusterId")+"&refereeCode="+refereeCode;
                    });
                } else {
                    $("#seckilldetails-bottom-right-1").on("click", function () {
                        MtaH5.clickStat("031");
                        show(".seckilldetails-all-model", ".seckilldetails-all-sizeNum");
                        $(".seckilldetails-all-sizeNum").css("bottom","0");
                        $("body").css("position", "fixed");
                        $("#img").attr("data-type", 0);
                        //默认单独购买价格 判断是否为秒杀，如果为秒杀，就要默认秒杀的单价
                        if (productDetails.activityType != null) {
                            $("#price").html(productDetails.sepPrice);
                            // $("#price").html(dy.util.formatMoney(productDetails.seckillSepPrice));
                            //console.log("0为秒杀单价");
                            //isSeckill 0为秒杀单价
                            sessionStorage.setItem('isSeckill', 0);
                            // $("#price").html(dy.util.formatMoney(productDetails.seckillSepPrice));
                            // sessionStorage.setItem('seckillSepPrice', dy.util.formatMoney(productDetails.seckillSepPrice));
                            //是秒杀活动，并且未开始2，SKU弹出后显示原价单买
                            var seckillState = productDetails.seckillState;
                            if(seckillState==2){
                                //设秒杀活动未开始的状态
                                sessionStorage.setItem('seckillState',seckillState);
                                $("#price").html(productDetails.sepPrice);
                            }
                            //console.log("活动放单价");
                            sessionStorage.setItem('sepPrice',productDetails.sepPrice);
                        } else {
                            $("#price").html(productDetails.sepPrice);
                            //1为正常单价
                            sessionStorage.setItem('isSeckill', 1);
                            // $("#price").html(dy.util.formatMoney(productDetails.sepPrice));
                            sessionStorage.setItem('sepPrice',productDetails.sepPrice);
                        }
                        // $("#img>img").attr("src",productDetails.productImages[0]);
                        // sessionStorage.setItem('productImages', productDetails.productImages[0]);
                        var type = $("#img").attr("data-type");
                        var productImages=sessionStorage.getItem('productImages');
                        $("#img>img").attr("src",productImages);
                        //console.log(type);
                        //礼包商品传6
                        if(productDetails.activityType!=undefined&&productDetails.activityType!=null&&productDetails.activityType==6){
                            sessionStorage.setItem('orderType', productDetails.activityType);
                        }else{
                            sessionStorage.setItem('orderType', productDetails.leftOrderType);
                        }
                        //如果productDetails.leftOrderType为1 sku框里的默认价钱为luckPrice
                        if(productDetails.leftOrderType==1){
                            $("#price").html(productDetails.groupPrice);
                        }
                    });
                    $("#seckilldetails-bottom-right-2").on("click", function () {
                        MtaH5.clickStat("032");
                        show(".seckilldetails-all-model", ".seckilldetails-all-sizeNum");
                        $(".seckilldetails-all-sizeNum").css("bottom","0");
                        $("body").css("position", "fixed");
                        $("#img").attr("data-type", 1);
                        //默认团购价格   判断是否为秒杀，如果为秒杀，就要默认秒杀的团购价
                        if (productDetails.activityType != null) {
                            if (productDetails.activityType == 3 || productDetails.activityType == 4) {
                                sessionStorage.setItem('luckPrice', productDetails.luckPrice);
                                sessionStorage.setItem('orderType', productDetails.rightOrderType);
                            } else {
                                //1.5日小贾更改接口字段，废除seckillSepPrice
                                $("#price").html(productDetails.groupPrice);
                                // $("#price").html(dy.util.formatMoney(productDetails.seckillGroupPrice));
                                //console.log("2为秒杀组团价");
                                //2为秒杀组团价
                                sessionStorage.setItem('isSeckill', 2);
                                // $("#price").html(dy.util.formatMoney(productDetails.seckillGroupPrice));
                                sessionStorage.setItem('seckillGroupPrice', productDetails.seckillGroupPrice);
                                //是秒杀活动，并且未开始2，SKU弹出后显示原价组团价
                                var seckillState = productDetails.seckillState;
                                if (seckillState == 2) {
                                    //设秒杀活动未开始的状态
                                    sessionStorage.setItem('seckillState', seckillState);
                                    $("#price").html(productDetails.groupPrice);
                                }
                                sessionStorage.setItem('groupPrice', productDetails.groupPrice);
                            }
                        } else {
                            $("#price").html(productDetails.groupPrice);
                            //3为正常团购价
                            sessionStorage.setItem('isSeckill', 3);
                            // $("#price").html(dy.util.formatMoney(productDetails.groupPrice));
                            sessionStorage.setItem('groupPrice',productDetails.groupPrice);
                        }

                        // sessionStorage.setItem('groupPrice',groupPrice);
                        // $("#img>img").attr("src",productDetails.productImages[0]);
                        // sessionStorage.setItem('productImages', productDetails.productImages[0]);
                        var productImages=sessionStorage.getItem('productImages');
                        $("#img>img").attr("src",productImages);
                        var type = $("#img").attr("data-type");
                        // //console.log(type);
                        sessionStorage.setItem('orderType', productDetails.rightOrderType);
                        //如果productDetails.rightOrderType为3或者4 sku框里的默认价钱为luckPrice
                        if(productDetails.rightOrderType==3||productDetails.rightOrderType==4){
                            $("#price").html(productDetails.luckPrice);
                        }
                    });
                    // 点击虚拟去参团   sku
                    $(".seckilldetails-newGroup-list-right-go").on("click",function(){
                        MtaH5.clickStat("029");
                        show(".seckilldetails-all-model", ".seckilldetails-all-sizeNum");
                        $(".seckilldetails-all-sizeNum").css("bottom","0");
                        $("body").css("position", "fixed");
                        $("#img").attr("data-type", 1);
                        //默认团购价格   判断是否为秒杀，如果为秒杀，就要默认秒杀的团购价
                        if (productDetails.activityType != null) {
                            if (productDetails.activityType == 3 || productDetails.activityType == 4) {
                                sessionStorage.setItem('luckPrice', productDetails.luckPrice);
                                sessionStorage.setItem('orderType', productDetails.rightOrderType);
                            } else {
                                $("#price").html(productDetails.groupPrice);
                                //2为秒杀组团价
                                sessionStorage.setItem('isSeckill', 2);
                                sessionStorage.setItem('seckillGroupPrice', productDetails.seckillGroupPrice);
                                //是秒杀活动，并且未开始2，SKU弹出后显示原价组团价
                                var seckillState = productDetails.seckillState;
                                if (seckillState == 2) {
                                    //设秒杀活动未开始的状态
                                    sessionStorage.setItem('seckillState', seckillState);
                                    $("#price").html(productDetails.groupPrice);
                                }
                                sessionStorage.setItem('groupPrice', productDetails.groupPrice);
                            }
                        } else {
                            $("#price").html(productDetails.groupPrice);
                            //3为正常团购价
                            sessionStorage.setItem('isSeckill', 3);
                            sessionStorage.setItem('groupPrice',productDetails.groupPrice);
                        }
                        var productImages=sessionStorage.getItem('productImages');
                        $("#img>img").attr("src",productImages);
                        var type = $("#img").attr("data-type");
                        sessionStorage.setItem('orderType', productDetails.rightOrderType);
                        //如果productDetails.rightOrderType为3或者4 sku框里的默认价钱为luckPrice
                        if(productDetails.rightOrderType==3||productDetails.rightOrderType==4){
                            $("#price").html(productDetails.luckPrice);
                        }
                        //存团ID,下面用
                        sessionStorage.setItem('packClusterId', $(this).attr("data-clusterId"));
                    });
                }

                //console.log("活动:"+productDetails.activityType);
                //console.log("专场ID:"+productDetails.specialId);
                //console.log(specialId);
                if(specialId==undefined){
                    specialId=productDetails.specialId;

                    sessionStorage.setItem('specialId', productDetails.specialId);
                }
                if(activityType==undefined){
                    activityType=productDetails.activityType;
                    sessionStorage.setItem('activityType', productDetails.activityType);

                }


                /***********商品店铺信息***************************/
                var productShopInfo = result.data.productShopInfo;
                // //console.log(productShopInfo);
                //店铺头像  名字
                if(productShopInfo.iconUrl!=undefined&&productShopInfo.iconUrl!=""&&productShopInfo.iconUrl!=null){
                    $(".shop-img img").attr("src", productShopInfo.iconUrl);
                }else{
                    $(".shop-img img").attr("src", "img/s-shopIcon.png");
                }
                $(".shop-name").html(productShopInfo.shopName);
                ////console.log(productShopInfo.shopName);
                // 进店逛逛  跳转页面到店铺详情页  s-shop.html
                var shopId = productShopInfo.shopId;
                var imshopId=productShopInfo.imShopId;
                $("#shops").on("click", function () {
                    MtaH5.clickStat("030");
                    location.href = "s-shop.html?shopId=" + shopId + "&random=" + new Date().getTime();
                });
                //点击店铺头像跳转到店铺详情页
                $(".shop-img img").on("click", function () {
                    location.href = "s-shop.html?shopId=" + shopId + "&random=" + new Date().getTime();
                });
                //点击店铺名字跳转到店铺详情页
                $(".shop-name").on("click", function () {
                    location.href = "s-shop.html?shopId=" + shopId + "&random=" + new Date().getTime();
                });
                //点击底部店铺去往店铺页
                $("#seckilldetails-bottom-left-11").on("click", function () {
                    location.href = "s-shop.html?shopId=" + shopId + "&shopName=" + productShopInfo.shopName + "&random=" + new Date().getTime();
                });
                //点击客服去communication.html页面
                // $("#seckilldetails-bottom-left-12").on("click", function () {
                //     // location.href="communication.html?shopId="+shopId+"&shopName="+productShopInfo.shopName+"&random="+new Date().getTime();
                //     // location.href = "communication.html?shopId=" + imshopId + "&shopName=" + productShopInfo.shopName + "&random=" + new Date().getTime();
                //    NTKF.im_openInPageChat('kf_10503_1542162454656');
                // });

                var shopStr = '';
                for (var i = 0; i < productShopInfo.recommend.length; i++) {
                    shopStr += '<dl class="shop-tuijian" data-pid="'+productShopInfo.recommend[i].productId+'">';
                    shopStr +='<dt><img src="'+productShopInfo.recommend[i].productImage+'" alt="" onerror="this.onerror=null; this.src=\'img/s-shoptuijian.png\'"/></dt>';
                    shopStr +='<dd class="pro-name">'+productShopInfo.recommend[i].productName+'</dd>';
                    shopStr +='<dd>';
                    shopStr +='<span>&yen;'+productShopInfo.recommend[i].price+'</span>';
                    shopStr +='<span>'+dayu.lang.sold+''+productShopInfo.recommend[i].sales+'</span>';
                    shopStr +='</dd>';
                    shopStr +='</dl>';
                }
                $(".shop-show").html(shopStr);
                jump($(".shop-tuijian"));

            /************** 地址选择 按理说要写在state==0 的时候, 要判断用户是否登录**************************/
                    //判断用户是否登录 isLogin   1为登录   0为未登录 //isLimit 1为不配送，0为配送
                var isLogin=productDetails.isLogin;
                var isLimit=productDetails.isLimit;
                //后台给得默认地址，没有地址就没有这个字段，isLimit也没有
                var shippingReceiver=productDetails.shippingReceiver;
                //用户已经登录
                if(isLogin==1){
                    var htmlChoseAdress=sessionStorage.getItem('htmlChoseAdress');
                    var regionCode=sessionStorage.getItem('regionCode');
                    //看session里有没有上次用户选的地址，没有的话看是不是有后台默认的地址，有的话就展示
                    if(htmlChoseAdress==null&&regionCode==regionCode){
                        //0为配送
                        if(productDetails.productStock==0){
                            $("#seckilldetails-bottom-right-1").hide();
                            $("#seckilldetails-bottom-right-2").hide();
                            $(".seckilldetails-bottom-right-3").show();
                        }else{
                            if(isLimit!=undefined&&isLimit!=0){
                                if(productDetails.stock==undefined||productDetails.stock>0) {
                                    $("#seckilldetails-bottom-right-1").hide();
                                    $("#seckilldetails-bottom-right-2").hide();
                                    $(".seckilldetails-bottom-right-3").show().html(dayu.lang.currentRegion);
                                }

                            }else{
                                if(productDetails.stock==undefined||productDetails.stock>0) {
                                    $("#seckilldetails-bottom-right-1").show();
                                    //礼包商品
                                    // if(shopAuth!=undefined&&shopAuth!=null){
                                        $("#seckilldetails-bottom-right-2").show();
                                   // }
                                    $(".seckilldetails-bottom-right-3").hide();
                                }
                            }
                        }

                        if(shippingReceiver!=undefined&&shippingReceiver!=""){
                            $(".seckilldetails-product-address-span2").html(shippingReceiver);
                            //当有地址时点击出现选择框
                            var productId=GetQueryString("pid");
                            addressShow(productId);

                        }else{
                            selfChoseAdressvilideta();
                        }
                    }else{//用户选过地址
                        //   调用出现用户地址
                        var productId=GetQueryString("pid");
                        $(".seckilldetails-product-address-span2").html(htmlChoseAdress);
                        addressShow(productId);
                        vaildateReceiver(regionCode,productId);
                    }



                }else{//用户未登录状态
                    selfChoseAdressvilideta();
                }
                //  //    商品库存
                // alert("商品库存："+productDetails.productStock);
                if(productDetails.productStock==0){
                    $("#seckilldetails-bottom-right-1").hide();
                    $("#seckilldetails-bottom-right-2").hide();
                    $(".seckilldetails-bottom-right-3").show();
                }else{
                    if(productDetails.stock==0){
                        $("#seckilldetails-bottom-right-1").hide();
                        $("#seckilldetails-bottom-right-2").hide();
                        $(".seckilldetails-bottom-right-3").show();
                    }else{
                        $("#seckilldetails-bottom-right-1").show();
                        $("#seckilldetails-bottom-right-2").show();
                        $(".seckilldetails-bottom-right-3").hide();
                    }
                }
                //用户已登录没有地址或者未登录时要先定位然后选择地址区验证
                function selfChoseAdressvilideta(){
                    //先定位验证
                    //调用获取用户定位
                    var htmlChoseAdress=sessionStorage.getItem('htmlChoseAdress');
                    var regionCode=sessionStorage.getItem('regionCode');
                    console.log(htmlChoseAdress,regionCode);
                    if(htmlChoseAdress==null&&regionCode==null){
                        wx.ready(function(){
                            mapData();
                        });
                        //    点击显示地址区出现省市区联动
                        $(".seckilldetails-product-address").on("click",function(){
                            MtaH5.clickStat("028");
                            adressChose();
                        });
                    }else{
                        //    点击显示地址区出现省市区联动
                        $(".seckilldetails-product-address").on("click",function(){
                            MtaH5.clickStat("028");
                            adressChose();
                        });
                        $(".seckilldetails-product-address-span2").html(htmlChoseAdress);
                        var productId=GetQueryString("pid");
                        vaildateReceiver(regionCode,productId);
                    }
                }

                //点击页面地址出现用户有地址的弹框
                function addressShow(productId){
                    $(".seckilldetails-product-address").on("click",function(){
                        addressTankuangShow();
                    });
                    //调用弹框里的地址信息
                    getAddress(productId);
                    //点击关闭按钮
                    $(".seckilldetails-all-address-top-img").on("click",function(){
                        closeButton();
                    });
                    //点击模态框关闭
                    $(".seckilldetails-all-model").on("click",function(){
                        closeButton();
                    });
                    //点击选择其它地址弹出选择省市区地址框
                    $(".seckilldetails-all-address-bottom").on("click",function () {
                        //关闭用户地址框
                        closeButton();
                        // 打开选择地址框
                        adressChose();
                    });
                }
                //地址框里的数据
                function getAddress(productId){
                    $.ajax({
                        type: "post",
                        url: "/me/getaddress",
                        data:{productId:productId},
                        success:function(result){
                            console.log(result);
                            //配送地址
                            var receiverVws=result.data.receiverVws;
                            var html='';
                            for(var i=0;i<receiverVws.length;i++){
                                html+='<div class="seckilldetails-all-address-details-list" data-receiverId="'+receiverVws[i].receiverId+'">';
                                if(receiverVws[i].isDefault=="1"){
                                    html+='<img src="img/seckilldetailsxuanzhong.png" alt=""/>';
                                    html+='<span  class="seckilldetails-all-address-details-list-span active">'+receiverVws[i].allReceiver+'</span>';
                                }else{
                                    html+='<img src="img/seckilldetailsweixuanzhong.png" alt=""/>';
                                    html+='<span class="seckilldetails-all-address-details-list-span">'+receiverVws[i].allReceiver+'</span>';
                                }
                                html+='</div>';
                            }
                            $(".seckilldetails-all-address-details-peisong").html(html);
                            //   点击任意配送地址换图片和字体颜色，然后弹出框消失，画页面
                            $(".seckilldetails-all-address-details-peisong").on("click",".seckilldetails-all-address-details-list",function(){
                                //点击设置默认地址
                                var receiverId=$(this).attr("data-receiverId");
                                var that=$(this);
                                $.ajax({
                                    type: "post",
                                    url: "/me/defaultAddress",
                                    data:{type:2,receiverId:receiverId},
                                    dataType:'JSON',
                                    async: true,
                                    success: function (result) {
                                        console.log(result);
                                        if(result.state==0){
                                            //点击选中的字体变红，图片勾选
                                            that.find("span").addClass("active").prev("img").attr("src","img/seckilldetailsxuanzhong.png");
                                            var pageAddressText=that.find("span").html();
                                            $(".seckilldetails-product-address-span2").html(pageAddressText);
                                            //去掉非选中的字体和图片勾选
                                            that.siblings().find("span").removeClass("active").prev("img").attr("src","img/seckilldetailsweixuanzhong.png");
                                            //清除三联动的数据
                                            sessionStorage.removeItem("htmlChoseAdress");
                                            sessionStorage.removeItem("regionCode");
                                        }else{
                                            // alert(result.stateMsg);
                                            console.log(result.stateMsg);
                                        }
                                    }
                                });
                                //点击选中的字体变红，图片勾选
                                $(this).find("span").addClass("active").prev("img").attr("src","img/seckilldetailsxuanzhong.png");
                                var pageAddressText=$(this).find("span").html();
                                $(".seckilldetails-product-address-span2").html(pageAddressText);
                                //去掉非选中的字体和图片勾选
                                $(this).siblings().find("span").removeClass("active").prev("img").attr("src","img/seckilldetailsweixuanzhong.png");
                                //模态框和信息栏消失
                                closeButton();
                                //底部按钮变换
                                if(productDetails.productStock==0){
                                    $("#seckilldetails-bottom-right-1").hide();
                                    $("#seckilldetails-bottom-right-2").hide();
                                    $(".seckilldetails-bottom-right-3").show();
                                }else{
                                    if(productDetails.stock==undefined||productDetails.stock>0) {
                                        $("#seckilldetails-bottom-right-1").show();
                                        //判断礼包商品
                                      //  if(shopAuth==undefined&&shopAuth==null){
                                            $("#seckilldetails-bottom-right-2").show();
                                      // }
                                        $(".seckilldetails-bottom-right-3").hide();
                                    }
                                }

                                //验证是否商品已下架
                                isOnlineProduct();
                            });
                            //不配送地址
                            var limieReceiver=result.data.limieReceiver;
                            var str='';
                            for(var j=0;j<limieReceiver.length;j++){
                                str+='<div class="seckilldetails-all-address-details-list">';
                                str+='<img src="img/seckilldetailsweixuanzhong.png" alt="">';
                                str+='<span class="seckilldetails-all-address-details-bupeisong-span">'+limieReceiver[j].allReceiver+'</span>';
                                str+='</div>';
                            }
                            $(".seckilldetails-all-address-details-bupeisong").html(str);

                        },
                        error:function(e){
                            console.log(e)
                        }
                    });
                }
                //点击用户地址弹框的关闭按钮
                function closeButton(){
                    hide(".seckilldetails-all-model");
                    //消失后取消事件
                    $("body").height($(window).height()).css("overflow","auto");
                    $("body").css("position","");
                    $(".seckilldetails-all-address").css("bottom","-80rem");
                }
                //地址弹框显示
                function addressTankuangShow(){
                    show(".seckilldetails-all-model");
                    //模态框出现底部页面不能滑动
                    $("body").height($(window).height()).css("overflow","hidden");
                    $("body").css("position","fixed");
                    $(".seckilldetails-all-address").css("bottom","0rem");
                }
                //选择省市区地址框
                function adressChose(){
                    var iosSelect = new IosSelect(3,
                        [iosProvinces, iosCitys, iosCountys],
                        {
                            title: '地址选择',
                            itemHeight: 75,
                            relation: [1, 1, 0, 0],
                            callback: function (selectOneObj, selectTwoObj, selectThreeObj) {
                                $(".seckilldetails-product-address-span2").html(selectOneObj.value + ' ' + selectTwoObj.value + ' ' + selectThreeObj.value);
                                //取出一级城市的ID
                                $(".seckilldetails-product-address-span2").attr("data-id",selectOneObj.id);
                                //取出改变的地址保存供其他商品使用
                                var htmlChoseAdress=selectOneObj.value + ' ' + selectTwoObj.value + ' ' + selectThreeObj.value;
                                console.log(htmlChoseAdress);
                                sessionStorage.setItem('htmlChoseAdress', htmlChoseAdress);
                                //调用地址编码验证+取出CODE码存本地做其他验证
                                var regionCode=selectOneObj.id;
                                console.log(regionCode);
                                sessionStorage.setItem('regionCode', regionCode);
                                var productId=GetQueryString("pid");
                                vaildateReceiver(regionCode,productId);
                            }
                        });

                }
                //    使用高德地图获取位置
                function mapData(){
                    //获取微信地理位置接口
                    wx.getLocation({
                        type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
                        success: function (res) {
                            var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
                            var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
                            console.log("纬度"+latitude,"经度"+longitude);
                            //    调用高德的逆地理编码
                            $.ajax({
                                url: "http://restapi.amap.com/v3/geocode/regeo",
                                data: {key:"9bbed57af6d5338be8525d794edff8ca",location:longitude+","+latitude,extensions:"all"},
                                success:function(result){
                                    console.log(result);
                                    if(result.status=="1"){
                                        //城市编码
                                        var adcode=result.regeocode.addressComponent.adcode;
                                       // console.log(adcode);
                                        var productId=GetQueryString("pid");
                                        $(".seckilldetails-product-address-span2").html(result.regeocode.formatted_address);
                                        //调用检查地址函数判断该商品是否在改地区配送
                                        vaildateReceiver(adcode,productId)
                                    }
                                },
                                error:function(e){
                                    console.log(e)
                                }
                            })

                        },
                        fail:function(e){
                           console.log(e)
                        },
                        cancel:function(){
                            //用户取消定位默认定位到北京
                            var productId=GetQueryString("pid");
                            $(".seckilldetails-product-address-span2").html("北京市&nbsp;北京市");
                            //调用检查地址函数判断该商品是否在改地区配送
                            vaildateReceiver("110000",productId)
                        }
                    });


                }
                //    请求接口 传定位的code码
                function vaildateReceiver(regionCode,productId){
                    $.ajax({
                        type: "post",
                        url: "/me/vaildate-receiver",
                        data: {regionCode:regionCode,productId:productId},
                        success:function(result){
                            console.log(result);
                            if(result.state==61003){
                                if(productDetails.productStock==0){
                                        $("#seckilldetails-bottom-right-1").hide();
                                        $("#seckilldetails-bottom-right-2").hide();
                                        $(".seckilldetails-bottom-right-3").show();
                                }else{
                                    if(productDetails.stock==undefined||productDetails.stock>0) {
                                        // console.log("验证结果：当前地区无货");
                                        $("#seckilldetails-bottom-right-1").hide();
                                        $("#seckilldetails-bottom-right-2").hide();
                                        $(".seckilldetails-bottom-right-3").show().html(result.stateMsg);
                                    }
                                }

                            }else if(result.state==0){
                                if(productDetails.productStock==0){
                                    $("#seckilldetails-bottom-right-1").hide();
                                    $("#seckilldetails-bottom-right-2").hide();
                                    $(".seckilldetails-bottom-right-3").show();
                                }else{
                                    if(productDetails.stock==undefined||productDetails.stock>0){
                                        $("#seckilldetails-bottom-right-1").show();
                                        //判断礼包商品
                                        //if(shopAuth==undefined&&shopAuth==null){
                                            $("#seckilldetails-bottom-right-2").show();
                                        //}
                                        $(".seckilldetails-bottom-right-3").hide();
                                    }
                                }
                            }
                            //验证该商品是否下架
                            isOnlineProduct();
                        },
                        error:function(e){
                            console.log(e)
                        }
                    })
                }
                //表示下架未下架的商品 0为正常销售   2为已下架
                function isOnlineProduct(){
                    var onlineType =productDetails.onlineType;
                    //console.log(onlineType );
                    if(onlineType ==2){
                        $("#seckilldetails-bottom-right-1").hide();
                        $("#seckilldetails-bottom-right-2").hide();
                        $(".seckilldetails-bottom-right-3").show().html(dayu.lang.beenRemoved);
                    }
                }
                isOnlineProduct();
            }else{
               // alert(result.stateMsg);
                console.log(result.stateMsg);
            }
        },
        error:function(e){
            //alert(e);
        }
    });

    //收藏
    $("#seckilldetails-bottom-left-13").on("click",function () {
        if($("#seckilldetails-bottom-left-13 dt img").attr("src")=="img/sc@2x.png"){
            $.ajax({
                type: "post",
                url: "/me/collect",
                data: {productId: pid,platform:"DY",type:1},
                async: true,
                success: function(result){
                    // console.log(result);
                    // console.log(result.token);
                    // console.log(dyyp.DOMAIN+"/myself.html?random="+new Date().getTime()+"&jump=1");
                    if(result.token==""||result.token==undefined||result.token==null){
                        var jumpUrl=window.location.href;
                        sessionStorage.setItem('jumpUrl', jumpUrl);
                        location.href=dyyp.DOMAIN+"/myself.html?random="+new Date().getTime()+"&jump=1";
                    }else{
                        if(result.state==0){
                            //做判断
                            $("#seckilldetails-bottom-left-13 dt img").attr("src","img/shoucang@2x.png");
                            $("#seckilldetails-bottom-left-13 dd").html(dayu.lang.bookmarked).css("color","#fd6363");
                        }else{
                            // alert(result.stateMsg)
                        }
                    }
                },
                error:function (e) {
                    //console.log(e);
                }
            })
        }else if($("#seckilldetails-bottom-left-13 dt img").attr("src")=="img/shoucang@2x.png"){
            $.ajax({
                type: "post",
                url: "/me/collect",
                data: {productId: pid,platform:"DY",type:0},
                async: true,
                success: function(result){
                    console.log(result);
                    if(result.state==0){
                        //做判断
                        $("#seckilldetails-bottom-left-13 dt img").attr("src","img/sc@2x.png");
                        $("#seckilldetails-bottom-left-13 dd").html(dayu.lang.favorite).css("color","#444444");
                    }else{
                        //console.log(result.stateMsg);
                    }
                },
                error:function (e) {
                    //console.log(e);
                }
            })
        }else{}

    });
    /*******************商品参数列表*********************************/
    $.ajax({
        type: "get",
        url: dyyp.API_SHOP_URL+"/product-getProductParameter",
        data: {productId: pid},
        async: true,
        success: function (result) {
            //console.log(result);
            if(result.state==0){
                var parameterList=result.data.parameterList;
               // //console.log(parameterList);
                var html='';
                for(var i=0;i<parameterList.length;i++){
                    if(parameterList[i].parameterName!=undefined&&parameterList[i].parameterValue!=undefined){
                        html+='<div>';
                        html+='<p>'+parameterList[i].parameterName+'</p>';
                        html+='<p>'+parameterList[i].parameterValue+'</p>';
                        html+='</div>';
                    }
                }
                $(".seckilldetails-parameter").html(html);
            }else{
                //console.log(result.stateMsg);
            }
        },
        error:function (e) {
            //console.log(e);
        }
    });

// /*******************选取商品规格参数代码*********************************/
    //activityType  为1 是秒杀   2为新品推荐    specialId专场ID
    //console.log(activityType,specialId);
    //页面加载后清一下原有的限购字段
    sessionStorage.removeItem("limitQuantity");

    $.ajax({
        type: "post",
        url: "/me/product-getProductSpecification",
        data: {productId: pid,activityType:activityType,specialId:specialId},
        async: true,
        success:function(data) {
            console.log("sku框",data);
            var data=data.data.productSpecificationObject;
            //console.log(data);
            // //console.log(data);

            var dataproduct={};
            for(i=0;i<data.length;i++){
                var sizename=data[i].productSpecificationName;
                dataproduct[sizename]={};
                var sizecon=data[i].productSpecificationValueObjects;
                if(sizecon!=undefined){
                    for(z=0;z<sizecon.length;z++){
                        var sizeconname=sizecon[z].productSpecificationValueName;
                        if(data.length>1){
                            var sizeconnamecolor=sizecon[z].specificationLastValueList;
                            dataproduct[sizename][sizeconname]={};

                            for(h=0;h<sizeconnamecolor.length;h++){
                                var sizeconnamecolorname=sizeconnamecolor[h].lastValueName;
                                dataproduct[sizename][sizeconname][sizeconnamecolorname]=sizeconnamecolor[h].commonAttrs[0]
                            }
                        }
                        else{
                            var sizeconnamecolor=sizecon[z].commonAttrs;
                                dataproduct[sizename][sizeconname]={};
                                //console.log(sizeconnamecolor);
                                    for(h=0;h<sizeconnamecolor.length;h++){
                                        //                                  var sizeconnamecolorname=sizeconnamecolor[h].lastValueName
                                        dataproduct[sizename][sizeconname]=sizeconnamecolor[h]
                                    }
                        }

                    }
                }
            }
            // //console.log(dataproduct);
            var objectname=Object.keys(dataproduct);
            // //console.log(objectname);
            var htmlsize="";
            var htmlcolor="";
            //展示图片的部分
            //isSeckill 0为秒杀单价 //1为正常单价 //2为秒杀组团价 //3为正常团购价
            var isSeckill=sessionStorage.getItem('isSeckill');
            var imgSrc=sessionStorage.getItem('productImages');
            // var seckillState=sessionStorage.getItem('seckillState');
            //console.log("轮播的第一张图片初始化"+imgSrc);
            // //console.log(seckillState);
            var price;
            if(isSeckill==0){
                price=sessionStorage.getItem('seckillSepPrice');
            }else if(isSeckill==1){
               price=sessionStorage.getItem('sepPrice');
            }else if(isSeckill==2){
                price=sessionStorage.getItem('seckillGroupPrice');
            }else{
                price=sessionStorage.getItem('groupPrice');
            }

            var html='<div class="parent">';
            html+='<div id="img" class="img"><img src="'+imgSrc+'" alt="" onerror="this.onerror=null; this.src=\'img/s-sku.png\'"/></div>';
            html+='<div class="sizeshow-container">';
            html+='<div class="sizeshow">';
            html+='<p class="price"><span>&yen;</span><span id="price">'+price+'</span></p>';
            html+='</div>';
            html+='</div>';
            html+='</div>';

            $(".seckilldetails-all-sizeNum").append(html);
            if(objectname.length>0){
                var htmlshow="<div id='shuxingshow'>";
                for(i=0;i<objectname.length;i++){

                    htmlshow+='<span class="obname"></span><span> :'+dayu.lang.pleasepSelec+'</span>';

                }
            //<span>库存：</span><span class="kucun"></span> sku里的库存显示，如需要，放回下面的htmlshow中
                htmlshow+='</div>';


                $(".sizeshow-container").append(htmlshow);
                for(z=0;z<objectname.length;z++){
                    $("#shuxingshow span:eq("+2*z+")").html(objectname[z])
                }
            }
            var objecthtmlse="<div id='shuxingshowparent'>";
            for(h=0;h<objectname.length;h++){
                objecthtmlse+='<div><p class="guigename"></p>';


                // //console.log(dataproduct[objectname[h]]);
                var guigecount=Object.keys(dataproduct[objectname[h]]);
                objecthtmlse+='<p class="guigeval">';
                // //console.log(guigecount);
                for(a=0;a<guigecount.length;a++){
                    objecthtmlse+='<button class="clickguige"></button>'
                }
                objecthtmlse+='</p></div>';
            }
            objecthtmlse+='</div>';
            $(".seckilldetails-all-sizeNum").append(objecthtmlse);
            for(h=0;h<objectname.length;h++){
                $("#shuxingshowparent>div:eq("+h+")>p.guigename").html(objectname[h]);
                var guigecount=Object.keys(dataproduct[objectname[h]]);
                for(z=0;z<guigecount.length;z++){
                    $("#shuxingshowparent>div:eq("+h+")>p.guigeval>button:eq("+z+")").html(guigecount[z])
                }
            }
            // var htmltijiao="<div><button class='tijiao'>确定</button></div>";
            var htmltijiao='<div class="fo-d">';
            htmltijiao+='<p class="lf">'+dayu.lang.quantity+'</p>';
            htmltijiao+='<div class="rt">';
            htmltijiao+='<button id="minus">&minus;</button>';
            htmltijiao+='<button id="counts" type="text">1</button>';
            htmltijiao+='<button id="plus">&plus;</button>';
            htmltijiao+='</div>';
            htmltijiao+='</div>';
            htmltijiao+='<div class="d-bottom sizes">';
            htmltijiao+='<button class="d-bottom-wancheng">'+dayu.lang.complete+'</button>';
            htmltijiao+='</div>';
            $(".seckilldetails-all-sizeNum").append(htmltijiao);
            //找出所有组合为零的情况  并且找出所有初始化可以点击的属性
            var arr=[];
            var arrpro=[];
            var objectnamesss=Object.keys(dataproduct);
            //console.log(objectnamesss);
            for(i=0,l=objectnamesss.length;i<l;i++){
                if(objectnamesss.length>1){
                    arrpro=[];
                    var objiettp=Object.keys(dataproduct[objectnamesss[i]]);
                    //console.log(objiettp);
                    for(z=0,zl=objiettp.length;z<zl;z++  ){
                        var objecttypess=Object.keys(dataproduct[objectnamesss[i]][objiettp[z]]);
                        for(h=0,zll=objecttypess.length;h<zll;h++){
                            if(dataproduct[objectnamesss[i]][objiettp[z]][objecttypess[h]]["stock"]!=0){
                                arrpro.push(objiettp[z]);
                                arrpro.push(objecttypess[h]);
                                arr.push(arrpro)
                            }
                        }

                    }
                }
                else{
                    var objiettp=Object.keys(dataproduct[objectnamesss[i]]);
                    for(z=0,zl=objiettp.length;z<zl;z++  ){
                        if(dataproduct[objectnamesss[i]][objiettp[z]]["stock"]!=0){
                            arrpro.push(objiettp[z])
                            arr.push(arrpro)
                        }
                    }
                }
            }
            var arrproname=[];
            //console.log(arr);
            for(i=0;i<arr.length;i++){
                for(z=0;z<arr[i].length;z++){
                    if(arrproname.indexOf(arr[i][z])<0){
                        arrproname.push(arr[i][z])
                    }
                }
            }
            //console.log(arrproname);
          // 给所有初始渲染的页面添加当库存为0时不可点击事件
            var domlength= $("#shuxingshowparent button");
            //console.log(domlength);
            for(z=0;z<domlength.length;z++){
                if(arrproname.indexOf(domlength[z].innerHTML)>=0 ){}
                else{
                    domlength[z].disabled="disabled";
                    domlength[z].className="acti"
                }
            }
            //console.log(domlength);
            var domcount=$("#shuxingshowparent>div");
//                    //console.log(domcount[0].p.clickguige)
            for(i=0;i<domcount.length;i++){
                $("#shuxingshowparent>div:eq("+i+")>p.guigeval>button").click(function() {
                    if ($(this).hasClass("select")) {
                        //移除选中
                        $(this).removeClass("select");
                        var dompte = $(this).parent().parent().index();
                        //console.log(dompte);
                        $("#shuxingshow>span:eq("+(2*dompte+1)+")").html(" :"+dayu.lang.pleasepSelec);
                        $("span.kucun").html("");
                        //判断是组团还是单买，渲染不同的价格   选中--取消时的价格
                        var type=$("#img").attr("data-type");
                        //console.log(type);
                        if(type==0){
                            $("#price").html(sessionStorage.getItem("sepPrice"));
                        }else{
                            $("#price").html(sessionStorage.getItem("groupPrice"));
                        }
                        var isSeckill=sessionStorage.getItem('isSeckill');
                        var seckillState=sessionStorage.getItem('seckillState');
                        if(isSeckill==0){
                            $("#price").html(sessionStorage.getItem('sepPrice'));
                           // $("#price").html(sessionStorage.getItem('seckillSepPrice'));
                            if(seckillState==2){
                                //console.log("正常单价");
                                $("#price").html(sessionStorage.getItem('sepPrice'));
                            }
                        }else if(isSeckill==2){
                            // $("#price").html(sessionStorage.getItem('seckillGroupPrice'));
                            $("#price").html(sessionStorage.getItem('groupPrice'));
                            if(seckillState==2){
                                //console.log("正常组团价");
                                $("#price").html(sessionStorage.getItem('groupPrice'));
                            }
                        }
                        //如果是拼手气或者合伙买，取消选中时渲染luckPrice价钱
                        if(sessionStorage.getItem('orderType')==3||sessionStorage.getItem('orderType')==4){
                            $("#price").html(sessionStorage.getItem('luckPrice'));
                        }
                        var productImages=sessionStorage.getItem('productImages');
                        //console.log("轮播图的第一张"+productImages);
                        $("#img>img").attr("src",productImages);
                        for (z = 0; z < domcount.length; z++) {
                            if (z != dompte) {
                                //把点击自己本身时另一种属性选择下的所有属性取消不可点击改成只有库存不为零时取消不可点击
                                var index=$("#shuxingshowparent>div:eq("+z+")>p.guigeval>button")
//                              //console.log(index[z].)
                                //console.log(dompte)
                                for(h=0;h<index.length;h++){
                                    if( arrproname.indexOf(index[h].textContent)<0 ){
                                        $("#shuxingshowparent>div:eq("+z+")>p.guigeval>button:eq("+h+")").attr("disabled", "disabled").addClass("wu")
                                    }
                                    else{
                                        $("#shuxingshowparent>div:eq("+z+")>p.guigeval>button:eq("+h+")").removeAttr("disabled").removeClass("wu")
                                    }
                                }

                            }
                        }
                        // //console.log($(this).parent().parent().siblings());
                    } else{
                        //console.log($(this).parent().children());
                        $(this).parent().children().removeClass("select");
                        $(this).addClass("select");
                        //增加一个数组保存库存不为0的属性
                        var havevalname=[] ;
                        //将havevalname改为havevalnam
                        var havevalnam = Object.keys(dataproduct[$(this).parent().prev().html()][$(this).html()]);
                        //console.log(dataproduct[$(this).parent().prev().html()][$(this).html()]);
                        //加一个for循环把所有库存不为零的找出来
                        for(i=0;i<havevalnam.length;i++){
                            if(dataproduct[$(this).parent().prev().html()][$(this).html()][havevalnam[i]]["stock"]>0){  //
                                havevalname.push(havevalnam[i])  //
                            }   //
                        }
                        //console.log(havevalnam);

                        var domptev = $(this).parent().parent().index();
                        //console.log(domptev);
                        $("#shuxingshow>span:eq("+(2*domptev+1)+")").html(" :"+$(this).html());
                        if($("#shuxingshowparent button.select").length==$("#shuxingshowparent>div").length){
                            if($("#shuxingshowparent>div").length>1){
                                var domselect= $("#shuxingshowparent button.select");
                                for(i=0;i<domselect.length;i++){
                                    if(domselect[i]["textContent"]!=$(this).html()){
                                        var name=domselect[i]["textContent"]
                                    }
                                }
//                                    //console.log(dataproduct[$(this).parent().prev().html()][$(this).html()][name]["st"])
                                $("span.kucun").html(dataproduct[$(this).parent().prev().html()][$(this).html()][name]["stock"]);
                                //判断是组团还是单买价格，单买是0，组团是1
                                var type=$("#img").attr("data-type");
                                //console.log(type);
                                if(type==0){
                                    $("#price").html(dataproduct[$(this).parent().prev().html()][$(this).html()][name]["price"]);
                                }else{
                                    $("#price").html(dataproduct[$(this).parent().prev().html()][$(this).html()][name]["clusterPrice"]);
                                }

                                if(dataproduct[$(this).parent().prev().html()][$(this).html()][name]["image"]!=undefined){
                                    $("#img>img").attr("src",dataproduct[$(this).parent().prev().html()][$(this).html()][name]["image"])
                                }
                                skuid=dataproduct[$(this).parent().prev().html()][$(this).html()][name]["skuId"];
                                stock=dataproduct[$(this).parent().prev().html()][$(this).html()][name]["stock"];
                                //console.log("两种属性时的库存："+stock);
                            }
                            else{
                                $("span.kucun").html(dataproduct[$("p.guigename").html()][$(this).html()]["stock"]);
                                //判断是组团还是单买，渲染不同的价格
                                var type=$("#img").attr("data-type");
                                //console.log(type);
                                if(type==0){
                                    $("#price").html(dataproduct[$("p.guigename").html()][$(this).html()]["price"]);
                                }else{
                                    $("#price").html(dataproduct[$("p.guigename").html()][$(this).html()]["clusterPrice"]);
                                }

                                if(dataproduct[$("p.guigename").html()][$(this).html()]["image"]!=undefined){
                                    $("#img>img").attr("src",dataproduct[$("p.guigename").html()][$(this).html()]["image"])
                                }
                                skuid=dataproduct[$("p.guigename").html()][$(this).html()]["skuId"];
                                stock=dataproduct[$("p.guigename").html()][$(this).html()]["stock"];
                                //console.log("一种属性时的库存:"+stock);
                            }
                        }
                        for (z = 0; z < domcount.length; z++) {
                            if (z != domptev) {
                                var btncount = $("#shuxingshowparent>div:eq(" + z + ")>p.guigeval>button")
                                $("#shuxingshowparent>div:eq(" + z + ")>p.guigeval>button").removeClass("wu")
                                //把点击其他属性是另一种属性选择下的所有属性取消不可点击改成只有库存不为零时取消不可点击
                                var index=$("#shuxingshowparent>div:eq("+z+")>p.guigeval>button")
                                // //console.log(dompte)
                                for(h=0;h<index.length;h++){
                                    if( arrproname.indexOf(index[h].textContent)<0 ){
                                        $("#shuxingshowparent>div:eq("+z+")>p.guigeval>button:eq("+h+")").attr("disabled", "disabled").addClass("wu")
                                    }
                                    else{
                                        $("#shuxingshowparent>div:eq("+z+")>p.guigeval>button:eq("+h+")").removeAttr("disabled").removeClass("wu")
                                    }
                                }
                                for (h = 0; h < btncount.length; h++) {
                                    if (havevalname.indexOf($("#shuxingshowparent>div:eq(" + z + ")>p.guigeval>button:eq(" + h + ")").html()) >= 0) {

                                    }
                                    else {    //修改
                                        if(arrproname.indexOf($("#shuxingshowparent>div:eq(" + z + ")>p.guigeval>button:eq(" + h + ")").html())<0 ){}
                                        else{
                                            $("#shuxingshowparent>div:eq(" + z + ")>p.guigeval>button:eq(" + h + ")").addClass("wu")
                                            $("#shuxingshowparent>div:eq(" + z + ")>p.guigeval>button:eq(" + h + ")").attr("disabled", "disabled")
                                        }

                                    }
                                }
                            }

                        }
                    }
                })
            }
            //加减数量的操作
            $("#plus").on("click",function () {
                //如过是合伙买或者拼手气只能买一件
                var orderType=sessionStorage.getItem('orderType');
                //console.log(orderType);
                if(orderType==3||orderType==4){
                    task(dayu.lang.onePiece);
                    parseInt($(this).prev().html(1));
                }else{
                    var countS= parseInt($(this).prev().html());
                    //限购未做判断，待整理
                    var limitQuantity=sessionStorage.getItem("limitQuantity");
                    countS=++countS;
                    //console.log(countS,stock);
                    $(this).prev().html(countS);
                    sessionStorage.setItem('quantity', countS);
                    if(countS>=stock){
                        task(dayu.lang.exceedsTheStock);
                        $(this).prev().html(stock);
                        sessionStorage.setItem('quantity', stock);
                    }
                    //限购未做判断，待整理
                    //取出活动状态值，如果为2，未开始，不进行限量
                    var seckillState=sessionStorage.getItem('seckillState');
                    if(seckillState!=2){
                        if(limitQuantity!=null&&limitQuantity!=undefined){
                            limitQuantity=sessionStorage.getItem("limitQuantity");
                            //console.log("限购的数量"+limitQuantity);
                            if(countS>limitQuantity){
                                task(dayu.lang.reachedTheUpper);
                                $(this).prev().html(limitQuantity);
                                sessionStorage.setItem('quantity', limitQuantity);
                            }
                            if(limitQuantity>stock){
                                $(this).prev().html()>=stock;
                            }
                        }
                    }
                }
            });
            // //console.log($("#minus"));
            $("#minus").on("click",function () {
                var countS= parseInt($(this).next().html());
                sessionStorage.setItem('quantity', countS);
                if(countS>1){
                    countS=--countS;
                    $(this).next().html(countS);
                    sessionStorage.setItem('quantity', countS);
                }
            });
            //提示信息函数
            function task(txt){
                $(".refund-prompt").show().html(txt).css("z-index","12").css("top","90%");
                var timer=setTimeout(function(){$(".refund-prompt").hide()},2000);
            }
            if(packClusterId!=undefined){
                $(".d-bottom-wancheng").html(dayu.lang.partGrouping);
            }

            $(".d-bottom-wancheng").click(function(){
               // alert(packClusterId);
                if($("#shuxingshowparent button.select").length==$("#shuxingshowparent>div").length){

                    //单买还是组团0单买 1组团
                    var type=$("#img").attr("data-type");
                    //console.log(type);
                    sessionStorage.setItem('pid',GetQueryString("pid"));
                    sessionStorage.setItem('skuId',skuid);
                    // sessionStorage.setItem('type',type);
                    //团详情页传来的packClusterId和详情页去参团的packClusterId
                    packClusterId=sessionStorage.getItem("packClusterId");
                    // alert(packClusterId);
                    var val=$("#counts").html();
                    if(val<=0) {
                        task(dayu.lang.quantityCannot);
                    }else if(val>stock){
                        task(dayu.lang.quantityExceeds);
                    }else if(stock<10){
                        task(dayu.lang.remainingNumber+stock);
                        if(packClusterId!=undefined&&packClusterId!=null){
                            // alert("小于10",packClusterId)
                            location.href="s-payment.html?quantity="+val+"&random="+new Date().getTime()+"&activityType="+activityType+"&specialId="+specialId+"&skuId="+sessionStorage.getItem('skuId')+"&orderType="+sessionStorage.getItem('orderType')+"&productId="+sessionStorage.getItem('pid')+"&packClusterId="+packClusterId+"&refereeCode="+refereeCode;
                        }else{
                            location.href="s-payment.html?quantity="+val+"&random="+new Date().getTime()+"&activityType="+activityType+"&specialId="+specialId+"&skuId="+sessionStorage.getItem('skuId')+"&orderType="+sessionStorage.getItem('orderType')+"&productId="+sessionStorage.getItem('pid')+"&refereeCode="+refereeCode;
                        }
                    } else{
                        // alert(packClusterId);
                        if(packClusterId!=undefined&&packClusterId!=null){
                            // alert(packClusterId)
                            location.href="s-payment.html?quantity="+val+"&random="+new Date().getTime()+"&activityType="+activityType+"&specialId="+specialId+"&skuId="+sessionStorage.getItem('skuId')+"&orderType="+sessionStorage.getItem('orderType')+"&productId="+sessionStorage.getItem('pid')+"&packClusterId="+packClusterId+"&refereeCode="+refereeCode;
                        }else{
                            location.href="s-payment.html?quantity="+val+"&random="+new Date().getTime()+"&activityType="+activityType+"&specialId="+specialId+"&skuId="+sessionStorage.getItem('skuId')+"&orderType="+sessionStorage.getItem('orderType')+"&productId="+sessionStorage.getItem('pid')+"&refereeCode="+refereeCode;
                        }
                    }
                }
                else{
                    task(dayu.lang.pleaseSelectItem);
                }
            })
        }
    });
//   获得商品详情页参团用户
    $.ajax({
        url:"/me/getClusterUserInfo",
        type:"POST",
        async:false,
        data:{productId:pid},
        success:function(result){
            console.log("获得商品详情页参团用户",result);
            if(result.state==0){
                var items=result.data;
                if(items.length>0){
                    var html=``;
                    for(var i=0;i<items.length;i++){
                        html+=`<div class="swiper-slide">
									<img src="${items[i].icon}" alt="">
									<span>${items[i].nickname}参团成功</span>
								</div>`
                    }
                    $(".product-top-gundong .swiper-wrapper").html(html);
                    var swiper2 = new Swiper('.product-top-gundong .swiper-container', {
                        direction: 'vertical',
                        autoplay:1700,
                        loop:true,
                        simulateTouch : false,
                        onlyExternal : true,
                    });
                }else{
                    $(".product-top-gundong").hide();
                }
            }else{
                console.log(result.stateMsg)
            }
        },
        error:function(e){
            console.log(e);
        }
    });
    //判断有没有CODE,判断页面是否有推荐人，有就展示
    addRefereeCode();



});
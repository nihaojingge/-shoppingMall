(function () {
    window.dayu = window.dayu || {};
    window.dayu.api = window.dayu.api || {};

    // dayu.api.reqRecommendProduct = function (page,callback,complete,falid) {
    //     $.ajax({
    //         type: "get",
    //         url: dyyp.API_MOBILE_URL+"/recommend-product?pageId="+page,
    //         async: true,
    //         dataType: "jsonp",
    //         success: function(data) {
    //             callback(data);
    //         },
    //         complete: function(data) {
    //             complete();
    //         },
    //         error:function (data) {
    //             falid()
    //         }
    //     });
    // }
    //全网首页大鱼快报
    dayu.api.homeRecommend = function (page,callback,falid) {
        $.ajax({
            type: "get",
            url: dyyp.API_COMMUNITY_URL+"/home-recommend?pageId="+page,
            async: true,
            dataType: "jsonp",
            success: function(data) {
                callback(data);
            },
            error:function (data) {
                falid()
            }
        });
    }
    //全网首页必败专场
    dayu.api.hotSpecial = function (callback,falid) {
        $.ajax({
            type: "get",
            url: dyyp.API_MOBILE_URL+"/hot-special",
            async: true,
            dataType: "jsonp",
            success: function(data) {
                callback(data);
            },
            error:function (data) {
                falid()
            }
        });
    }
    //全网首页人气推荐
    dayu.api.recommendProduct = function (page,bool,timer,callback,complete,falid) {
        $.ajax({
            type: "get",
            url: dyyp.API_MOBILE_URL+"/recommend-product?pageId="+page,
            async: true,
            dataType: "jsonp",
            success: function(data) {
                callback(data);
            },
            complete:function () {
                complete()
            },
            error:function (data) {
                falid()
            }
        });
    }
    //全网首页导航
    dayu.api.indexNav = function (callback,falid) {
        $.ajax({
            type: "post",
            url: "/whole/index-nav",
            async: true,
            success: function(data) {
                callback(data);
            },
            error:function (data) {
                falid()
            }
        });
    }
    // 9.9包邮
    dayu.api.productPostageIsFree = function (pageId,callback,complete,falid) {
        $.ajax({
            type: "post",
            url: "/whole/product-postageIsFree",
            data:{pageId:pageId},
            async: true,
            success: function(data) {
                callback(data);
            },
            complete:function(){
                complete()
            },
            error:function (data) {
                falid()
            }
        });
    }
    //全网首页拼团专区
    dayu.api.clusterProducts = function (callback,falid) {
        $.ajax({
            type: "post",
            url: "/whole/clusterProducts",
            async: true,
            success: function(data) {
                callback(data);
            },
            error:function (data) {
                falid()
            }
        });
    }
    //优惠券或返利
    dayu.api.contentNav = function (type,callback,falid) {
        $.ajax({
            type: "post",
            url: "/whole/content-nav",
            data:{type:type},
            async: true,
            success: function(data) {
                // console.log(data);
                callback(data);
            },
            error:function (data) {
                falid()
            }
        });
    }
    //优惠券或返利banner图
    dayu.api.navBanne = function (type,callback,falid) {
        $.ajax({
            type: "get",
            url:  dyyp.API_MOBILE_URL+"/nav-banner?type="+type,
            async: true,
            dataType: "jsonp",
            success: function(data) {
                // console.log(data);
                callback(data);
            },
            error:function (data) {
                falid()
            }
        });
    }
    //优惠券或返利商品
    dayu.api.navProduct = function (type,navId,pageId,isAll,callback,complete,falid) {
        $.ajax({
            type: "post",
            url: "/whole/nav-product",
            data:{type:type,navId:navId,pageId:pageId,isAll:isAll},
            async: true,
            success: function(data) {
                // console.log(dyyp.API_MOBILE_URL+"/nav-product?type="+type+"&navId="+navId+"&pageId="+pageId+"&isAll="+isAll);
                // console.log("sh",data);
                callback(data);
            },
            complete:function (data) {
                complete()
            },
            error:function (data) {
                falid()
            }
        });
    }
    //文字搜索提示
    dayu.api.complete = function (query,callback) {
        $.ajax({
            type: "post",
            url: "/me/complete",
            async: true,
            data:{query:query},
            success: function(data) {
                // console.log(data);
                callback(data);
            }
        });
    }
    //全网商品详情页
    dayu.api.productDetail = function (pfromId,callback) {
        // var url = dyyp.API_MOBILE_URL+"/product/"+pfromId+"/detail";
        $.ajax({
            type: "get",
            url:  dyyp.API_MOBILE_URL+"/product/"+pfromId+"/detail",
            async: true,
            // dataType:"jsonp",
            success: function(data) {
                // console.log(data);
                callback(data);
            }
        });
    }
    //回到顶部
    $(window).on("scroll", function() {
        var scrollTop = $(window).scrollTop();
        if(scrollTop > 100) {
            $(".back").fadeIn();
        } else {
            $(".back").fadeOut();
        }

        $(".back").on("click", function() {
            $("body").stop().animate({
                scrollTop: 0
            })
        })
    });
})();

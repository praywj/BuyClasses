$(function(){
    //tab切换变色
    $('.collapse li a').click(function(e){
        $(this).addClass('active');
        $(this).parent().siblings().children().removeClass('active');

    })

    //banner轮播
    $('.left .glyphicon').click(function(){
        $('#myCarousel').carousel('prev');
    });
    $('.right .glyphicon').click(function(){
        $('#myCarousel').carousel('next');
    });

    //平滑过渡
    $('a[href*=#],area[href*=#]').click(function(){
        if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
            var $target = $(this.hash);
            $target = $target.length && $target || $('[name=' + this.hash.slice(1) + ']');
            if ($target.length) {
                var targetOffset = $target.offset().top - 66;
                $('html,body').animate({
                        scrollTop: targetOffset
                    },
                    1000);
                return false;
            }
        }
    });

    //表格操作
    let clickBtns = $('.clickbox');  //每个小的input
    let click_Btns = $('.click_box');
    let checkAll = $('.check-all');
    let btnLen = clickBtns.length;
    var total = 0.00;
    let numAll = 0;
    clickBtns.click(function(){
        let check = $(this).prop('checked');
        $tr = $(this).parent().parent().parent();
        $tr.attr('class',check ?'on':'');
        priceCal($(this),check);
        //判断是否全选
        let checkedLen = $('tr[class="on"]').length;
        if(btnLen === checkedLen){
            checkAll.each(function(){
                $(this).prop ('checked',check);
            })
        }else{
            checkAll.each(function(){
                $(this).prop ('checked',false);
            })
        }
    })

    clickBtns.each(function(){
        let check = $(this).prop('checked');
        if(check){
            total += parseFloat($(this).parent().parent().next().next().next().children().next().html().substr(1));
        }
    })
    click_Btns.each(function(){
        let check = $(this).prop('checked');
        if(check){
            total += parseFloat($(this).next().next().next().html().substr(1));
        }
    })
    $('.total-price').text('￥'+total.toFixed((2)));

    $('#service-check').prop('checked',false);
    $('#pay').attr('class','pay');
    $('#service-check_m').prop('checked',false);
    $('#pay_m').attr('class','pay');

    //全选和全不选
    checkAll.click(function(){
        let check = $(this).prop('checked');
        checkAll.each(function(){
            $(this).prop ('checked',check);
        })
        if(check){
            total = 0.00;
            numAll = 0;
        }
        clickBtns.each(function(){
            let is_pur = $(this).parent().parent().next().next().next().next().html();
            is_pur = is_pur.replace(/\ +/g,"");
            is_pur = is_pur.replace(/[\r\n]/g,"");
            if(is_pur == "False"){
                $(this).prop ('checked',check);
                $(this).parent().parent().parent().attr('class',check ?'on':'');
                priceCal($(this),check);
            }
        })
    })

    function priceCal(that,check){
        price = parseFloat(that.parent().parent().next().next().next().children().next().html().substr(1));
        if(check){
            total += price;
            numAll++;
        }else{
            total -= price;
            numAll--;
            if(total <= 0){
                total = 0.00;
            }
        }
        $('.total-price').text('￥'+total.toFixed((2)));
    }

    //遮罩层显示
    /* 显示遮罩层 */
    function showOverlay() {
        $("#mask").height(pageHeight());
        $("#mask").width(pageWidth());
        $("#mask").fadeTo(200, 0.5);
    }
    /* 隐藏覆盖层 */
    function hideOverlay() {
        $("#mask").fadeOut(200);
    }
    /* 当前页面高度 */
    function pageHeight() {
        return document.body.scrollHeight;
    }
    /* 当前页面宽度 */
    function pageWidth() {
        return document.body.scrollWidth;
    }

    /* 定位到页面中心 */
    function adjust(id) {
        var w = $(id).width();
        var h = $(id).height();
        // var t = scrollY() + (windowHeight()/2) - (h/2);
        var t = (windowHeight()/2) - (h/2);
        if(t < 0) t = 0;
        // var l = scrollX() + (windowWidth()/2) - (w/2);
        var l = (windowWidth()/2) - (w/2);
        if(l < 0) l = 0;
        $(id).css({left: l+'px', top: t+'px'});
    }

    //浏览器视口的高度
    function windowHeight() {
        var de = document.documentElement;
        return self.innerHeight || (de && de.clientHeight) || document.body.clientHeight;
    }
    //浏览器视口的宽度
    function windowWidth() {
        var de = document.documentElement;
        return self.innerWidth || (de && de.clientWidth) || document.body.clientWidth
    }
    /* 浏览器垂直滚动位置 */
    function scrollY() {
        var de = document.documentElement;
        return self.pageYOffset || (de && de.scrollTop) || document.body.scrollTop;
    }
    /* 浏览器水平滚动位置 */
    function scrollX() {
        var de = document.documentElement;
        return self.pageXOffset || (de && de.scrollLeft) || document.body.scrollLeft;
    }

    //责任声明
    $('.go_pay').click(function(){
        showOverlay();
        adjust('#tellus');
        $('#tellus').show();
    });

    // $('#service-check').attr('checked',false);
    $('#service-check').click(function () {
        let check = $('#service-check').prop('checked');
        $('#service-check').attr('checked',check);
        $('#pay').attr('class',check?'pay-on':'pay');
    });
    $('.del').click(function () {
        hideOverlay();
        $('#tellus').hide();
    })
    // $('.total-price').text('￥'+(Math.round(total*10)/10).toFixed(2));
    $('#service-check_m').click(function () {
        let check = $('#service-check_m').prop('checked');
        $('#service-chec_m').attr('checked',check);
        $('#pay_m').attr('class',check?'pay-on':'pay');
    });
});
$(function(){

    //表格操作
    let clickBtns = $('.click_box');  //每个小的input
    let checkAll = $('.check-all');
    let btnLen = clickBtns.length;
    let total = 0.0;
    let numAll = 0;
    clickBtns.click(function(){
        let check = $(this).prop('checked');
        $tr = $(this).parent();
        if(check){
            $tr.addClass('on_click');
        }else{
            $tr.removeClass('on_click');
        }
        // $tr.attr('class',check ?'on_click':'');
        priceCal($(this),check);
        //判断是否全选
        let checkedLen = $('div[class="on_click"]').length;
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

    //全选和全不选
    checkAll.click(function(){
        let check = $(this).prop('checked');
        checkAll.each(function(){
            $(this).prop ('checked',check);
        })
        if(check){
            total = 0.0;
            numAll = 0;
        }
        clickBtns.each(function(){
            let is_pur = $(this).next().next().next().next().html();
            is_pur = is_pur.replace(/\ +/g,"");
            is_pur = is_pur.replace(/[\r\n]/g,"");
            if(is_pur == "False"){
                $(this).prop ('checked',check);
                if(check){
                    $(this).parent().addClass('on_click');
                }else{
                    $(this).parent().removeClass('on_click');
                }
                // $(this).parent().attr('class',check ?'on_click':'');
                priceCal($(this),check);
            }
        })
    })

    function priceCal(that,check){
        price = parseFloat(that.next().next().next().html().substr(1));
        if(check){
            total += price;
            numAll++;
        }else{

            total -= price;
            numAll--;
        }
        // $('.goods-num').text(numAll);
        $('.total-price').text('￥'+total.toFixed((2)));
    }

    // 获取用户已经购买的课程信息
    var trList = $('#list').children(".box2");
    for(var i = 0; i < trList.length; i++){
        var is_check = trList.eq(i).find('.is_pur');
        let check = is_check.html();
        check = check.replace(/\ +/g,"");
        check = check.replace(/[\r\n]/g,"");
        var flag = false;
        if(check == "True")
            flag = true;
        if(flag){
            console.log(flag);
            var check_box = trList.eq(i).find('.click_box');
            check_box.css("display","none");
            var spanObj = document.createElement('span');
            spanObj.innerText = "[已购买]"
            var get_id = check_box.next().html();
            get_id = get_id.replace(/\ +/g,"");
            get_id = get_id.replace(/[\r\n]/g,"");
            get_id = 'lesson_m' + get_id;
            console.log(get_id);
            document.getElementById(get_id).appendChild(spanObj);
            check_box.next().next().css("margin-left","5%");
        }
    }

});

function create_payment_order_m(){
    // 获取用户需要购买的课程信息
    var trList = $('#list').children(".box2");
    var class_id = new Array();
    var count =0;
    for(var i = 0; i < trList.length-1; i++){
        var is_check = trList.eq(i).find('.click_box');
        let check = is_check.prop('checked');
        if(check){
            class_id[count] = is_check.next().text();
            class_id[count] = class_id[count].replace(/[\r\n]/g,"");
            class_id[count] = class_id[count].replace(/\ +/g,"");
            count++;
        }
    }
    var extra_info = {"order_name": 'live_course',
        "live_room_ids": class_id};
    $.ajax({
        type: "POST",
        url: "/payment/create_order/",
        datatype: JSON,
        data: {
            "order_type": 1,
            "pay_platform": 'weixin_qr',
            "extra_info": JSON.stringify(extra_info)
        },
        success: function( result ) {
            if (result.success){
                console.log(result.out_trade_no);
                var pay_link = "/payment/order_detail/?out_trade_no=" + result.out_trade_no;
                window.location.href = pay_link;
            }else{
                console.log(result.error_msg);
            }
        }
    });
}
$('#service-check_m').click(function () {
    let check = $('#service-check_m').prop('checked');
    if(check){
        $('#pay_m').bind('click',function () {
            create_payment_order_m();
        });
    }
})
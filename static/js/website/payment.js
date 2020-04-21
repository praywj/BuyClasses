
function create_payment_order(){
    // 获取用户需要购买的课程信息
    var trList = $('#order-list').children("tr");
    var class_id = new Array();
    var count =0;
    for(var i = 0; i < trList.length-1; i++){
        var is_check = trList.eq(i).find('.clickbox');
        let check = is_check.prop('checked');
        if(check){
            class_id[count] = is_check.parent().parent().next().text();
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
    $('#service-check').click(function () {
        let check = $('#service-check').prop('checked');
       if(check){
           $('#pay').bind('click',function () {
               create_payment_order();
           });
       }
    })

function select_pay(order_name) {

    $.ajax({
        type: "GET",
        url: "/payment/tp_payment/get_wechat_qr/",
        datatype: JSON,
        data: {
            "out_trade_no": order_name,
        },
        success: function( result ) {
            if (result.success){
                // alert(result.wechat_qr_url);
                document.getElementById("weixin_pay").src = result.wechat_qr_url;
                console.log(result.wechat_qr_url);
            }else{
                console.log(result.error_msg);
            }
        }
    });
}


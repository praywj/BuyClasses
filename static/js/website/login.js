var error_msg = $('#error_msg');

function getNewCaptcha(){
    $.ajax({
        url: "/auth/refresh_captcha/",
        success: function( result ) {
            $("#captcha_img").attr("src", result.captcha_info.captcha_url);
            hashkey = '&hashkey=' + result.captcha_info.key;
        }
    });
}

function validatemobile(phone)
{
    var reg = /^1[3|4|5|7|8][0-9]{9}$/;
    if (!reg.test(phone)){
        error_msg.text('手机号码格式不正确');
        error_msg.css('color', '#9e2c2c');
        return false;
    }else{
        error_msg.text('手机号码可用');
        error_msg.css('color', '#04540a');
        return true;
    }
}

function login_submit() {
    var post_data = $("#login_form").serialize() + hashkey + next_url;
    $.ajax({
        type: "POST",
        url: "/auth/web_login_ajax/",
        datatype: JSON,
        data: post_data,
        success:function (result) {
            if (result.success){
                window.location.href=result.dest_url
            }else{
                $("#captcha_img").attr("src", result.captcha_info.captcha_url);
                hashkey = '&hashkey=' + result.captcha_info.key;
                error_msg.text(result.error_msg);
                error_msg.css('color', '#9e2c2c');
            }
        }
    })
}

var InterValObj; //timer变量，控制时间
var count = 60; //间隔函数，1秒执行
var curCount;//当前剩余秒数
var error_msg = $('#phone_validation_err');
var psw_error_msg = $('#psw_match_err');
var validation_msg = $('#validation_err');

function validatemobile02(phone)
{
    // var error_msg = $('#phone_validation_err');
    var reg = /^1[3|4|5|7|8][0-9]{9}$/;
    if (!reg.test(phone)){
        psw_error_msg.text('手机号码格式不正确');
        psw_error_msg.css('color', '#9e2c2c');
        return false;
    }else{
        psw_error_msg.text('手机号码可用');
        psw_error_msg.css('color', '#04540a');
        return true;
    }
}

function sendVerifyCode() {
    curCount = count;
    //设置button效果，开始计时
    var signupphone = $("#signup-phone").val();
    console.log(signupphone);
    if (validatemobile02(signupphone)){
        $("#send_code_btn").attr("disabled", "true");
        $("#send_code_btn").val(curCount + "秒后再次发送验证码");
        InterValObj = window.setInterval(SetRemainTime, 1000); //启动计时器，1秒执行一次
        $.ajax({
            type: "POST", //用POST方式传输     　　
            url: '/auth/get_register_verify_code/', //目标地址.
            dataType: "json", //数据格式:JSON
            data:{
                'phone': signupphone
            },
            success:function (result) {
                if (!result.success){

                }else{
                    validation_msg.text (result.error_msg);
                }
            }
        });
    }else {
        error_msg.text('请填入手机号');
    }
}

function SetRemainTime() {
    if (curCount == 0) {
        window.clearInterval(InterValObj);//停止计时器
        $("#send_code_btn").removeAttr("disabled");//启用按钮
        $("#send_code_btn").val("重新发送验证码");
    }
    else {
        curCount--;
        $("#send_code_btn").val(curCount + "秒后再次发送验证码");
    }
}

/*
$('#signup-psw-validate').bind('input propertychange', function () {

    var signuppassword = $('#signup-psw');
    var signuppassword2 = $('#signup-psw-validate');
    if (signuppassword.val() == signuppassword2.val()){
        psw_error_msg.text('密码满足');
        psw_error_msg.css('color', '#04540a');
    }else{
        psw_error_msg.text('两次密码不一致');
        psw_error_msg.css('color', '#9e2c2c');
    }

});
*/


function signup_submit() {
    console.log($("#signup_from").serialize());
    $.ajax({
        type: "POST",
        url: "/auth/web_register_ajax/",
        datatype: JSON,
        data:$("#signup_form").serialize(),
        success:function (result) {
            if (result.success){
                window.location.href = "/";
            }else{
                psw_error_msg.text(result.error_msg);
                psw_error_msg.css('color', '#9e2c2c');
            }
        }
    })
}

var selType = webim.SESSION_TYPE.GROUP;
var loginInfo;


$(document).ready(function(){
    user_info_get();
});


function user_info_get() {
    $.ajax({
        type: "GET",
        url: "/auth/im/get_usersig/",
        datatype: JSON,

        success:function (result) {
   //         console.log(result);
            if (result.identifier){
                //当前用户信息
                loginInfo = {
                    'sdkAppID': result.appid, //用户所属应用id,必填
                    'appIDAt3rd': result.appid, //用户所属应用id，必填
                    'accountType': result.account_type, //用户所属应用帐号类型，必填
                    'identifier': result.identifier, //当前用户ID，需要开发者填写
                    'identifierNick': null, //当前用户昵称，选填
                    'userSig': result.usersig, //当前用户身份凭证，需要开发者填写
                    'headurl': 'img/2016.gif'//当前用户默认头像，选填

                };
                var options = {'isAccessFormalEnv':true ,'isLogOn':true};
                webim.login(loginInfo,listeners, options,
                    function (resp) {
                        loginInfo.identifierNick = userNickName;
                        console.log("昵称打出来看下"+loginInfo.identifierNick);
                        console.log('登录')
                    }, function (err) {
                        console.log('登录失败');
                    })
            }else{

            }
        }
    })
}

//位于 js/demo_base.js 中
//IE9(含)以下浏览器用到的 jsonp 回调函数
function jsonpCallback(rspData) {
//设置 jsonp 返回的
    webim.setJsonpLastRspData(rspData);
}

// //监听大群新消息（普通，点赞，提示，红包）
//
// function onBigGroupMsgNotify(msgList) {
//     for (var i = msgList.length - 1; i >= 0; i--) { //遍历消息，按照时间从后往前
//         var msg = msgList[i];
//         //console.warn(msg);
//         webim.Log.warn('receive a new avchatroom group msg: ' + msg.getFromAccountNick());
//         //显示收到的消息
//         showMsg(msg);
//     }
// }

//监听新消息事件
//newMsgList 为新消息数组，结构为[Msg]
function onMsgNotify(newMsgList) {

    //console.warn(newMsgList);
    var sess, newMsg;
    //获取所有聊天会话
    var sessMap = webim.MsgStore.sessMap();
    for (var j in newMsgList) {//遍历新消息
        newMsg = newMsgList[j];
        if (newMsg.getSession().id() == selToID) {//为当前聊天对象的消息
            selSess = newMsg.getSession();
            //在聊天窗体中新增一条消息
            //console.warn(newMsg);
            addMsg(newMsg);

        }else{

        }
    }
    //消息已读上报，以及设置会话自动已读标记
    // webim.setAutoRead(selSess, true, true);
    // for (var i in sessMap) {
    //     sess = sessMap[i];
    //     if (selToID != sess.id()) {//更新其他聊天对象的未读消息数
    //         updateSessDiv(sess.type(), sess.id(), sess.unread());
    //     }
    // }
}

//聊天页面增加一条消息11111
function addMsg(msg) {
    var isSelfSend, fromAccount, fromAccountNick, sessType, subType;
    fromAccount = msg.getFromAccount();
    if (!fromAccount) {
        fromAccount = '';
    }
    fromAccountNick = msg.getFromAccountNick();
    if (!fromAccountNick) {
        fromAccountNick = fromAccount;
    }
    isSelfSend = msg.getIsSend();//消息是否为自己发的
    var onemsg = document.createElement("div");
    onemsg.className = "p-talk";
    var userdiv = document.createElement("div");
    userdiv.className = "p-info";
    var username = document.createElement("span");
    var msgbody = document.createElement("div");
    msgbody.className = "p-say";

    if (!isSelfSend){
        username.style.color = "blue";
    }


    if(isAdmin == "True"){
        username.innerHTML = "("+ msg.getFromAccount() + ")" + fromAccountNick + "&nbsp;" + webim.Tool.formatTimeStamp(msg.getTime());
    }else{
        username.innerHTML =  fromAccountNick + "&nbsp;" + webim.Tool.formatTimeStamp(msg.getTime());
    }

    msgbody.innerHTML = convertMsgtoHtml(msg);

    userdiv.appendChild(username);
    onemsg.appendChild(userdiv);
    onemsg.appendChild(msgbody);
    //消息列表
    var msgflow = document.getElementsByClassName("talk")[0];
    msgflow.appendChild(onemsg);

    setTimeout(function () {
         $(".talk").scrollTop($(".talk")[0].scrollHeight);
    }, 300);
}


//把消息转换成 HTML
function convertMsgtoHtml(msg) {
    var html = "", elems, elem, type, content;
    elems = msg.getElems();//获取消息包含的元素数组
    for (var i in elems) {
        elem = elems[i];
        type = elem.getType();//获取元素类型
        content = elem.getContent();//获取元素对象
        switch (type) {
            case webim.MSG_ELEMENT_TYPE.TEXT:
                html += convertTextMsgToHtml(content);
                break;
            case webim.MSG_ELEMENT_TYPE.FACE:
                html += convertFaceMsgToHtml(content);
                break;
            default:
                webim.Log.error('未知消息元素类型: elemType=' + type);
                break;
        }
    }
    return html;
}


//解析文本消息元素
function convertTextMsgToHtml(content) {
    return content.getText();
}

//解析表情消息元素
function convertFaceMsgToHtml(content) {
    var index = content.getIndex();
    var data = content.getData();
    var url=null;
    var emotion=webim.Emotions[index];
    if(emotion && emotion[1]){
        url=emotion[1];
    }
    if (url) {
        return    "<img src='" + url + "'/>";
    } else {
        return data;
    }
}


//监听连接状态回调变化事件
var onConnNotify = function (resp) {
    switch (resp.ErrorCode) {
        case webim.CONNECTION_STATUS.ON:
            //webim.Log.warn('连接状态正常...');
            break;
        case webim.CONNECTION_STATUS.OFF:
            webim.Log.warn('连接已断开，无法收到新消息，请检查下你的网络是否正常');
            break;
        default:
            webim.Log.error('未知连接状态,status=' + resp.ErrorCode);
            break;
    }
};

//监听事件
var listeners = {
    "onConnNotify": onConnNotify, //选填
    "jsonpCallback": jsonpCallback, //IE9(含)以下浏览器用到的jsonp回调函数,移动端可不填，pc端必填
    "onMsgNotify": onMsgNotify,//监听新消息(私聊(包括普通消息和全员推送消息)，普通群(非直播聊天室)消息)事件，必填
};


//发送消息(文本或者表情)
function onSendMsg() {
    if (!selToID) {
        liveroom_talk_info.innerText = "您未加入聊天室，请联系管理员";
        $("#my-input").val('');
        console.log(loginInfo);
        return;
    }
    //获取消息内容
    var msgtosend = $("#my-input").val();
    var msgLen = webim.Tool.getStrBytes(msgtosend);
    if (msgtosend.length < 1) {
        liveroom_talk_info.innerText = "发送的消息不能为空！";
        $("#my-input").val('');
        return;
    }
    var maxLen, errInfo;
    maxLen = webim.MSG_MAX_LENGTH.GROUP;
    errInfo = "消息长度超出限制(最多" + Math.round(maxLen / 3) + "汉字)";
    // if (selType == webim.SESSION_TYPE.C2C) {
    //     maxLen = webim.MSG_MAX_LENGTH.C2C;
    //     errInfo = "消息长度超出限制(最多" + Math.round(maxLen / 3) + "汉字)";
    // } else {
    //     maxLen = webim.MSG_MAX_LENGTH.GROUP;
    //     errInfo = "消息长度超出限制(最多" + Math.round(maxLen / 3) + "汉字)";
    // }
    if (msgLen > maxLen) {
        liveroom_talk_info.innerText = "消息长度超过限制";
        return;
    }

    if (!selSess) {
        var  selSess = new webim.Session(selType, selToID, selToID, "", Math.round(new Date().getTime() / 1000));
    }
    var isSend = true;//是否为自己发送
    var seq = -1;//消息序列，-1表示 SDK 自动生成，用于去重
    var random = Math.round(Math.random() * 4294967296);//消息随机数，用于去重
    var msgTime = Math.round(new Date().getTime() / 1000);//消息时间戳
    var subType;//消息子类型
    // if (selType == webim.SESSION_TYPE.C2C) {
    //     subType = webim.C2C_MSG_SUB_TYPE.COMMON;
    // } else {
    //     //webim.GROUP_MSG_SUB_TYPE.COMMON-普通消息,
    //     //webim.GROUP_MSG_SUB_TYPE.LOVEMSG-点赞消息，优先级最低
    //     //webim.GROUP_MSG_SUB_TYPE.TIP-提示消息(不支持发送，用于区分群消息子类型)，
    //     //webim.GROUP_MSG_SUB_TYPE.REDPACKET-红包消息，优先级最高
    //     subType = webim.GROUP_MSG_SUB_TYPE.COMMON;
    // }
    subType = webim.GROUP_MSG_SUB_TYPE.COMMON;
    var msg = new webim.Msg(selSess, isSend, seq, random, msgTime, loginInfo.identifier, subType, loginInfo.identifierNick);
    var text_obj, face_obj, tmsg, emotionIndex, emotion, restMsgIndex;
    //解析文本和表情
    var expr = /\[[^[\]]{1,3}\]/mg;
    var emotions = msgtosend.match(expr);
    if (!emotions || emotions.length < 1) {
        text_obj = new webim.Msg.Elem.Text(msgtosend);
        msg.addText(text_obj);
    } else {
        for (var i = 0; i < emotions.length; i++) {
            tmsg = msgtosend.substring(0, msgtosend.indexOf(emotions[i]));
            if (tmsg) {
                text_obj = new webim.Msg.Elem.Text(tmsg);
                msg.addText(text_obj);
            }
            emotionIndex = webim.EmotionDataIndexs[emotions[i]];
            emotion = webim.Emotions[emotionIndex];
            if (emotion) {
                face_obj = new webim.Msg.Elem.Face(emotionIndex, emotions[i]);
                msg.addFace(face_obj);
            } else {
                text_obj = new webim.Msg.Elem.Text(emotions[i]);
                msg.addText(text_obj);
            }
            restMsgIndex = msgtosend.indexOf(emotions[i]) + emotions[i].length;
            msgtosend = msgtosend.substring(restMsgIndex);
        }
        if (msgtosend) {
            text_obj = new webim.Msg.Elem.Text(msgtosend);
            msg.addText(text_obj);
        }
    }
    webim.sendMsg(msg, function (resp) {
        // if (selType == webim.SESSION_TYPE.C2C) {//私聊时，在聊天窗口手动添加一条发的消息，群聊时，长轮询接口会返回自己发的消息
        //     addMsg(msg);
        // }
        webim.Tool.setCookie("tmpmsg_" + selToID, '', 0);
        liveroom_talk_info.innerText = "";
        $("#my-input").val('');
        //turnoffFaces_box();
        console.log(msgtosend);
    }, function (err) {
        console.log(err.ErrorInfo);
        if(err.ErrorCode == 10007){
            liveroom_talk_info.innerText = "您没有权限在本聊天室内发言，请联系管理员";
        }
        else if(err.ErrorCode == 10010){
            liveroom_talk_info.innerText = "您所在的聊天室不存在，请联系管理员";
        }
        else if(err.ErrorCode == 10017){
            liveroom_talk_info.innerText = "您所在的教室暂时禁止发言，感谢配合";
        }
        $("#my-input").val('');
    });
}

$(function(){
    if($('.image-slider').css('display') == 'block'){
        var num = 0;
        var li_num = 0;
        var preview = document.getElementsByClassName("preview")[0];
        var list = preview.getElementsByTagName( "li");
        var ptimer = null;
        function change(){
             $('.contents-wrapper').css('transform','translateX('+num+'%)');
            for(let i = 0;i < list.length; i++){
                list[i].className = '';
            }
            list[li_num].className='l-active';
        }
        $('.image-slider-forward').click(function(){
            clearInterval(ptimer);
            if(num == -14){
                num = 14;
                li_num = -1;
            }
            num -= 14;
            li_num = (li_num+1)%4;
            change();
            ptimer = setInterval(function(){
                if(num == -14){
                    num = 14;
                    li_num = -1;
                }
                num -= 14;
                li_num = (li_num+1)%2;
                change();
            },3000);
        })
        $('.image-slider-back').click(function(){
            clearInterval(ptimer);
             if(num == 0){
                    num = -28;
                    li_num = 2;
            }
            num += 14;
            li_num = (li_num-1)%2;
            change();
            ptimer = setInterval(function(){
                if(num == -14){
                    num = 14;
                    li_num = -1;
                }
                num -= 14;
                li_num = (li_num+1)%2;
                change();
            },3000);
        })
        ptimer = setInterval(function(){
            if(num == -14){
                num = 14;
                li_num = -1;
            }
            num -= 14;
            li_num = (li_num+1)%2;
            change();
        },3000);
    }else{
        var n = 0;
        var lis = 0;
        var startX,endX;
        var p_preview = document.getElementsByClassName('phone-preview')[0];
        var lists = p_preview.getElementsByTagName('li');
        var timer = null;
        var phone_wrapper = document.querySelector('.phone-contents-wrapper');
        console.log(phone_wrapper);
        function auto_slider() {
            n -= 20;
            lis = (lis + 1) % 5;
            $('.phone-contents-wrapper').css('transform', 'translateX(' + n + '%)');
            if (n == -80) {
                n = 20;
            }
            for (let i = 0; i < lists.length; i++) {
                lists[i].className = '';
            }
            lists[lis].className = 'phone-active';
        }
        timer = setInterval(auto_slider,3000);
        $('.phone-outer').on('touchstart',function(e){
            clearInterval(timer);
            e.preventDefault();
            startX = e.originalEvent.touches[0].clientX ;
        });
        $('.phone-outer').on('touchmove',function(e){
            endX = e.originalEvent.touches[0].clientX;
            e.preventDefault();
        })
        $('.phone-outer').on('touchend',function(e){
            e.preventDefault();
            var dis = endX - startX;
            if(dis < 0){
                n -= 20;
                lis = (lis + 1) % 5;
                if( lis == 5 ){
                    lis = 0;
                }
                if( n == -100){
                    n = 0;
                }
            }else{
                n += 20;
                lis = (lis-1) % 5;
                if( lis < 0){
                    lis = 4;
                }
                if(n == 20){
                    n = -80;
                }
            }
            $('.phone-contents-wrapper').css('transform','translateX('+n+'%)');
            for(let i = 0; i <lists.length ; i++ ){
                lists[i].className = '';
            }
            lists[lis].className='phone-active';
            timer=setInterval(auto_slider,3000);
        })
    }
});
$(document).ready(function() {
    backToTop();
});

/**
 * 맨위로 이동
 */
function backToTop() {
    $("[data-toggle='tooltip']").tooltip();
    var st = $(".page-scrollTop");
    var $window = $(window);
    var topOffset;
    //상단으로 다시 표시 할 페이지 굴리기
    $window.scroll(function() {
        var currnetTopOffset = $window.scrollTop();
        if (currnetTopOffset > 0 && topOffset > currnetTopOffset) {
            st.fadeIn(500);
        } else {
            st.fadeOut(500);
        }
        topOffset = currnetTopOffset;
    });

    //맨 위로 가기
    st.click(function() {
        $window.scrollTop(0)
    });
}





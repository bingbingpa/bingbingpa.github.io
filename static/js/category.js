$(document).ready(function() {
    categoryDisplay();
});

/**
 * 카테고리 표시
 * @return {[type]} [description]
 */
function categoryDisplay() {
    selectCategory();
    $('.categories-item').click(function() {
        window.location.hash = "#" + $(this).attr("cate");
        selectCategory();
    });
}

function selectCategory(){
    var exclude = ["",undefined];
    var thisId = decodeURIComponent(window.location.hash.substring(1));
    var allow = true;
    for(var i in exclude){
        if(thisId === exclude[i]){
            allow = false;
            break;
        }
    }
    if(allow){
        $("section[post-cate!='" + thisId + "']").hide(200);
        $("section[post-cate='" + thisId + "']").show(200);
    } else {
        $("section[post-cate='All']").show();
    }
}

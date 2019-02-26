//star
$(function(){
    var stepW = 24;

    var description = ["1", "2", "3", "4", "5"];
    alert(description);

    var stars = $("#star > li");
    var descriptionTemp;
    $("#showb").css("width",0);
    stars.each(function(i){
        $(stars[i]).click(function(e){
            var n = i+1;
            $("#showb").css({"width":stepW*n});
            descriptionTemp = description[i];
            $(this).find('a').blur();
            return stopDefault(e);
            return descriptionTemp;
        });
    });
    stars.each(function(i){
        $(stars[i]).hover(
            function(){
                $(".description").html(description[i]);
            },
            function(){
                if(descriptionTemp != null)
                    $(".description").html("the score£º" + descriptionTemp);
                else 
                    $(".description").html(" ");
            }
        );
    });
});
function stopDefault(e){
    if(e && e.preventDefault)
           e.preventDefault();
    else
           window.event.returnValue = false;
    return false;
};

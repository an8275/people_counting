//  Andy Langton's show/hide/mini-accordion @ http://andylangton.co.uk/jquery-show-hide

// this tells jquery to run the function below once the DOM is ready
$(document).ready(function() {

// choose text for the show/hide link - can contain HTML (e.g. an image)
var down="../images/dropdown_arrow_down.png";
var up="../images/dropdown_arrow_up.png";

// append show/hide links to the element directly preceding the element with a class of "toggle"
$('.toggle').prev().append('<a href="#" class="toggleLink"><img class="toggleImg" src="' + up + '" alt="隐藏"/></a>');

// hide all of the elements with a class of 'toggle'
$('.toggle').show();

// capture clicks on the toggle links
$('a.toggleLink').click(function() {

// change the link text depending on whether the element is shown or hidden
if ($(this).find('.toggleImg').attr("alt")==="隐藏") {
$(this).find('.toggleImg').attr("src", down);
$(this).find('.toggleImg').attr("alt", "显示");
$(this).parent().next('.toggle').slideUp('slow');
}
else {
$(this).find('.toggleImg').attr("src", up);
$(this).find('.toggleImg').attr("alt", "隐藏");
$(this).parent().next('.toggle').slideDown('slow');
}

// return false so any link destination is not followed
return false;

});
});
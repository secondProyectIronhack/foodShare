/*jshint esversion: 6*/
$(document).ready(function(){
        $("button").on('click',function(event){
        event.preventDefault();
        console.log("click");
        let foodId = $(this).attr('class');
        console.log(foodId);
        $.ajax({
            url: "/add-food",
            type: "POST",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify({foodId: foodId}),
           //success: showFeedback,
           //error: handleError  
        });
    });
 });
function showFeedback (response) {
  console.log(response);
}

function handleError (err) {
  console.log('Oh no! Error:');
  console.log(err);
}

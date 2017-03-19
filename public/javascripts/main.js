/*jshint esversion: 6*/
$(document).ready(function() {
    $("button").on('click', function(event) {
        event.preventDefault();
        let foodId = $(this).attr('class');
        $.ajax({
            url: "/add-food",
            type: "POST",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify({
                foodId: foodId
            }),
        });
    });
});

function showFeedback(response) {
    console.log(response);
}

function handleError(err) {
    console.log('Oh no! Error:');
    console.log(err);
}

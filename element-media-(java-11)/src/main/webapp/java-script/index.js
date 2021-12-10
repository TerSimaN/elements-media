$(document).ready(function () {
    console.log("HTML Ready");
    
    $( '#login-form' ).submit(function (event) {
        event.preventDefault();

        $.ajax({
            method: "POST",
            url: "login",
            data: {
                username: $('#login-username-input').val(),
                password: $('#login-password-input').val()
            }
        }).done(function (data) {
            window.location.replace(data);
        }).fail(function () {
            alert("Request has failed...");
        });
    });
});
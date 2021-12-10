$(document).ready(function () {
    $( '#logout-btn' ).click(function () {
        $.ajax({
            method: "POST",
            url: "logout"
        }).done(function (data) {
            if (data.status === 418) {
                alert("What do you mean by \"I am a teapot\"?");
            }

            window.location.href = "index.html";
        });
    });

    $( '#home-tab-link' ).click(function () {
        window.location.assign('home.html');
    });

    $( '#elements-tab-link' ).click(function () {
        window.location.assign('element.html');
    });

    $( '#profile-tab-link' ).click(function () {
        window.location.assign('profile.html');
    });
});
$(document).ready(function () {
    console.log("HTML Ready");

    var loggedUser;
    var loggedUserInfo = [];

    function getUserInfo(loggedUser) {
        
        $.ajax({

            method: "GET",
            url: "/user/get",
            data: {
                user_id: loggedUser
            }

        }).done(function (data) {
            // console.log("Returned user info is: ");
            // console.log(data);

            loggedUserInfo = data;
            showUserInfo(loggedUserInfo);

        }).fail(function () {
            alert("ERROR: No user found!!!");
        });

    }

    function deleteUser(loggedUser) {
        
        $.ajax({

            method: "DELETE",
            url: "/user/delete",
            data: {
                user_id: loggedUser
            }

        }).done(function (data) {
            
            // console.log("Delete returned: " + data);
            switch (data) {
                case 200:
                    alert("User deleted successfuly! Redirecting...");
                    window.location.replace("index.html");
                    break;
            }

        }).fail(function (data) {
            // console.log("Delete returned: ");
            // console.log(data);
            switch (data.status) {
                case 401:
                    window.location.replace("index.html");
                    break;

                case 403:
                    alert("ERROR! ERROR! ACCESS IS FORBIDDEN!");
                    break;

                case 404:
                    alert("Did not find the user!");
                    break;
            }
        });

    }

    function getLoggedUser() {
        
        $.ajax({

            method: "GET",
            url: "/loggedUserId"

        }).done(function (data) {

            // console.log("Check me: " + data);
            if (data == 401) {
                window.location.replace("index.html");
            } else {
                loggedUser = data;
            }

        }).fail(function () {
            window.location.replace("index.html");
        });

    }

    function showUserInfo(userInfo) {
        $('#username').val(userInfo.username);
        $('#email').val(userInfo.email);
    }

    // Reveals form used tp update logged user info
    $('#edit-btn').click(function () {
        $('#edit-btn').attr('disabled', true);

        getUserInfo(loggedUser);

        $('#edit-profile').show();
    });

    // Deletes the logged user from DB
    $('#delete-btn').click(function () {
        // console.log("Delete profile button clicked!");
        deleteUser(loggedUser);
    });

    // Updates information for logged user
    $('#edit-profile').submit(function (event) {
        event.preventDefault();

        $.ajax({

            method: "PUT",
            url: "/user/update",
            data: {
                user_id: loggedUser,
                username: $('#username').val(),
                email: $('#email').val(),
                password: $('#newPassword').val(),
                repeatPassword: $('#repeatPassword').val()
            }

        }).done(function (data) {

            switch (data) {
                case 200:
                    alert("Profile updated successfuly!");
                    window.location.href = "home.html";
                    break;
    
                case 401:
                    window.location.replace("index.html");
                    break;
    
                case 403:
                    alert("ERROR! ERROR! ACCESS IS FORBIDDEN!");
                    break;
    
                case 404:
                    alert("Did not find user!");
                    break;
    
            }
            
        }).fail(function () {
            alert("User update has failed...");
        });

    });

    $( '#cancel-btn' ).click(function () {
        $('#edit-btn').attr('disabled', false);
        $('#edit-profile').hide();
    });
    
    getLoggedUser();
});
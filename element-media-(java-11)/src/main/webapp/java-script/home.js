$(document).ready(function () {
    console.log("HTML Ready");

    var loggedUser;

    function getAllElements() {
        
        $.ajax({

            method: "GET",
            url: "/element/all"

        }).done(function (data) {
            $('#result-element-list').empty();

            data.forEach(function (element) {
                if (element.comment === null) {
                    showElementItem(element.imageAddress, element.title, element.description, element.rating, "", element.id, element.user.id);
                } else {
                    showElementItem(element.imageAddress, element.title, element.description, element.rating, element.comment, element.id, element.user.id);
                }
            });
        }).fail(function () {
            alert("ERROR: Elements failed to load!");
        });

    }

    function filterElementsBy(elementTitle, elementRating) {
        
        $.ajax({

            method: "POST",
            url: "/element/filter",
            data: {
                title: elementTitle,
                rating: elementRating
            }

        }).done(function (data) {
            $('#result-element-list').empty();

            data.forEach(function (element) {
                if (element.comment === null) {
                    showElementItem(element.imageAddress, element.title, element.description, element.rating, "", element.id, element.user.id);
                } else {
                    showElementItem(element.imageAddress, element.title, element.description, element.rating, element.comment, element.id, element.user.id);
                }
            });
        }).fail(function () {
            alert("ERROR: Elements failed to load!");
        });

    }

    function addComment(commentText, elementId) {
        
        $.ajax({

            method: "POST",
            url: "/comment/add",
            data: {
                comment: commentText,
                element_id: elementId
            }

        }).done(function (data) {
            
            if (data.includes("ERROR:")) {
                alert(data);
            } else {
                // console.log("Comment added successfuly!");
                // console.log(data);
                window.location.reload();
            }

        }).fail(function () {
            alert("ERROR: Something has gone wrong!");
        });

    }

    function updateComment(commentText, commentId) {
        
        $.ajax({

            method: "PUT",
            url: "/comment/update",
            data: {
                comment: commentText,
                comment_id: commentId
            }

        }).done(function (data) {
            
            switch (data) {
                case 200:
                    alert("Comment updated successfuly!");
                    window.location.reload();
                    break;
    
                case 401:
                    window.location.replace("index.html");
                    break;
    
                case 403:
                    alert("ERROR! ERROR! ACCESS IS FORBIDDEN!");
                    break;
    
                case 404:
                    alert("Did not find comment!");
                    break;
            }

        }).fail(function () {
            alert("Comment update has failed...");
        });

    }

    function deleteComment(commentId) {
        
        $.ajax({

            method: "DELETE",
            url: "/comment/delete",
            data: {
                comment_id: commentId
            }

        }).done(function (data) {
            
            // console.log("Delete returned: " + data);
            switch (data) {
                case 200:
                    alert("Comment deleted successfuly!");
                    window.location.reload();
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
                    alert("Did not find the selected comment!");
                    break;
            }
            window.location.reload();
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

    function showElementItem(elementImage, elementTitle, elementDescription, elementRating, elementComment, elementId, userId) {
        $resultElement = $('#result-element-list');
        var commentFromUser;
        var fromUserId;

        // Gets the text of the comment of the element
        var elementItemComment = elementComment.comment;

        var elementCommentId = elementComment.id;

        // Check if there is a comment
        if (elementComment.fromUser != undefined) {

            // Gets the user who wrote the comment
            commentFromUser = elementComment.fromUser;

            // Gets the id of the user who wrote the comment
            fromUserId = commentFromUser.id;

        } else {
            fromUserId = userId;
        }

        // console.log("Element ID: " + elementId);
        // console.log("User ID: " + userId);
        // console.log("ElementComment: ");
        // console.log(elementComment);

        const $resultTemplateView = getResultTemplateView(elementImage, elementTitle, elementDescription, elementRating, elementItemComment, elementId, elementCommentId);

        if (loggedUser == fromUserId) {
            $resultTemplateView.find('#delete-comment-btn').click(function () {
                // console.log("Delete btn clicked!");
                deleteComment(elementCommentId);
                $resultTemplateView.find('#add-btn-div').attr('class', "");
                $resultTemplateView.find('#result-item-comment').attr('class', "d-none");
            });
        } else {
            // console.log("Comment loggedUser: " + loggedUser);
            $resultTemplateView.find('#delete-comment-btn').hide();
            $resultTemplateView.find('#edit-comment-btn').hide();
        }
        
        $resultElement.append($resultTemplateView);
    }

    function getResultTemplateView(elementImage = "...", elementTitle = "Title", elementDescription = "Description", elementRating = 0, elementItemComment = "", elementId, commentId) {
        const $resultTemplate = $($('#result-element-clone').html());

        $resultTemplate.find('#element-image').attr('src', elementImage);
        $resultTemplate.find('#element-title').text(elementTitle);
        $resultTemplate.find('#element-description').text(elementDescription);
        $resultTemplate.find('#element-rating').text(elementRating);

        if (elementItemComment !== "") {
            $resultTemplate.find('#element-comment').text(elementItemComment);
            $resultTemplate.find('#add-btn-div').attr('class', "d-none");
            $resultTemplate.find('#result-item-comment').attr('class', "");
            $resultTemplate.find('#comment-id').text(commentId);
        }

        $resultTemplate.find('#element-id').text(elementId);
        
        return $resultTemplate;
    }

    $('#search-btn').click(function () {
        var elementTitle = $('#filter-title-input').val();
        var elementRating = $('#filter-rating-input').val();

        if (elementTitle === "" && elementRating === "none") {
            getAllElements();
        } else {
            filterElementsBy(elementTitle, elementRating);
        }
    });

    $('#clear-filters-btn').click(function () {
        $('#filter-title-input').val("");
        $('#filter-rating-input').val("none");

        getAllElements();
    });

    var modal = document.getElementById('staticBackdrop');
    var button;
    var buttonParent;
    var divParent;
    var firstDivParent;
    
    modal.addEventListener('show.bs.modal', function (modalShowEvent) {
        console.log("Start showing modal");

        var modalImage = modal.querySelector('#selected-element-image');
        var modalTitle = modal.querySelector('#selected-element-title');
        var addComment = modal.querySelector('#add-comment-input');
        var elementImage;
        var selectedElementImage;
        var elementTitle;
        var selectedElementTitle;

        button = modalShowEvent.relatedTarget;

        if (button.getAttribute('id') == "edit-comment-btn") {
            
            buttonParent = button.parentElement;
            divParent = buttonParent.parentElement;
            firstDivParent = divParent.parentElement;

            elementImage = firstDivParent.querySelector('#element-image');
            selectedElementImage = elementImage.getAttribute('src');

            elementTitle = firstDivParent.querySelector('#element-title');
            selectedElementTitle = elementTitle.innerText;

            var elementComment = firstDivParent.querySelector('#element-comment');
            var selectedElementComment = elementComment.innerText;

            modalTitle.innerText = selectedElementTitle;
            modalImage.setAttribute('src', selectedElementImage);
            addComment.value = selectedElementComment;

        } else {

            buttonParent = button.parentElement;
            divParent = buttonParent.parentElement;

            elementImage = divParent.querySelector('#element-image');
            selectedElementImage = elementImage.getAttribute('src');

            elementTitle = divParent.querySelector('#element-title');
            selectedElementTitle = elementTitle.innerText;

            modalTitle.innerText = selectedElementTitle;
            modalImage.setAttribute('src', selectedElementImage);
            
            addComment.value = "";

        }
        
        // console.log("Button: ");
        // console.log(button);
        // console.log("DivButtonParent: ");
        // console.log(divParent);
        // console.log(elementImage);
        // console.log(modalImage);
        // console.log(selectedElementTitle);
        // console.log(modalTitle);
    });

    modal.addEventListener('shown.bs.modal', function () {
        console.log("Modal is visible");

        const options = { once: true };

        // Close modal and clear text from inputs
        var closeBtn = modal.querySelector('.btn-close');
        closeBtn.addEventListener('click', function () {
            console.log("Close clicked");

            var addComment = modal.querySelector('#add-comment-input');
            addComment.value = "";

        }, options);

        // Close modal and clear text from inputs
        var cancelButton = modal.querySelector('#modal-cancel-btn');
        cancelButton.addEventListener('click', function () {
            console.log("Cancel clicked");

            var addComment = modal.querySelector('#add-comment-input');
            addComment.value = "";

        }, options);

        var saveButton = modal.querySelector('#modal-save-btn');
        saveButton.addEventListener('click', function () {
            console.log("Save clicked");

            var addCommentInput = modal.querySelector('#add-comment-input');
            var elementComment = addCommentInput.value;

            if ((button.getAttribute('id') == "edit-comment-btn") && elementComment !== "") {
                var getCommentId = firstDivParent.querySelector('#comment-id');
                // console.log("Get CommentId: ");
                // console.log(getCommentId);
    
                var commentId = getCommentId.innerText;
                // console.log("CommentId: ");
                // console.log(commentId);

                if (commentId !== "") {
                    updateComment(elementComment, commentId);

                    elementComment.value = "";
                }

            } else if (elementComment !== "") {
                var getElementId = divParent.querySelector('#element-id');
                // console.log("Get ElementId: ");
                // console.log(getElementId);
    
                var elementId = getElementId.innerText;
                // console.log("ElementId: ");
                // console.log(elementId);

                addComment(elementComment, elementId);

                elementComment.value = "";
            }

            // console.log(elementComment);
            
        }, options);
    });

    getLoggedUser();
    getAllElements();
});
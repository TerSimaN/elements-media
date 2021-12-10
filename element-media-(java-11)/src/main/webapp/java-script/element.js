$(document).ready(function () {
    console.log("HTML Ready");

    const catApiBaseURL = "https://thatcopy.pw/";
    const defaultImage = "images/NoSign.png";

    let elements = [];
    let loggedUser;

    function getElementById (params = {}, id = 0) {
        const data = {...params};
        const catApiRoute = "catapi/restId/";

        $.ajax({

            method: "GET",
            url: `${catApiBaseURL}${catApiRoute}${id}`,
            data

        }).done(response => {

            elements = response;
            showImage();

        }).fail(response => {
            console.log(response);
        }).always(() => {
            console.log("ajax completed successfuly");
        });
    }

    function getAllImages() {
        for (let id = 1; id < 59; id++) {
            getElementById(elements, id);
        }
    }

    function getAllElements() {
        
        $.ajax({

            method: "GET",
            url: "/element/all"

        }).done(function (data) {

            data.forEach(function (element) {
                showElementItem(element.imageAddress, element.title, element.description, element.rating, element.id, element.user.id);
            });

        }).fail(function () {
            alert("ERROR: Elements failed to load!");
        });

    }

    function addElement(elementImage, elementTitle, elementDescription, elementRating) {
        
        $.ajax({

            method: "POST",
            url: "/element/add",
            data: {
                imageAddress: elementImage,
                title: elementTitle,
                description: elementDescription,
                rating: elementRating
            }

        }).done(function (data) {

            if (data.includes("ERROR:")) {
                alert(data);
            } else {
                showElementItem(elementImage, elementTitle, elementDescription, elementRating, data);
                window.location.reload();
            }

        }).fail(function () {
            alert("ERROR: Something has gone wrong!");
        });

    }

    function updateElement(elementImage, elementTitle, elementDescription, elementRating, elementId) {
        
        $.ajax({

            method: "PUT",
            url: "/element/update",
            data: {
                imageAddress: elementImage,
                title: elementTitle,
                description: elementDescription,
                rating: elementRating,
                element_id: elementId
            }

        }).done(function (data) {
            
            switch (data) {
                case 200:
                    alert("Element updated successfuly!");
                    window.location.reload();
                    break;
    
                case 401:
                    window.location.replace("index.html");
                    break;
    
                case 403:
                    alert("ERROR! ERROR! ACCESS IS FORBIDDEN!");
                    break;
    
                case 404:
                    alert("Did not find element!");
                    break;
            }

        }).fail(function () {
            alert("Element update has failed...");
        });

    }

    function deleteElement(element, elementId) {
        
        $.ajax({

            method: "DELETE",
            url: "/element/delete",
            data: {
                id: elementId
            }

        }).done(function (data) {

            // console.log("Delete returned: " + data);
            switch (data) {
                case 200:
                    element.remove();
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
                    alert("Did not find the selected element!");
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

    function showImage() {
        $imageList = $('#image-list-selector');

        const $listTemplateView = getImageTemplateView(elements);
        $imageList.append($listTemplateView);
    }

    function getImageTemplateView(element = []) {
        const $imageElementTemplate = $($('#button-image-clone').html());
        const image = (element.id < 59) ? element.url : defaultImage;
        $imageElementTemplate.find('#button-image').attr('src', image);

        return $imageElementTemplate;
    }

    function showElementItem(elementImage, elementTitle, elementDescription, elementRating, elementId, userId) {
        // console.log("Element ID: " + elementId);
        // console.log("User ID: " + userId);

        $elementItems = $('#element-item-list');

        const $elementTemplateView = getElementTemplateView(elementImage, elementTitle, elementDescription, elementRating, elementId);

        if (loggedUser == userId) {
            $elementTemplateView.find('#delete-btn').click(function () {
                // console.log("Delete btn clicked!");
                deleteElement($elementTemplateView, elementId);
            });
        } else {
            // console.log(loggedUser);
            $elementTemplateView.find('#delete-btn').hide();
            $elementTemplateView.find('#edit-btn').hide();
        }

        $elementItems.append($elementTemplateView);
    }

    function getElementTemplateView(elementImage = "...", elementTitle = "Title", elementDescription = "Description", elementRating = 0, elementId) {
        const $elementTemplate = $($('#element-item-clone').html());

        $elementTemplate.find('#item-image').attr('src', elementImage);
        $elementTemplate.find('#item-title').text(elementTitle);
        $elementTemplate.find('#item-description').text(elementDescription);
        $elementTemplate.find('#item-rating').text(elementRating);
        $elementTemplate.find('#element-id').text(elementId);

        return $elementTemplate;
    }

    var modal = document.getElementById('staticBackdrop');
    var clickedButton;
    var buttonParent;
    var divParent;
    var selectedItemId;
    
    modal.addEventListener('show.bs.modal', function (modalShowEvent) {
        console.log("Start showing modal");

        clickedButton = modalShowEvent.relatedTarget;
        
        var modalImage = modal.querySelector('#selected-element-image');
        var addTitle = modal.querySelector('#add-title-input');
        var addDescription = modal.querySelector('#add-description-input');
        var addRating = modal.querySelector('#add-rating-select');
        
        if (clickedButton.getAttribute('id') == "edit-btn") {

            buttonParent = clickedButton.parentElement;
            divParent = buttonParent.parentElement;

            var itemImage = divParent.querySelector('#item-image');
            var selectedItemImage = itemImage.getAttribute('src');

            var itemTitle = divParent.querySelector('#item-title');
            var selectedItemTitle = itemTitle.innerText;
            
            var itemDescription = divParent.querySelector('#item-description');
            var selectedItemDescription = itemDescription.innerText;

            var itemRating = divParent.querySelector('#item-rating');
            var selectedItemRating = itemRating.innerText;

            var itemId = divParent.querySelector('#element-id');
            selectedItemId = itemId.innerText;

            modalImage.setAttribute('src', selectedItemImage);
            addTitle.value = selectedItemTitle;
            addDescription.value = selectedItemDescription;
            addRating.value = selectedItemRating;

        } else {

            // Get the image of the clicked Image Button
            var buttonImage = clickedButton.querySelector('#button-image');
            var selectedButtonImage = buttonImage.getAttribute('src');

            // Set the modal image from the button image
            modalImage.setAttribute('src', selectedButtonImage);

            addTitle.value = "";
            addDescription.value = "";
            addRating.value = 1;

        }

        // console.log(buttonParent);
        // console.log(divParent);
        // console.log(selectedItemImage);
        // console.log(selectedItemTitle);
        // console.log(selectedItemDescription);
        // console.log(selectedItemRating);
        
    });

    modal.addEventListener('shown.bs.modal', function () {
        console.log("Modal is visible");

        const options = { once: true };

        // Close modal and clear text from inputs
        var closeBtn = modal.querySelector('.btn-close');
        closeBtn.addEventListener('click', function () {
            console.log("Close clicked");

            var addTitle = modal.querySelector('#add-title-input');
            addTitle.value = "";

            var addDescription = modal.querySelector('#add-description-input');
            addDescription.value = "";
            
            var addRating = modal.querySelector('#add-rating-select');
            addRating.value = 1;

        }, options);

        // Close modal and clear text from inputs
        var cancelButton = modal.querySelector('#modal-cancel-btn');
        cancelButton.addEventListener('click', function () {
            console.log("Cancel clicked");

            var addTitle = modal.querySelector('#add-title-input');
            addTitle.value = "";

            var addDescription = modal.querySelector('#add-description-input');
            addDescription.value = "";

            var addRating = modal.querySelector('#add-rating-select');
            addRating.value = 1;

        }, options);

        // Send text from inputs to DB and close modal
        var saveButton = modal.querySelector('#modal-save-btn');
        saveButton.addEventListener('click', function () {
            console.log("Save clicked");

            var modalImage = modal.querySelector('#selected-element-image');
            var elementImage = modalImage.getAttribute('src');

            var addTitleInput = modal.querySelector('#add-title-input');
            var elementTitle = addTitleInput.value;

            var addDescriptionInput = modal.querySelector('#add-description-input');
            var elementDescription = addDescriptionInput.value;

            var addRatingSelect = modal.querySelector('#add-rating-select');
            var elementRating = addRatingSelect.value;

            if ((clickedButton.getAttribute('id') == "edit-btn") && elementImage !== "" && elementTitle !== "" && elementDescription !== "" && elementRating !== 0 && selectedItemId !== "") {
                
                // console.log("Update button clicked!");
                updateElement(elementImage, elementTitle, elementDescription, elementRating, selectedItemId);

                addTitleInput.value = "";
                addDescriptionInput.value = "";
                addRatingSelect.value = 1;
    
            } else if (elementImage !== "" && elementTitle !== "" && elementDescription !== "") {

                addElement(elementImage, elementTitle, elementDescription, elementRating);

                addTitleInput.value = "";
                addDescriptionInput.value = "";
                addRatingSelect.value = 1;
            }
            
            // console.log(elementImage);
            // console.log(elementTitle);
            // console.log(elementDescription);
            // console.log(elementRating);
            
        }, options);
    });

    getLoggedUser();
    getAllImages();
    getAllElements();
});
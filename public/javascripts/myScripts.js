$(function () {
    //Materialize Inits
    $(".button-collapse").sideNav();
    $('.modal').modal();


    // My scripts
    $("#login-form").submit(function (e) {
        e.preventDefault();

        var username = $('#login-username').val();
        var password = $('#login-password').val();

        if (!username.trim() || !password.trim()) {
            // data is null or empty
            $('#login-message').show().removeClass('hide');
            $('#login-message span').text('Please fill out all fields!');
            return false;
        } else {
            $('#login-message').hide().addClass('hide');
        };

        $.ajax({
            url: "/login",
            type: "POST",
            data: $("#login-form").serialize(),
            dataType: "json",
            success: function (resData) {
                if (resData.success == true) {
                    $('#login-message')
                        .addClass('green-text')
                        .removeClass('red-text hide');

                    var count = 3;
                    var myInterval = setInterval(function () {
                        if (count == 0) {
                            clearInterval(myInterval);
                            location.reload();
                        };
                        $('#login-message')
                            .show()
                            .text(resData.message + ' Back to homepage in ' + count + ' seconds!');
                        count--;
                    }, 1000);
                } else {
                    $('#login-message')
                        .show()
                        .text(resData.message)
                        .addClass('red-text')
                        .removeClass('green-text hide');
                    return false;
                }

                //location.reload();
            }
        });

    });


    $("#new-post").submit(function (e) {
        e.preventDefault();

        var formData = new FormData();
        var title = $('#post-title').val().trim();
        var content = $('#post-content').val().trim();
        var image = $('#post-image').prop('files')[0];

        if (!title.trim() || !content.trim() || !image) {
            // data is null or empty or input image is empty
            $('#post-message span').text('Please fill out all fields!');
            $('#post-message').show().removeClass('hide');
            return false;
        } else {
            $('#post-message').hide().addClass('hide');
        };

        var imageName = getTime() + '-' + image.name;
        //console.log(imageName);

        formData.append('title', title);
        formData.append('content', content);
        formData.append('image', image, imageName);

        $.ajax({
            url: "/add-post",
            type: "POST",
            data: formData,
            processData: false,
            contentType: false,
            success: function(data){
                if (data.success == true) {
                    location.reload();
                } else {
                    alert('Action fail!');
                }
            }
        });
    });
});
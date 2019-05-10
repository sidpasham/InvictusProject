$(document).ready(function () {

    getAdminNotice("#form-adminnotice");

    //get categories
    getcategorieswithjson();

    //***************************************************************************************************************************************************************
    //Load Menu for Admin.html
    $("#adminmenu").load("IVI_Menu.html #menu");
    $("#adminfooter").load("IVI_Menu.html #footer");

    //***************************************************************************************************************************************************************

    $('#AdminAddUser').on('hidden.bs.modal', function (e) {
        $('#createusermodalbody').find('input').val('').end();
        $('#AdminAddUser').removeData('bs.modal');
    });

    $('#AddCategories').on('hidden.bs.modal', function (e) {
        $('#createcatmodalbody').find('input').val('').end();
        $('#AddCategories').removeData('bs.modal');
        $("#selectcategoriesadd").prop('selectedIndex', 0);
    });

    //***************************************************************************************************************************************************************
    /* Add Category form validation */
    $('.addcategory-form input[type="text"]').on('focus', function () {
        $(this).removeClass('input-error');
    });

    //create a category by admin and update db with category details
    $('#btnaddcategory').click(function () {

        if (formvalidation('.addcategory-form')) {
            $.ajax({
                url: 'api/posts/addCategory?CategoryName=' + $('#form-addcategory').val(),
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + sessionStorage.getItem('accessToken')
                },
                success: function () {
                    $('#AddCategories').modal('toggle');
                    $('#divErrorText').text("Category Added Successfully.");
                    $('#divError').show('fade');
                },
                error: function (jqXHR) {
                    getError(jqXHR);
                }
            });
        };
    });

    //***************************************************************************************************************************************************************
    /*Update Notice form validation */
    $('.adminviewnotice-form input[type="text"], .form-adminviewnotice textarea').on('focus', function () {
        $(this).removeClass('input-error');
    });

    //Update Notice by admin and update the AdminData.xml file with Notice details
    $('#btnupdateadminnotice').click(function () {

        if (formvalidation('.adminviewnotice-form')) {
            $.ajax({
                url: 'api/posts/updateNotice?notice=' + $('#form-adminnotice').val(),
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + sessionStorage.getItem('accessToken')
                },
                success: function () {
                    $('#Adminviewnotice').modal('toggle');
                    $('#divErrorText').text("Admin Notice Added Successfully.");
                    $('#divError').show('fade');
                },
                error: function (jqXHR) {
                    getError(jqXHR);
                }
            });
        };
    });

    //***************************************************************************************************************************************************************
    /* Add User By Admin form validation */
    $('.adduseradmin-form input[type="text"], .adduseradmin-form input[type="password"]').on('focus', function () {
        $(this).removeClass('input-error');
    });

    //create user by admin and update db with category details
    $('#btnadminadduser').click(function () {

        if (formvalidation('.adduseradmin-form')) {
            $.ajax({
                url: '/api/account/register',
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + sessionStorage.getItem('accessToken')
                },
                data: {
                    email: $('#form-adminemail').val(),
                    password: $('#form-adminpassword').val(),
                    confirmPassword: $('#form-adminconfirmpassword').val()
                },
                success: function () {
                    $('#AdminAddUser').modal('toggle');
                    $('#divErrorText').text("User Added Successfully. Please Use Credentials to Login and continue..");
                    $('#divError').show('fade');
                },
                error: function (jqXHR) {
                    getError(jqXHR);
                }
            });
        };

    });

    //***************************************************************************************************************************************************************
    /* Delete Post By Admin form validation */
    $('.adduseradmin-form input[type="text"], .adduseradmin-form input[type="password"]').on('focus', function () {
        $(this).removeClass('input-error');
    });

    //create user by admin and update db with category details
    $('#btnadminadduser').click(function () {

        if (formvalidation('.adduseradmin-form')) {
            $.ajax({
                url: '/api/account/register',
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + sessionStorage.getItem('accessToken')
                },
                data: {
                    email: $('#form-adminemail').val(),
                    password: $('#form-adminpassword').val(),
                    confirmPassword: $('#form-adminconfirmpassword').val()
                },
                success: function () {
                    $('#AdminAddUser').modal('toggle');
                    $('#divErrorText').text("User Added Successfully. Please Use Credentials to Login and continue..");
                    $('#divError').show('fade');
                },
                error: function (jqXHR) {
                    getError(jqXHR);
                }
            });
        };

    });

    //***************************************************************************************************************************************************************
    //Logout
    $('#btnlogout').click(function () {
        //externalLogout();

        $.ajax({
            url: 'api/Account/Logout',
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + sessionStorage.getItem('accessToken')
            },
            success: function () {
                sessionStorage.removeItem('accessToken');
                window.location.href = 'LoginPage.html';
            },
            error: function (jqXHR) {
                getError(jqXHR);
            }
        });
    });

    //***************************************************************************************************************************************************************

});

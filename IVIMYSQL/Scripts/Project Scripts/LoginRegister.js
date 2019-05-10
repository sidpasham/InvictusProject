/// <reference path="SocialAuth.js" />
jQuery(document).ready(function () {

    //Load Menu and footer for Login.html
    $("#loginfooter").load("IVI_Menu.html #footer");

    //Load Menu and footer for Register.html
    $("#registerfooter").load("IVI_Menu.html #footer");

    getAccessToken();

    //***************************************************************************************************************************************************************
    //Register Page
    $('#btnLoginRegister').click(function () {
        window.location.href = 'RegisterPage.html';
    });

    //login label
    $('#btnRegisterLogin').click(function () {
        window.location.href = 'LoginPage.html';
    });

    //***************************************************************************************************************************************************************
    //google login
    $('#btnGoogleLogin').click(function () {
        //window.location.href = '/api/Account/ExternalLogin?provider=Google&response_type=token&client_id=self&redirect_uri=http%3A%2F%2Flocalhost%3A55502%2FLoginPage.html&state=vbCRLXXtteUUoxsgscVCwHTquiMhyxtHtuQMgMPC5rI1';
        window.location.href = '/api/Account/ExternalLogin?provider=Google&response_type=token&client_id=self&redirect_uri=http%3A%2F%2Fiviteam.org%2FLoginPage.html&state=vbCRLXXtteUUoxsgscVCwHTquiMhyxtHtuQMgMPC5rI1';
        //getAccesToken();
    });

    //facebook login
    $('#btnfacebookLogin').click(function () {
        window.location.href = '/api/Account/ExternalLogin?provider=Facebook&response_type=token&client_id=self&redirect_uri=http%3A%2F%2Fiviteam.org%2FLoginPage.html&state=vbCRLXXtteUUoxsgscVCwHTquiMhyxtHtuQMgMPC5rI1';
        //getAccesToken();
    });

    //***************************************************************************************************************************************************************
    $('#form-password,#form-username').keypress(function (e) {
        var key = e.which;
        if (key == 13) {
            $('#btnLogin').click();
            return false;
        }
    });
    $('#form-security-question').keypress(function (e) {
        var key = e.which;
        if (key == 13) {
            $('#btnregister').click();
            return false;
        }
    });

    //***************************************************************************************************************************************************************
    /* Login form validation */
    $('.login-form input[type="text"], .login-form input[type="password"], .login-form textarea').on('focus', function () {
        $(this).removeClass('input-error');
    });

    $('#btnLogin').click(function () {

        if (formvalidation('.login-form')) {
            $(".overlay").show();

            //ajax call to validate user
            $.ajax({
                url: '/token',
                method: 'POST',
                contentType: 'application/json',
                data: {
                    username: $('#form-username').val(),
                    password: $('#form-password').val(),
                    grant_type: 'password'
                },
                success: function (response) {
                    sessionStorage.setItem('accessToken', response.access_token);
                    sessionStorage.setItem('username', response.userName);
                    if (response.userName.toLowerCase() == "admin@invictusinstitute.org") {
                        window.location.href = 'AdminPage.html';
                    }
                    else {
                        window.location.href = 'Posts.html'
                    }
                },
                error: function (jqXHR) {
                    $(".overlay").hide();
                    getError(jqXHR, "#divErrorText", "#divError");
                }
            });
        };
    });

    //***************************************************************************************************************************************************************
    /* Registration form validation */
    $('.registration-form input[type="text"], input[type="password"], .registration-form textarea').on('focus', function () {
        $(this).removeClass('input-error');
    });

    //register user and redirect to login page automatically
    $('#btnregister').click(function () {

        if (formvalidation('.registration-form')) {
            $(".overlay").show();

            $.ajax({
                url: '/api/account/register',
                method: 'POST',
                data: {
                    email: $('#form-email').val(),
                    password: $('#form-password').val(),
                    confirmPassword: $('#form-confirm-password').val(),
                    SecurityQuestion: $('#selectsecurityquestions option:selected').val(),
                    SecurityAnswer: $('#form-security-question').val()
                },
                success: function () {
                    $(".overlay").hide();
                    $('#divErrorText').text("Registration Successfull. Please Login to continue..");
                    $('#divError').show('fade');
                    window.location.href = 'LoginPage.html';
                },
                error: function (jqXHR) {
                    $(".overlay").hide();
                    getError(jqXHR, "#divErrorText", "#divError");
                }
            });
        };

    });

    //***************************************************************************************************************************************************************
    /* Forgot Password form validation */
    $('.forgotpassword-form input[type="text"], input[type="password"], .forgotpassword-form textarea').on('focus', function () {
        $(this).removeClass('input-error');
    });

    //register user and redirect to login page automatically
    $('#btnforgotpasswordnext').click(function () {

        $('#divErrorTextModalFP').val('');
        $('#divErrorTextModalSQ').val('');

        if (formvalidation('.forgotpassword-form')) {
            $(".overlay").show();
            $('#forgotpasswordmodal').fadeOut(1);

            $.ajax({
                url: 'api/Account/GetSecurityQuestion?useremail=' + $('#form-forgotpasswordemail').val(),
                method: 'GET',
                success: function (response) {
                    $(".overlay").hide();

                    if (response != null && response != "") {
                        $('#forgotpasswordmodal').modal('toggle');
                        $('#securityquestionmodal').modal('show');
                        $("#divsecurityquestion").text(response);
                    }
                    else {
                        $('#forgotpasswordmodal').fadeIn(1);
                        $('#divErrorTextModalFP').text("Email is not Found. Please Enter Correct Email or Register with New Email");
                        $('#divErrorFP').show('fade');
                    }

                },
                error: function (jqXHR) {
                    $(".overlay").hide();
                    $('#forgotpasswordmodal').modal('show');
                    getError(jqXHR, "#divErrorTextModalFP", "#divErrorFP");
                }
            });
        };

    });

    //***********************************************************************************************************************************************************************
    /* Security Question form validation */
    $('.securityquestion-form input[type="text"], input[type="password"], .securityquestion-form textarea').on('focus', function () {
        $(this).removeClass('input-error');
    });
    //register user and redirect to login page automatically
    $('#btnsecurityquestion').click(function () {
        $('#divErrorTextModalSQ').val('');
        $('#divErrorSQ').hide();

        if (formvalidation('.securityquestion-form')) {
            $('#securityquestionmodal').modal('toggle');
            $('#ResetPasswordmodal').modal('show');
        };

    });

    //***********************************************************************************************************************************************************************
    /* Reset Password form validation */
    $('.ResetPasswordmodalform input[type="text"], input[type="password"], .ResetPasswordmodalform textarea').on('focus', function () {
        $(this).removeClass('input-error');
    });
    //register user and redirect to login page automatically
    $('#btnresetpassword').click(function () {
        $('#divErrorTextModalSQ').val('');
        $('#divErrorSQ').hide();

        if (formvalidation('.ResetPasswordmodalform')) {
            $(".overlay").show();
            $('#ResetPasswordmodal').fadeOut(1);

            $.ajax({
                url: 'api/Account/ResetPassword',
                method: 'POST',
                data: {
                    Email: $('#form-forgotpasswordemail').val(),
                    SecurityAnswer: $('#form-securityanswer').val(),
                    NewPassword: $('#form-resetnewpassword').val(),
                    ConfirmPassword: $('#form-resetconfirmnewpassword').val()
                },
                success: function () {
                    $(".overlay").hide();
                    $('#ResetPasswordmodal').modal('toggle');
                    $('#divErrorText').text("Password Changed Successfully. Please Login to continue..");
                    $('#divError').show('fade');
                },
                error: function (jqXHR) {
                    $(".overlay").hide();
                    $('#ResetPasswordmodal').modal('toggle');
                    $('#securityquestionmodal').modal('show');
                    getError(jqXHR, "#divErrorTextModalSQ", "#divErrorSQ");
                }
            });
        };

    });

    //***************************************************************************************************************************************************************
    $('#linkforgortpassword').click(function () {
        $('#divErrorTextModalFP').val('');
        $('#divErrorFP').hide();
        $('#divErrorTextModalSQ').val('');
        $('#divErrorSQ').hide();
        $('#form-forgotpasswordemail').val('');
        $('#form-securityanswer').val('');
        $('#form-resetnewpassword').val('');
        $('#form-resetconfirmnewpassword').val('');
    });

    $('#btnforgotpasswordback').click(function () {
        $('#divErrorTextModalFP').val('');
        $('#divErrorFP').hide();
    });

    $('#btnsecurityquestionback').click(function () {
        $('#divErrorTextModalSQ').val('');
        $('#divErrorSQ').hide();
    });
    //***************************************************************************************************************************************************************
});

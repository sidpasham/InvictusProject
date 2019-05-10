
/* Fullscreen background */
$.backstretch("Images/1.jpg");

//***************************************************************************************************************************************************************
//Enter event when on Confirm password text
$('#form-confirmnewpassword').keypress(function (e) {
    var key = e.which;
    if (key == 13) {
        $('#btnchangepassword').click();
        return false;
    }
});

//***************************************************************************************************************************************************************
/* Change Password form validation */
$('.changepassword-form input[type="password"]').on('focus', function () {
    $(this).removeClass('input-error');
});

//create a category and update db with category details
$(document).on('click','#btnchangepassword',function(e){
//$('#btnchangepassword').click(function () {

    if (formvalidation('.changepassword-form')) {
        $.ajax({
            url: 'api/Account/ChangePassword',
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + sessionStorage.getItem('accessToken')
            },
            data: {
                OldPassword: $('#form-oldpassword').val(),
                NewPassword: $('#form-newpassword').val(),
                ConfirmPassword: $('#form-confirmnewpassword').val()
            },
            success: function () {
                $('#opensettingsmodal').modal('toggle');
                $('#divErrorText').text("Your Password has been Sucessfully Changed.");
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
$(document).on('click', '#btnlogout', function (e) {
    //$('#btnlogout').click(function () {
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
//default values in modals
$('#opensettingsmodal').on('hidden.bs.modal', function (e) {
    $('#settingsmodalbody').find('input').val('').end();
    $('#opensettingsmodal').removeData('bs.modal');
});

//***************************************************************************************************************************************************************
//error label
$(document).on('click', '#linkClose', function (e) {
//$('#linkClose').click(function () {
    $('#divError').hide('fade');
});

    //error label
$(document).on('click', '#closenotice', function (e) {
//$('#closenotice').click(function () {
    $('#adminnotice').hide('fade');
});

//----------------------------------------------------------------------FUNCTIONS-------------------------------------------------------------------
//***************************************************************************************************************************************************************
function getAccessToken() {
    if (location.hash) {
        if (location.hash.split('access_token=')) {
            var accessToken = location.hash.split('access_token=')[1].split('&')[0];
            if (accessToken) {
                isUserRegistered(accessToken);
            }
        }
    }
};

//***************************************************************************************************************************************************************
//Populate Admin Controls before Main Table with input as Json Object
function getcategorieswithjson() {

    $.ajax({
        url: '/api/categories',
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + sessionStorage.getItem('accessToken')
        },
        success: function (data) {
            $.each(data, function (index, value) {
                $('#selectcategoriespost').append($('<option>', {
                    value: value.CategoriesId,
                    text: value.CategoryName
                }));
                $('#selectcategoriesadd').append($('<option>', {
                    value: value.CategoriesId,
                    text: value.CategoryName
                }));
            });
        },
        error: function (jqXHR) {
            getError(jqXHR);
        }
    });
};


//***************************************************************************************************************************************************************
//get Admin Notice
function getAdminNotice(divelementid) {

    $.ajax({
        url: '/api/posts/getAdminNotice',
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + sessionStorage.getItem('accessToken')
        },
        success: function (data) {
            $(divelementid).text(data);
        },
        error: function (jqXHR) {
            getError(jqXHR);
        }
    });
};

//***************************************************************************************************************************************************************
function isUserRegistered(accessToken) {
    $.ajax({
        url: 'api/Account/UserInfo',
        method: 'GET',
        headers: {
            'content-type': 'application/JSON',
            'Authorization': 'Bearer ' + accessToken
        },
        success: function (response) {
            if (response.HasRegistered) {
                sessionStorage.setItem('accessToken', accessToken);
                sessionStorage.setItem('username', response.Email);
                window.location.href = 'Posts.html';
            }
            else {
                signupExternalUser(accessToken, response.LoginProvider);
            }
        },
        error: function (jqXHR) {
            getError(jqXHR);
        }
    });
};

//***************************************************************************************************************************************************************
function signupExternalUser(accessToken, provider) {
    $.ajax({
        url: 'api/Account/RegisterExternal',
        method: 'POST',
        headers: {
            'content-type': 'application/JSON',
            'Authorization': 'Bearer ' + accessToken
        },
        success: function (response) {
            window.location.href = '/api/Account/ExternalLogin?provider=' + provider + '&response_type=token&client_id=self&redirect_uri=http%3A%2F%2Fiviteam.org%2FLoginPage.html&state=vbCRLXXtteUUoxsgscVCwHTquiMhyxtHtuQMgMPC5rI1';
        },
        error: function (jqXHR) {
            getError(jqXHR);
        }
    });
};

//***************************************************************************************************************************************************************
//form validation function
function formvalidation(classname) {
    var isvalidated = false;
    $(classname).find('input[type="text"], input[type="password"], textarea').each(function () {

        if ($(this).val() == "") {
            $(this).addClass('input-error');
            isvalidated = false;
        }
        else {
            //remove error class
            $(this).removeClass('input-error');
            isvalidated = true;
        }
    });
    return isvalidated;
};

//***************************************************************************************************************************************************************
//pagination
function addpaginationtotable(table, tbody) {

    $("#pagination").remove();
    $(table).after('<div id="pagination"></div>');
    var rowsShown = 15;
    var rowsTotal = $(table + ' ' + tbody + ' tr').length;
    var numPages = rowsTotal / rowsShown;
    for (i = 0; i < numPages; i++) {
        var pageNum = i + 1;
        $('#pagination').append('<ul class="pagination"><li  rel="' + i + '"><a href="#">' + pageNum + '</a></li></ul> ');
    }
    $(table + ' ' + tbody + ' tr').hide();
    $(table + ' ' + tbody + ' tr').slice(0, rowsShown).show();
    $('#pagination li:first').addClass('active');
    $('#pagination li').bind('click', function () {

        $('#pagination li').removeClass('active');
        $(this).addClass('active');
        var currPage = $(this).attr('rel');
        var startItem = currPage * rowsShown;
        var endItem = startItem + rowsShown;
        $(table + ' ' + tbody + ' tr').css('opacity', '0.0').hide().slice(startItem, endItem).
        css('display', 'table-row').animate({ opacity: 1 }, 300);
    });
};

//***************************************************************************************************************************************************************
//format JSON Date
function formatDate(date) {

    var today = new Date(date);
    var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
    var monthnum = today.getMonth();
    var monthname = monthNames[monthnum];
    var day = today.getDate();
    var year = today.getFullYear();
    var hh = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    var dd = "AM";
    var h = hh;
    if (h >= 12) {
        h = hh - 12;
        dd = "PM";
    }
    if (h == 0) {
        h = 12;
    }
    m = m < 10 ? "0" + m : m;

    s = s < 10 ? "0" + s : s;

    h = h < 10 ? "0" + h : h;

    return monthname + "-" + day + "-" + year + " " + h + ":" + m + ":" + s + " " + dd;
};



//***************************************************************************************************************************************************************
//error function
function getError(jqXHR, errordivtext, errordiv) {
    var errors = $.map(jqXHR.responseJSON, function (item) { return item });

    if (jqXHR.status == "401") {
        alert("Session Has Expired. Due to Security Issues, we Logged you out. Please Login Back.");
        window.location.href = 'LoginPage.html';
    }
    else {
        if (jqXHR.responseJSON.error_description != null) {
            $(errordivtext).text(jqXHR.responseJSON.error_description);
            $(errordiv).show('fade');
        }
        else {
            $(errordivtext).text(jqXHR.responseText);
            $(errordiv).show('fade');
        }
    }
};

//***************************************************************************************************************************************************************
//error function
//function getError(jqXHR) {

//    if (jqXHR.status == "401") {
//        alert("Session Has Expired. Due to Security Issues, we Logged you out. Please Login Back.");
//        window.location.href = 'LoginPage.html';
//    }
//    else {
//        if (jqXHR.responseJSON.error_description != null) {
//            $('#divErrorText').text(jqXHR.responseJSON.error_description);
//            $('#divError').show('fade');
//        }
//        else {
//            alert(jqXHR.responseText);
//        }
//    }
//};
//***************************************************************************************************************************************************************

$(document).ready(function () {

    //Load Menu for Post.html
    $("#postsmenu").load("IVI_Menu.html #menu");
    $("#postsfooter").load("IVI_Menu.html #footer");

    //***************************************************************************************************************************************************************
    var postid = 0;
    var today = new Date();
    var todaydate = formatDate(today);

    //***************************************************************************************************************************************************************
    //Enter Event
    $('#txtsearchpost').keypress(function (e) {
        var key = e.which;
        if (key == 13) {
            $('#btnsearchpost').click();
            return false;
        }
    });

    //***************************************************************************************************************************************************************
    //validate user with accesstoken and display all posts
    if (sessionStorage.getItem('accessToken') == null) {
        window.location.href = 'LoginPage.html'
    }
    else if (sessionStorage.getItem('accessToken') != null && sessionStorage.username.toLowerCase() != "admin@invictusinstitute.org") {

        $.ajax({
            url: '/api/posts',
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + sessionStorage.getItem('accessToken')
            },
            success: function (data) {

                //get categories
                getcategorieswithjson();

                var username = sessionStorage.getItem('username');
                if (username != null && username.indexOf('@')) {
                    username = sessionStorage.getItem('username').split("@")[0];
                }

                $('#tblbody').empty();
                $('#divusername').text(((username == null) ? "" : " " + username).toUpperCase());

                //get Admin Notice
                if (username.toLowerCase() != 'admin') {
                    $("#admindiv").hide();
                    $("#adminnotice").show();
                    getAdminNotice("#divAdminNotice");
                };

                //main table
                gettablewithjson(data);

                //click event on the post title link
                $('tbody #replylink a').click(function () {
                    postid = $(this).closest('tr').find('td:first-child').text();
                    getPostById(postid);
                });

                addpaginationtotable('#tblposts', '#tblbody');

            },
            error: function (jqXHR) {
                getError(jqXHR);
            }
        });
    }

    //***************************************************************************************************************************************************************
    /* Create Post form validation */
    $('.createpost-form input[type="text"], .createpost-form textarea').on('focus', function () {
        $(this).removeClass('input-error');
    });

    //create a post and update db with post details
    $('#btncreatepostmodal').click(function () {

        if (formvalidation('.createpost-form')) {
            //var file = document.getElementById('fileUpload');
            //var uploadedfile = file.files[0];
            //var uploadedfilebytes = uploadedfile.getAsBinary();
           // var r = new FileReader();
            //r.onload = function () { alert(r.result); };
            //r.readAsBinaryString(uploadedfile);
            //var uploadedfilebytes = r.result;
            //var array = new Uint8Array(arrayBuffer),
            //binaryString = String.fromCharCode.apply(null, array);
            //reader.onload = function () {
            //}

            //get the information of file uploaded
            var datafiles = new FormData();

            var files = $("#fileUpload").get(0).files;

            // Add the uploaded image content to the form data collection
            if (files.length > 0) {
                datafiles.append("Uploadedfile", files[0]);
            }

            var reader = new FileReader();
            var fileByteArray = [];
            reader.readAsArrayBuffer(files[0]);
            reader.onloadend = function (evt) {
                if (evt.target.readyState == FileReader.DONE) {
                    var arrayBuffer = evt.target.result,
                        array = new Uint8Array(arrayBuffer);
                    for (var i = 0; i < array.length; i++) {
                        fileByteArray.push(array[i]);
                    }
                }
            }

            // Make Ajax request with the contentType = false, and procesDate = false
            $.ajax({
                url: '/api/posts/uploadfile',
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + sessionStorage.getItem('accessToken')
                },
                contentType: false,
                processData: false,
                data: datafiles,
                success: function () {
                    $('#createpostmodal').modal('toggle');
                    $('#divErrorText').text("Post Created Sucessfully.");
                },
                error: function (jqXHR) {
                    getError(jqXHR);
                }
            });


            //Create Post with all information including documents
            $.ajax({
                url: '/api/posts/createpost',
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + sessionStorage.getItem('accessToken')
                },
                data: {
                    PostAuthor: sessionStorage.getItem('username').split("@")[0],
                    PostTitle: $('#form-posttitle').val(),
                    PostCategoryId: $('#selectcategoriespost option:selected').val(),
                    PostDescription: $('#form-postdescription').val(),
                    PostDate: todaydate
                },
                success: function () {
                    $('#createpostmodal').modal('toggle');
                    $('#divErrorText').text("Post Created Sucessfully.");
                    $('#divError').show('fade');
                },
                error: function (jqXHR) {
                    getError(jqXHR);
                }
            });
        };

    });

    //***************************************************************************************************************************************************************
    /* Add reply form validation */
    $('.form-openpost input[type="text"], .form-controlpostreply textarea').on('focus', function () {
        $(this).removeClass('input-error');
    });

    //add reply to post and update db with post reply details
    $('#btnreplypostmodal').click(function () {

        if (formvalidation('.form-openpost')) {

            $.ajax({
                url: '/api/posts/ReplyPost',
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + sessionStorage.getItem('accessToken')
                },
                data: {
                    postid: postid,
                    postauthor: sessionStorage.getItem('username').split("@")[0],
                    postdescription: $('#form-postreply').val(),
                    postdate: todaydate
                },
                success: function () {
                    $('#form-postreply').val('');
                    getPostById(postid);
                },
                error: function (jqXHR) {
                    getError(jqXHR);
                }
            });
        };
    });

    //***************************************************************************************************************************************************************
    //search a post by posttitle,postdate and author
    $('#btnsearchpost').click(function () {
        searchpostby = $('#searchpostby option:selected').val();
        searchstring = $('#txtsearchpost').val();

        if (searchstring == null || searchstring == '') {
            searchstring = 'allposts';
            searchpostby = 'allposts';
        }

        $.ajax({
            url: 'api/posts/searchposts/' + searchpostby + '/' + searchstring,
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + sessionStorage.getItem('accessToken')
            },
            success: function (data) {
                $('#tblbody').empty();

                $('#divusername').text(" " + sessionStorage.getItem('username').split("@")[0].toUpperCase());

                gettablewithjson(data);

                $('tbody #replylink a').click(function () {
                    postid = $(this).closest('tr').find('td:first-child').text();
                    getPostById(postid);
                });

                addpaginationtotable('#tblposts', '#tblbody');
            },
            error: function (jqXHR) {
                getError(jqXHR);
            }
        });

    });


    //***************************************************************************************************************************************************************
    //Populate Main Table with input as Json Object
    function gettablewithjson(data) {

        //Main table headers
        var thead = '<tr style="font-weight:bold"><td>Most Recent</td><td>Author</td><td>Category</td><td>Title</td><td>Description</td><td>Replies</td></tr>';
        $('#tblbody').append(thead);

        $.each(data, function (key, value) {
            var posttitle = value.posttitle
            var postdescription = value.postdescription

            //check to populate only 100 characters if post title, description
            if (posttitle != null && posttitle.length > 100) {
                posttitle = posttitle.substring(0, 100) + "...";
            }
            if (postdescription != null && postdescription.length > 50) {
                postdescription = postdescription.substring(0, 50) + "...";
            }

            //main table
            var tr = '<tr>';
            tr += '<td  style ="display:none;">' + ((value.idposts != null) ? value.idposts : 0) + '</td>';
            tr += '<td>' + formatDate(value.postdate) + '</td>';
            tr += '<td>' + ((value.postauthor != null) ? value.postauthor.split("@")[0] : '') + '</td>';
            tr += '<td>' + ((value.postcategory != null) ? value.postcategory : '') + '</td>';
            tr += '<td id="replylink"><u><a data-toggle="modal" data-target="#openpostmodal" href="#openpostmodal">'
               + ((posttitle != null) ? posttitle : 'No Title') + '</a></u></td>';
            tr += '<td>' + ((postdescription != null) ? postdescription : '') + '</td>';
            tr += '<td>' + ((value.postreplies != null) ? value.postreplies : 0) + '</td>';
            tr += '</tr>';
            $('#tblbody').append(tr);

        });
    };

    //***************************************************************************************************************************************************************
    //call post by id
    function getPostById(postid) {

        $.ajax({
            url: '/api/posts/' + postid + '/viewpost',
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + sessionStorage.getItem('accessToken')
            },
            success: function (data) {
                $(".replypostdiv").remove();

                $.each(data, function (index, value) {

                    $('#divopenposttitle').text(((value.postcategory == null) ? "" : value.postcategory)
                        + ": " + value.posttitle);

                    $('#divopenpostdescription').html(value.postdescription);

                    $('#divopenpostedby').text(value.postauthor.split("@")[0] + "    on " + formatDate(value.postdate));

                    if (value.postreplyauthor != null && value.postreplydescription != null) {
                        $("#form-postreply").before("<div class=\"replypostdiv\" style=\"padding-left:12px; border-bottom:1px solid lightgrey;\"><div>"
                        + value.postreplydescription + "</div><div style =\"font-size:10px;\" >" + value.postreplyauthor + "  replied on "
                        + formatDate(value.postreplydate) + "</div></div>");

                    };
                });
            },
            error: function (jqXHR) {
                getError(jqXHR);
            }
        });
    };

    //***************************************************************************************************************************************************************
    //default all values in modals
    $('#createpostmodal').on('hidden.bs.modal', function (e) {
        $('#createpostmodalbody').find('textarea').val('').end();
        $('#createpostmodal').removeData('bs.modal');
        $("#selectcategoriespost").prop('selectedIndex', 0);
    });
    //***************************************************************************************************************************************************************
});
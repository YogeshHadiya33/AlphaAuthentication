AlphaLab.User = new function () {

    this.Option = {
        Table: null,
        TableId: "",
        SearchId: "",
        TableLengthId: "",
        TableLength: "",
    };

    this.Init = function (options) {
        
        AlphaLab.User.Option = $.extend({}, AlphaLab.User.Option, options);
        AlphaLab.User.Option.Table = $("#" + AlphaLab.User.Option.TableId).DataTable({
            searching: false,
            paging: true,
            serverSide: true,
            processing: true,
            bLengthChange: false,
            async: true,
            lengthMenu: [[25, 50, 100, -1], [25, 50, 100, "All"]],
            dom: '<"top"flp>rt<"row btmpage"<"col-2 lgndrp"><"col-7"i><"col-3"p>>',
            pageLength: 25, 
            ajax: {
                type: "Post",
                url: "/User/GetList",
                data: function (dtParms) {
                    dtParms.search.value = $("#" + AlphaLab.User.Option.SearchId).val();
                    dtParms.RoleId = $("#ddIndexRole").val();
                    dtParms.extra_search = $("#ddStatus").val();
                    return dtParms;
                }, 
                "complete": function (response, result) {
                    var tableBottom = $("#" + AlphaLab.User.Option.TableId + "_wrapper .btmpage").detach();
                    $("#pagenation").prepend(tableBottom);
                    $("#" + AlphaLab.User.Option.TableId + "_wrapper .top").remove();
                }
            },
            columns: [
                {
                    "data": "encryptUserMasterId", "className": "text-center col-1", orderable: false,
                    "render": function (data, type, row) {

                        let btnReset = '<a  href="javascript:void(0);" onclick="AlphaLab.User.Reset(\'' + data + '\')" class="mr-2 fs-0" title="Reset Password" style="color:#333333"><b><i class="fas fa-key resetHover" ></i></b></a>'
                        let btnEdit = '<a href="javascript:void(0);" onclick="AlphaLab.User.Add(\'' + data + '\')" class="mr-2 fs-0" title="Edit" style="color:#333333"><b><i class="far fa-edit editHover"></i></b></a>'

                        //let btnReset ='<a class="dropdown-item text-primary" href="#!" onclick="AlphaLab.User.Reset(\'' + data + '\')"><i class="fas fa-key " ></i> Reset Password</a>'
                        //let btnEdit = '<a class="dropdown-item text-success" href="#!" onclick="AlphaLab.User.Add(\'' + data + '\')"><i class="far fa-edit " ></i> Edit</a> '
                         

                        //let btnReset = '<div class="col-5"><button onclick="AlphaLab.User.Reset(\'' + data + '\')" class="btn btn-sm btn-phoenix-secondary rounded-pill me-1 mb-1" title="Reset Password" ><i class="fas fa-key " ></i></button></div>'
                        //let btnEdit = '<div class="col-5"><button onclick="AlphaLab.User.Add(\'' + data + '\')" class="btn btn-sm btn-phoenix-success rounded-pill me-1 mb-1" title="Edit" ><i class="far fa-edit " ></i> </button></div>'

                        return btnEdit+ btnReset;
                    }
                },
                { "data": "fullName", "name": "FullName", "autoWidth": true },
                {
                    "data": "roleId", "name": "RoleId", "autoWidth": true, className: "text-center col-1", render: function (data, type, row) {
                        if (data == AlphaLab.Common.Role.Administrator) {
                            return '<span class="badge badge-phoenix badge-phoenix-success" > ADMINISTRATOR </span>';
                        }
                        else if (data == AlphaLab.Common.Role.User_Admin) {
                            return '<span class="badge badge-phoenix badge-phoenix-secondary" > USER ADMIN </span>';
                        }
                        else if (data == AlphaLab.Common.Role.Operation_Admin) {
                            return '<span class="badge badge-phoenix badge-phoenix-primary " > OPERATION ADMIN </span>';
                        }
                        else if (data == AlphaLab.Common.Role.BPO) {
                            return '<span class="badge badge-phoenix badge-phoenix-info" > BPO </span>';
                        }
                        else if (data == AlphaLab.Common.Role.BpoCenter) {
                            return '<span class="badge badge-phoenix badge-brown" > BPO Center</span>';
                        }
                        else if (data == AlphaLab.Common.Role.Eligibility) {
                            return '<span class="badge badge-phoenix badge-phoenix-warning" > ELIGIBILITY </span>';
                        }
                        else if (data == AlphaLab.Common.Role.Shipping) {
                            return '<span class="badge badge-phoenix badge-cyan" > SHIPPING </span>';
                        }
                        else if (data == AlphaLab.Common.Role.Billing) {
                            return '<span class="badge badge-phoenix badge-phoenix-primary" > BILLING </span>';
                        }
                        else if (data == AlphaLab.Common.Role.QA_Admin) {
                            return '<span class="badge badge-phoenix badge-brightPurple" > QA Admin </span>';
                        }
                        else if (data == AlphaLab.Common.Role.QA_Agent) {
                            return '<span class="badge badge-phoenix badge-brightDarkYello" > QA Agent </span>';
                        }
                        else if (data == AlphaLab.Common.Role.Manual_EV) {
                            return '<span class="badge badge-phoenix badge-phoenix-secondary" > Manual EV </span>';
                        } else {
                            return '';
                        }
                    }
                },
                { "data": "bpoName", "name": "BpoName", "autoWidth": true },
                { "data": "username", "name": "Username", "autoWidth": true },
                { "data": "contactNumber", "name": "ContactNumber", "autoWidth": true },
                { "data": "lastVisitedString", "name": "LastVisited", "className": "text-center", "autoWidth": true, className: "col-1", orderable: false },

                { "data": "createdDateString", "name": "CreatedDate", "className": "text-center", "autoWidth": true, className: "col-1" },
                {
                    "data": "isActive", "name": "IsActive", "autoWidth": true, className: "text-center col-1", render: function (data, type, row) {
                        if (data) {
                            return '<span class="badge badge-phoenix  badge-phoenix-success">ACTIVE</span>';
                        } else {
                            return '<span class="badge badge-phoenix  badge-phoenix-danger">IN-ACTIVE</span>';
                        }
                    }
                },

            ],
            order: [1, "ASC"],
            language: {
                processing: '<div class="dataTableLoader"></div>'
            }
        });
         
    }

    this.Search = function () {
        AlphaLab.User.Option.Table.ajax.reload();
    }

    this.Add = function (id = '') {
        $(".preloader").show();
        $.ajax({
            type: "GET",
            url: UrlContent("User/_Details/" + id),
            success: function (data) { 
                $("#common-md-dialogContent").html(data);
                AlphaLab.Common.InitMask();
                $.validator.unobtrusive.parse($("#UserForm"));
                $("#common-md-dialog").modal('show');
                $(".preloader").hide();
                $(".select2").select2();
                $(".changeRole").trigger("change")
                $("#ddBpomasterId").trigger("change")
                $(".pwd").click(function () {
                    if ($(this).children(".svg-inline--fa").hasClass("fa-eye")) {
                        $(this).children(".svg-inline--fa").removeClass("fa-eye").addClass("fa-eye-slash");
                        $(this).next().attr("type", "text");
                    }
                    else {
                        $(this).children(".svg-inline--fa").removeClass("fa-eye-slash").addClass("fa-eye");
                        $(this).next().attr("type", "password");
                    }
                });
                 
            }
        })
    }

    this.Save = function () {
        if ($("#UserForm").valid()) {
            $(".preloader").show();
            var formdata = $("#UserForm").serialize();
            $.ajax({
                type: "Post",
                url: UrlContent("User/Save/"),
                data: formdata,
                success: function (result) {
                    $(".preloader").hide();
                    if (result.isSuccess) {
                        AlphaLab.Common.ToastrSuccess(result.message);
                        AlphaLab.User.Option.Table.ajax.reload();
                        $("#common-md-dialog").modal("hide");
                    } else {
                        AlphaLab.Common.ToastrError(result.message);
                    }
                },
            })
        }
    }

    this.Reset = function (id = '') {
        $(".preloader").show();
        $.ajax({
            type: "GET",
            url: UrlContent("User/Reset/" + id),
            success: function (data) {
                $("#common-md-dialogContent").html(data);
                $("#common-md-dialog").modal('show');
                AlphaLab.Common.InitMask();
                $.validator.unobtrusive.parse($("#UserPassword"));
                $(".preloader").hide();
                $(".pwd").click(function () { 
                    if ($(this).children(".svg-inline--fa").hasClass("fa-eye")) {
                        $(this).children(".svg-inline--fa").removeClass("fa-eye").addClass("fa-eye-slash");
                        $(this).next().attr("type", "text");
                    }
                    else {
                        $(this).children(".svg-inline--fa").removeClass("fa-eye-slash").addClass("fa-eye");
                        $(this).next().attr("type", "password");
                    }
                });
            }
        })
    }

    this.SavePassword = function () {
        if ($("#UserPassword").valid()) {
            $(".preloader").show();
            var formdata = $("#UserPassword").serialize();
            $.ajax({
                type: "Post",
                url: UrlContent("User/SaveResetPassword/"),
                data: formdata,
                success: function (result) {
                    $(".preloader").hide();
                    if (result.isSuccess) {
                        AlphaLab.Common.ToastrSuccess(result.message);
                        AlphaLab.User.Option.Table.ajax.reload();
                        $("#common-md-dialog").modal("hide");
                    } else {
                        AlphaLab.Common.ToastrError(result.message);
                    }
                },
            })
        }
    }

    this.ChangeRole = function () {
        var id = $("#ddRole").val();
        if (id == AlphaLab.Common.Role.BPO || id == AlphaLab.Common.Role.BpoCenter) //bpo role
        {
            if (id == AlphaLab.Common.Role.BPO) {
                $('#bpocenterDrpId').addClass("hide");
                $('#bpoDrpId').removeClass("hide");
            }
            else if (id == AlphaLab.Common.Role.BpoCenter) {
                $('#bpoDrpId').removeClass("hide");
                $('#bpocenterDrpId').removeClass("hide");
                AlphaLab.User.ChangeBpo();
            }
        }
        else {
            $('#bpoDrpId').addClass("hide");
            $('#bpocenterDrpId').addClass("hide");
        }
    }

    this.ChangeBpo = function () {
        var id = $("#ddRole").val()
        if (id == AlphaLab.Common.Role.BpoCenter) {
            $('#bpocenterDrpId').removeClass("hide");
            $.ajax({
                type: "POST",
                url: UrlContent("Common/GetCenterDrpList"),
                data: { id: $("#ddBpomasterId").val() },
                success: function (result) {
                    let selected = $("#ddBpocenterId").val();
                    let html = '';
                    $.each(result, function (i, row) {
                        if (selected == row.value) {
                            html += "<option value='" + row.value + "' selected>" + row.text + "</option>";
                        } else {
                            html += "<option value='" + row.value + "'>" + row.text + "</option>";
                        }
                    });
                    $("#ddBpocenterId").html(html);
                },
                error: function (textStatus, errorThrown) {
                }
            })
        }
        else {
            $('#bpocenterDrpId').addClass("hide");
        }
    }
}
AlphaLab.Leads = new function () {

    //Variable
    var SelectedRecordArray = [];

    this.Option = {
        LeadTable: null,
        LeadTableId: "",
        LeadSearchId: "",
        DrildownLeadTable: null,
        DrillDownValue1: "",
        RoleId: 0,
        CommentsListTable: null,
        AudioTable: null,
    }

    this.Init = function (options) {
        AlphaLab.Leads.Option = $.extend({}, AlphaLab.Leads.Option, options);
        AlphaLab.Leads.Option.LeadTable = $(`#${AlphaLab.Leads.Option.LeadTableId}`).DataTable(
            {
                searching: false,
                paging: true,
                serverSide: "true",
                processing: true,
                bPaginate: true,
                bLengthChange: true,
                bInfo: true,
                async: false,
                lengthMenu: [[10, 25, 50, 100, 500], [10, 25, 50, 100, 500]],
                pageLength: 100, 
                dom: '<"top"flp>rt<"row btmpage mb-1 mt-2"<"col-4 txtSearchId"><"col-2 lgndrp"><"col-2"i><"col-4"p>>',
                ajax: {
                    type: "Post",
                    url: UrlContent("Lead/GetList"),
                    data: function (dtParms) {
                        dtParms.search.value = $("#txtSearch").val();
                        dtParms.LeadsStatus = $("#hdnLeadStatus").val();
                        dtParms.EVStatus = $("#hdnEVStatus").val();
                        dtParms.ShipmentStatus = $("#hdnShipmentStatus").val();
                        dtParms.AddressStatus = $("#hdnAddressStatus").val();
                        dtParms.BPO = $("#hdnBPO").val();
                        dtParms.DateRange = $("#hdnCreatedDate").val();
                        dtParms.SNSStatus = $("#hdnSNSStatus").val();
                        dtParms.QAStatus = $("#hdnQAStatus").val();
                        dtParms.RecordStatus = $("#hdnRecordStatus").val();
                        dtParms.DNCStatus = $("#hdnDNCStatus").val();
                        dtParms.BPOCenter = $("#hdnBPOCenter").val();
                        dtParms.AudioStatus = $("#hdnAudioStatus").val();
                        return dtParms;
                    },
                    complete: function (response, result) {
                         
                        var tableBottom = $(`#${AlphaLab.Leads.Option.LeadTableId}_wrapper .btmpage`).detach();
                        $(".top_pagging").prepend(tableBottom);
                        $(".dataTables_length select").removeClass("form-control form-control-sm").addClass("form-select")
                        var lgndrp = $(`#${AlphaLab.Leads.Option.LeadTableId}_length`).detach();
                        $(".lgndrp").prepend(lgndrp);
                        $(`#${AlphaLab.Leads.Option.LeadTableId}_wrapper .top`).remove();
                        $("#searchId").removeClass("hide");
                    }
                },
                columns: [
                    {
                        data: "leadId", orderable: false,
                        render: function (data, type, row) {
                            var renderResult = "";
                            if (AlphaLab.Leads.Option.RoleId == AlphaLab.Common.Role.Operation_Admin) {
                                renderResult += '<a href="' + (UrlContent("Lead/Add?id=") + row.encId + "&view=" + true) + '" title="View"  class="mr-2 fs-0" style="color:#333333"><b><i class="far fa-eye viewHover" ></i></b></a>'
                            }
                            else {
                                renderResult += '<input type="checkbox" class="deleteAll mr-2 fs-0" value="' + data + '" onChange="AlphaLab.Leads.OnSelectRecord()"/>'
                                if (AlphaLab.Leads.Option.RoleId != AlphaLab.Common.Role.QA_Admin && AlphaLab.Leads.Option.RoleId != AlphaLab.Common.Role.QA_Agent) {
                                    if (AlphaLab.Leads.Option.RoleId != AlphaLab.Common.Role.BPO || !row.isMovedToBilling) {
                                        renderResult += '<a href="' + (UrlContent("Lead/Add?id=") + row.encId) + '" class="mr-2 fs-0" title="Edit" style="color:#333333"><b><i class="far fa-edit editHover"></i></b></a>'
                                    }
                                    else {
                                        renderResult += '<a href="#" class="" title=""><b><span style="margin-right: 20px;">&nbsp;</i></b></a>'
                                    }
                                }
                                renderResult += '<a href="' + (UrlContent("Lead/Add?id=") + row.encId + "&view=" + true) + '" title="View"  class="mr-2 fs-0" style="color:#333333"><b><i class="far fa-eye viewHover" ></i></b></a>'
                            }
                            return renderResult;
                        }
                    },
                    {
                        data: "isOldRecords", name: "IsOldRecords", autoWidth: true, orderable: false, render: function (data, type, row) {
                            return AlphaLab.Common.GetRecordStatusHtml(data)
                        }
                    },
                    { data: "leadNo", name: "LeadNo", autoWidth: true },
                    {
                        data: "leadStatus", name: "LeadStatus", autoWidth: true, className: "text-center", render: function (data, type, row) {
                            return AlphaLab.Common.GetLeadStatusHtml(data)
                        }
                    },
                    {
                        data: "centerCode", name: "CenterCode", autoWidth: true, visible: AlphaLab.Leads.Option.RoleId == AlphaLab.Common.Role.BPO
                    },
                    {
                        data: "medicareId", name: "MedicareId", autoWidth: true, render: function (data, type, row) {
                            return AlphaLab.Common.GetMemberIdHtml(data, row);
                        }
                    },
                    {
                        data: "bpo", name: "BPO", autoWidth: true, visible: AlphaLab.Leads.Option.RoleId == AlphaLab.Common.Role.SuperAdmin || AlphaLab.Leads.Option.RoleId == AlphaLab.Common.Role.User_Admin || AlphaLab.Leads.Option.RoleId == AlphaLab.Common.Role.Operation_Admin
                    },
                    { data: "contactDate", name: "ContactDate", autoWidth: true },
                    { data: "firstName", name: "FirstName", autoWidth: true },
                    { data: "lastName", name: "LastName", autoWidth: true },
                    { data: "dob", name: "DOB", autoWidth: true },
                    { data: "gender", name: "Gender", autoWidth: true },
                    {
                        data: "phone", name: "Phone", autoWidth: true, render: function (data, type, row) {
                            return AlphaLab.Common.FormatPhoneNumber(data);
                        }
                    },
                    { data: "address", name: "Address", autoWidth: true },
                    { data: "address2", name: "Address2", autoWidth: true },
                    { data: "city", name: "City", autoWidth: true },
                    { data: "stateName", name: "StateName", autoWidth: true },
                    { data: "zipcode", name: "Zipcode", autoWidth: true },
                    {
                        data: "qaStatus", name: "QAStatus", autoWidth: true, className: "text-center",
                        render: function (data, type, row) {

                            return AlphaLab.Common.GetQAHtml(data)
                        }
                    },
                    {
                        data: "addressStatus", name: "AddressStatus", autoWidth: true, className: "text-center",
                        render: function (data, type, row) {
                            return AlphaLab.Common.GetAddressStatusHtml(data, row)
                        }
                    },
                    {
                        data: "audioCount", name: "AudioCount", autoWidth: true, className: "text-center",
                        render: function (data, type, row) {
                            return AlphaLab.Common.GetAudioRecordHtml(data)
                        }
                    },
                    { data: "pT_Availability", name: "PT_Availability", autoWidth: true },
                    { data: "last_Tested", name: "Last_Tested", autoWidth: true },
                    { data: "createdDate", name: "CreatedDate", autoWidth: true },
                ],
                order: [2, "DESC"],
                fixedColumns: {
                    left: 3,
                },
                //initComplete: function (settings, json) {
                //    $(".preloader").hide();
                //},
                //preDrawCallback: function (settings) {
                //    $(".preloader").show();
                //},
                //drawCallback: function (settings) {
                //    $(".preloader").hide();
                //},
                language: {
                    processing: '<div class="dataTableLoader"></div>'
                }
            });
             

    }

    this.Search = function () {
        AlphaLab.Leads.Option.LeadTable.ajax.reload();
    }

    this.Save = function (redirectionType = 3) {
        if ($("#LeadsFormId").valid()) {
            $(".preloader").show();
            var formdata = $("#LeadsFormId").serialize();
            $.ajax({
                type: "Post",
                url: UrlContent("Lead/Save/"),
                data: formdata,
                success: function (result) {
                    $(".preloader").hide();
                    if (result.isSuccess) {
                        Swal.fire({
                            title: "Record Save!",
                            icon: "success",
                            html: result.message
                        }).then((x) => {
                            if (redirectionType == AlphaLab.Common.Redirection_Type.Save_And_Next) {
                                if (result.result != null && result.result != "" && typeof result.result != "undefined") {
                                    window.location.href = UrlContent("Lead/Add?id=" + result.result);
                                } else {
                                    window.location.href = UrlContent("Lead/Add");
                                }
                            } else if (redirectionType == AlphaLab.Common.Redirection_Type.Save_And_Close) {
                                window.location.href = UrlContent("Lead");
                            }
                        })
                    } else {
                        AlphaLab.Common.ToastrError(result.message);
                    }
                },
            })
        }
    }

    this.OnSelectRecord = function () {
        //checked unchecked header checkbox
        var totalRowLength = $(".deleteAll").length;
        var totalSelectedRowLength = $(".deleteAll:checked").length;

        if (parseInt(totalRowLength) == parseInt(totalSelectedRowLength)) {
            $(".selectAll").prop("checked", true);
        }
        else {
            $(".selectAll").prop("checked", false);
        }
        if (totalSelectedRowLength > 0) {
            $("#btnAssignToAgent").removeClass("hide")
            $("#btnValidateAddress").removeClass("hide")
        }
        else {
            $("#btnAssignToAgent").addClass("hide")
            $("#btnValidateAddress").addClass("hide")
        }
    }

    $('.selectAll').change(function () {
        var ischecked = $('.selectAll').is(':checked');
        if (ischecked) {
            $('.deleteAll').prop('checked', true);
        }
        if (!ischecked) {
            $('.deleteAll').prop('checked', false);
        }
        var totalSelectedRowLength = $(".deleteAll:checked").length;
        if (totalSelectedRowLength > 0) {
            $("#btnAssignToAgent").removeClass("hide")
            $("#btnValidateAddress").removeClass("hide")
        }
        else {
            $("#btnAssignToAgent").addClass("hide")
            $("#btnValidateAddress").addClass("hide")
        }
    });

    this.Delete = function () {
        SelectedRecordArray = [];
        $('.deleteAll:checked').each(function () {
            SelectedRecordArray.push($(this).attr('value'));
        });
        var count = SelectedRecordArray.length;
        if (count > 0) {
            Swal.fire({
                title: '<h4><b>Are you sure you want to delete these ' + count + ' Leads?<b></h4>',
                html: '',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#f33c02',
                cancelButtonColor: '#a1aab2',
                confirmButtonText: '<i class="fas fa-trash"></i> Delete',
                cancelButtonText: '<i class="fas fa-ban"></i> Cancel'
            }).then((result) => {
                if (result.value) {
                    $('.preloader').show();
                    $.ajax({
                        type: "POST",
                        url: UrlContent("Lead/Delete"),
                        data: {
                            ids: SelectedRecordArray,
                        },
                        success: function (result) {
                            $('.preloader').hide();
                            if (result.isSuccess) {
                                $('.selectAll').prop('checked', false);
                                AlphaLab.Leads.Option.LeadTable.ajax.reload();
                                SelectedRecordArray = [];
                                $('#btnAssignToAgent').addClass("hide");
                                $('#btnValidateAddress').addClass("hide");
                                Swal.fire({
                                    icon: 'success',
                                    title: 'Success',
                                    html: result.message,
                                })
                            }
                            else {
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Error',
                                    html: result.message,
                                })
                            }
                        }
                    })
                }
            });

        }
    }

    this.MoveToEV = function () {
        SelectedRecordArray = [];
        $('.deleteAll:checked').each(function () {
            SelectedRecordArray.push($(this).attr('value'));
        });
        var count = SelectedRecordArray.length;
        if (count > 0) {
            Swal.fire({
                title: '<h4><b>Are you sure you want to move these ' + count + ' leads for Eligibilty Verification?<b></h4>',
                html: '',
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#7460ee',
                cancelButtonColor: '#a1aab2',
                confirmButtonText: '<i class="fas fa-check"></i> Yes',
                cancelButtonText: '<i class="fas fa-ban"></i> Cancel'
            }).then((result) => {
                if (result.value) {
                    $('.preloader').show();
                    $.ajax({
                        type: "POST",
                        url: UrlContent("Lead/MoveToEV"),
                        data: {
                            ids: SelectedRecordArray,
                        },
                        success: function (result) {
                            $('.preloader').hide();
                            if (result.isSuccess) {
                                $('.selectAll').prop('checked', false);
                                AlphaLab.Leads.Option.LeadTable.ajax.reload();
                                SelectedRecordArray = [];
                                $('#btnAssignToAgent').addClass("hide");
                                $('#btnValidateAddress').addClass("hide");
                                Swal.fire({
                                    icon: 'success',
                                    title: 'Success',
                                    html: result.message,
                                })
                            }
                            else {
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Error',
                                    html: result.message,
                                })
                            }
                        }
                    })
                }
            });

        }
    }

    this.DownloadLeadsReport = function () {
        $(".preloader").show();
        $.ajax({
            url: UrlContent("Lead/DownloadLeadsReport"),
            type: "POST",
            data: {
                SearchText: $("#txtSearch").val(),
                LeadsStatus: $("#hdnLeadStatus").val(),
                EVStatus: $("#hdnEVStatus").val(),
                ShipmentStatus: $("#hdnShipmentStatus").val(),
                AddressStatus: $("#hdnAddressStatus").val(),
                BPO: $("#hdnBPO").val(),
                DateRange: $("#hdnCreatedDate").val(),
                SNSStatus: $("#hdnSNSStatus").val(),
                QAStatus: $("#hdnQAStatus").val(),
                RecordStatus: $("#hdnRecordStatus").val(),
                DNCStatus: $("#hdnDNCStatus").val(),
                BPOCenter: $("#hdnBPOCenter").val(),
                AudioStatus: $("#hdnAudioStatus").val(),
            },
            success: function (response) {
                $(".preloader").hide();
                if (response.isSuccess) {
                    window.location.href = UrlContent("ExtraFiles/Downloads/" + response.message);
                } else {
                    AlphaLab.Common.ToastrError(response.message);
                }
            }
        });
    }

    this.BulkValidateAddress = function () {
        SelectedRecordArray = [];
        $('.deleteAll:checked').each(function () {
            SelectedRecordArray.push($(this).attr('value'));
        });
        var count = SelectedRecordArray.length;
        if (count > 0) {
            Swal.fire({
                title: '<h4><b>Are you sure want to validate address of these ' + count + ' leads?<b></h4>',
                html: '',
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#7460ee',
                cancelButtonColor: '#a1aab2',
                confirmButtonText: '<i class="fas fa-check"></i> Yes',
                cancelButtonText: '<i class="fas fa-ban"></i> Cancel'
            }).then((result) => {
                if (result.value) {
                    $('.preloader').show();
                    $.ajax({
                        type: "POST",
                        url: UrlContent("Lead/BulkValidateAddress"),
                        data: {
                            ids: SelectedRecordArray,
                        },
                        success: function (result) {
                            $('.preloader').hide();
                            if (result.isSuccess) {
                                $('.selectAll').prop('checked', false);
                                AlphaLab.Leads.Option.LeadTable.ajax.reload();
                                SelectedRecordArray = [];
                                $('#btnAssignToAgent').addClass("hide");
                                $('#btnValidateAddress').addClass("hide");
                                Swal.fire({
                                    icon: 'success',
                                    title: 'Success',
                                    html: result.message,
                                })
                            }
                            else {
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Error',
                                    html: result.message,
                                })
                            }
                        }
                    })
                }
            });
        }
    }

    this.CommentsList = function (id, userId, roleId) {
        $.ajax({
            url: UrlContent("Common/_CommentsList"),
            type: "GET",
            success: function (response) {
                $("#divCommentsList").html(response);

                AlphaLab.Leads.Option.CommentsListTable = $("#CommentsTableId").DataTable(
                    {
                        searching: false,
                        paging: true,
                        serverSide: "true",
                        processing: true,
                        bPaginate: true,
                        bLengthChange: true,
                        bInfo: true,
                        async: false,
                        lengthMenu: [[10, 25, 50, 100, 500], [10, 25, 50, 100, 500]],
                        pageLength: 100,
                        dom: '<"top"flp>rt<"row btmpage mb-1 mt-2"<"col-sm-5 txtSearchId"><"col-sm-2 lgndrp"><"col-sm-2"i><"col-sm-3"p>>',
                        ajax: {
                            type: "Post",
                            url: UrlContent("Common/CommentsList/" + id),
                            data: function (dtParms) {
                                dtParms.search.value = $("#txtSearch").val();
                                return dtParms;
                            },
                            complete: function (response, result) {
                                 
                                var tableBottom = $(`#CommentsTableId_wrapper .btmpage`).detach();
                                $(".top_pagging").prepend(tableBottom);
                                $(".dataTables_length select").removeClass("form-control form-control-sm").addClass("form-select")
                                var lgndrp = $(`#CommentsTableId_length`).detach();
                                $(".lgndrp").prepend(lgndrp);
                                $(`#CommentsTableId_wrapper .top`).remove();
                                $("#searchId").removeClass("hide");
                            }
                        },
                        "columns": [
                            {
                                data: "commentType", name: "CommentType", autoWidth: true, orderable: false, className: "col-1 text-center",
                                render: function (data, type, row) {
                                    if (data == 'BPO') {
                                        return '<span class="badge badge-phoenix badge-phoenix-primary  font-size-12">BPO</span>';
                                    }
                                    else if (data == 'COMMON') {
                                        return '<span class="badge badge-phoenix badge-phoenix-info  font-size-12">COMMON</span>';
                                    }
                                    else {
                                        return '<span class="badge badge-phoenix badge-phoenix-success font-size-12">INTERNAL</span>'
                                    }
                                }
                            },
                            { data: "comments", name: "Comments", autoWidth: true, orderable: false, className: "whiteSpace" },
                            { data: "createdName", name: "CreatedName", autoWidth: true, orderable: false, className: "col-3" },
                            { data: "createdOn", name: "CreatedOn", autoWidth: true, orderable: false, className: "col-2" },
                            {
                                data: "commentId", className: "text-center col-1", orderable: false, autoWidth: true, width: '20px',
                                render: function (data, type, row) {
                                    var renderResult = "";
                                    if ((userId == row.createdBy && (roleId == AlphaLab.Common.Role.Operation_Admin || roleId == AlphaLab.Common.Role.QA_Admin || roleId == AlphaLab.Common.Role.Eligibility || roleId == AlphaLab.Common.Role.BPO || roleId == AlphaLab.Common.Role.BpoCenter || roleId == AlphaLab.Common.Role.QA_Agent)) || roleId == AlphaLab.Common.Role.SuperAdmin || roleId == AlphaLab.Common.Role.User_Admin) {
                                        renderResult += '<button type="button" class="btn fs-1 mr-1 " style="padding: 0px !important;" onclick="AlphaLab.Leads.AddComment(' + row.leadId + ',' + data + ')" class="" title="Delete"><i class="far fa-edit  editHover">  </i></a>'
                                        renderResult += '<button type="button" class="btn fs-1 mr-1"  style="padding: 0px !important;" onclick="AlphaLab.Leads.DeleteComment(' + data + ')" class="" title="Delete"><i class="fas fa-trash commentdeleteHover"></i></a>'
                                    }
                                    return renderResult;
                                }
                            },
                        ],
                        order: [1, "DESC"],
                        language: {
                            processing: '<div class="dataTableLoader"></div>'
                        }
                    });

            }
        });

    }

    this.AddComment = function (leadId, id, IsResolve = false) {
        $(".preloader").show();
        $.ajax({
            type: "GET",
            url: UrlContent("Common/AddComment"),
            data: {
                id: id,
                leadId: leadId,
                IsResolve: IsResolve
            },
            success: function (data) {
                $("#common-md-dialogContent").html(data);
                $.validator.unobtrusive.parse($("#CommentForm"));
                $("#common-md-dialog").modal('show');
                $(".preloader").hide();
            }
        })
    }

    this.SaveComment = function () {
        if ($("#CommentForm").valid()) {
            $(".preloader").show();
            var formdata = $("#CommentForm").serialize();
            $.ajax({
                type: "Post",
                url: UrlContent("Common/SaveComment"),
                data: formdata,
                success: function (response) {
                    $(".preloader").hide();
                    if (response.isSuccess) {
                        $("#comment-dialog").modal('hide');
                        Swal.fire({
                            title: "Success!",
                            icon: "success",
                            html: response.message
                        }).then((x) => {
                            window.location.reload();
                        });
                    } else {
                        AlphaLab.Common.ToastrError(response.message);
                    }
                },
            })
        }
    }


    this.AcceptComment = function (leadId) {
        Swal.fire({
            title: '<h4><b>Are you sure you want to accept this resolved changes?<b></h4>',
            html: '',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#7460ee',
            cancelButtonColor: '#a1aab2',
            confirmButtonText: '<i class="fas fa-check"></i> Yes',
            cancelButtonText: '<i class="fas fa-ban "></i> Cancel'
        }).then((result) => {
            if (result.value) {
                $(".preloader").show();
                $.ajax({
                    type: "GET",
                    url: UrlContent("Common/AcceptComment"),
                    data: { leadId: leadId },
                    success: function (response) {
                        $(".preloader").hide();
                        if (response.isSuccess) {
                            Swal.fire({
                                title: "Success!",
                                type: "success",
                                html: response.message
                            }).then((x) => {
                                window.location.reload();
                            });

                        } else {
                            AlphaLab.Common.ToastrError(response.message);
                        }
                    },
                })
            }
        });
    }

    this.DeleteComment = function (id) {
        Swal.fire({
            title: '<h4><b>Are you sure you want to delete this Comment?<b></h4>',
            html: '',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#f33c02',
            cancelButtonColor: '#a1aab2',
            confirmButtonText: '<i class="fas fa-trash"></i> Delete',
            cancelButtonText: '<i class="fas fa-ban"></i> Cancel'
        }).then((result) => {
            if (result.value) {
                $('.preloader').show();
                $.ajax({
                    type: "POST",
                    url: UrlContent("Common/DeleteComment/" + id),
                    success: function (result) {
                        $('.preloader').hide();
                        if (result.isSuccess) {
                            AlphaLab.Leads.Option.CommentsListTable.ajax.reload();
                            Swal.fire({
                                icon: 'success',
                                title: 'Success',
                                html: result.message,
                            })
                        }
                        else {
                            Swal.fire({
                                icon: 'error',
                                title: 'Error',
                                html: result.message,
                            })
                        }
                    }
                })
            }
        });


    }

    this.AudioList = function (id, phone, isHideAction = false) {
        console.log(id)
        AlphaLab.Leads.Option.AudioTable = $("#audioListTable").DataTable(
            {
                searching: false,
                paging: true,
                serverSide: "true",
                processing: true,
                bPaginate: true,
                bLengthChange: true,
                bInfo: true,
                async: false,
                lengthMenu: [[10, 25, 50, 100, 500], [10, 25, 50, 100, 500]],
                pageLength: 100,
                dom: '<"top"flp>rt<"row btmpage mb-1 mt-2"<"col-sm-5 txtSearchId"><"col-sm-2 lgndrp"><"col-sm-2"i><"col-sm-3"p>>',
                ajax: {
                    type: "Post",
                    url: UrlContent("Common/GetAudioList"),
                    data: function (dtParms) {
                        dtParms.LeadId = id;
                        dtParms.Phone = phone;
                        return dtParms;
                    },
                    complete: function (response, result) {
                        $("#audioListTable_wrapper").addClass("pr-0")
                        var tableBottom = $("#audioListTable_wrapper .btmpage").detach();
                        $(".top_pagging").prepend(tableBottom);
                        var lgndrp = $("#audioListTable_length").detach();
                        $(".lgndrp").prepend(lgndrp);
                        $("#audioListTable_wrapper .top").remove();
                        $("#searchId").removeClass("hide");
                    }
                },
                "columns": [
                    {
                        data: "audioId", name: "AudioId", autoWidth: true, orderable: false, className: "whiteSpace col-1", visible: !isHideAction,
                        render: function (data) {
                            return '<button type="button" class="btn" onclick="AlphaLab.Leads.DeleteAudioRecording(\'' + data + '\')" class="mr-2 fs-0" title="Delete"><b><i class="fas fa-trash deleteHover" ></i></b></button>' 
                        }
                    },
                    {
                        data: "dropboxURL", name: "DropboxURL", autoWidth: true, orderable: false, className: "col-8",
                        render: function (data, type, row) { 
                            if (row.isInvalid) {
                                let errorMessage = row.errorMessage != null && row.errorMessage != "" && typeof row.errorMessage != "undefined" ? row.errorMessage : 'In Valid URL';
                                return '<i class="fas fa-info-circle mr-2 text-danger fs-0"    title="' + errorMessage + '"></i> <a href="' + data + '" target="_blank">' + data + '</a>'
                            } else {
                                return '<a href="' + data + '" target="_blank">' + data + '</a>'
                            }
                        }
                    },
                    { data: "createdDate", name: "CreatedDate", autoWidth: true, orderable: false, className: "col-3" },
                ],
                order: [1, "DESC"],

                language: {
                    processing: '<div class="dataTableLoader"></div>'
                }
            });
    }

    this.AddRecording = function (id, phone) {
        $(".preloader").show();
        $.ajax({
            type: "GET",
            url: UrlContent("Lead/_AddRecording"),
            data: {
                id: id,
                phone: phone,
            },
            success: function (data) {
                $("#common-md-dialogContent").html(data);
                $.validator.unobtrusive.parse($("#RecordingForm"));
                AlphaLab.Common.InitMask();
                AlphaLab.Leads.OnFileTypeChange();
                $("#common-md-dialog").modal('show');
                $(".preloader").hide();
            }
        })
    }

    this.OnFileTypeChange = function () {
        let docType = $("#ddDocType").val();
        $("#docTypeFile").addClass("hide");
        $("#docTypeUrl").addClass("hide");
        if (docType == 1) {
            $("#docTypeFile").removeClass("hide");
        } else if (docType == 2) {
            $("#docTypeUrl").removeClass("hide");
        }
    }

    this.SaveRecording = function () {
        if ($("#RecordingForm").valid()) {
            $(".preloader").show();


            var formdata = new FormData();
            var fileupload = $("#docfile").get(0);
            var files = fileupload.files;
            for (var i = 0; i < files.length; i++) {
                formdata.append($("#docfile").attr("name"), files[i]);
            }
            $(".form-control").each(function (x, y) {
                formdata.append($(y).attr("name"), $(y).val());
            });

            $.ajax({
                type: "Post",
                url: UrlContent("Lead/SaveRecording"),
                data: formdata,
                processData: false,
                contentType: false,
                success: function (result) {
                    $(".preloader").hide();
                    if (result.isSuccess) {
                        AlphaLab.Common.ToastrSuccess(result.message);
                        AlphaLab.Leads.Option.AudioTable.ajax.reload();
                        $("#common-md-dialog").modal("hide");
                    } else {
                        AlphaLab.Common.ToastrError(result.message);
                    }
                },
            })
        }
    }

    this.DeleteAudioRecording = function (id) {
        var audioIds = [];
        audioIds.push(id);
        Swal.fire({
            title: '<h4><b>Are you sure you want to delete this audio recording?<b></h4>',
            html: '',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#f33c02',
            cancelButtonColor: '#a1aab2',
            confirmButtonText: '<i class="fas fa-trash"></i> Delete',
            cancelButtonText: '<i class="fas fa-ban"></i> Cancel'
        }).then((result) => {
            if (result.value) {
                $('.preloader').show();
                $.ajax({
                    type: "POST",
                    url: UrlContent("Lead/DeleteAudioRecording"),
                    data: {
                        ids: audioIds,
                    },
                    success: function (result) {
                        $('.preloader').hide();
                        if (result.isSuccess) {
                            AlphaLab.Leads.Option.AudioTable.ajax.reload();
                            Swal.fire({
                                icon: 'success',
                                title: 'Success',
                                html: result.message,
                            })
                        }
                        else {
                            Swal.fire({
                                icon: 'error',
                                title: 'Error',
                                html: result.message,
                            })
                        }
                    }
                })
            }
        });


    }

    this.CustomerStatusClear = function () {
        $('.clsCustStatus').prop('checked', false);
        $("#customerStatus1").val("0");
    }

    this.DeleteLead = function (id) {
        var audioIds = [];
        audioIds.push(id);
        Swal.fire({
            title: '<h4><b>Are you sure you want to delete this Lead? <b></h4>',
            html: '',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#f33c02',
            cancelButtonColor: '#a1aab2',
            confirmButtonText: '<i class="fas fa-trash"></i> Delete',
            cancelButtonText: '<i class="fas fa-ban"></i> Cancel'
        }).then((result) => {
            if (result.value) {
                $('.preloader').show();
                $.ajax({
                    type: "POST",
                    url: UrlContent("Lead/Delete"),
                    data: {
                        ids: audioIds,
                    },
                    success: function (result) {
                        $('.preloader').hide();
                        if (result.isSuccess) {
                            window.location.href = UrlContent("Lead");
                            Swal.fire({
                                icon: 'success',
                                title: 'Success',
                                html: result.message,
                            })
                        }
                        else {
                            Swal.fire({
                                icon: 'error',
                                title: 'Error',
                                html: result.message,
                            })
                        }
                    }
                })
            }
        });
    }

    this.OnChangeBpo = function () {
        var bpoMasterId = $("#bpoMasterId").val();
        if (bpoMasterId > 0) {
            $('#bpocenterDrpId').removeClass("hide");
            $.ajax({
                type: "POST",
                url: UrlContent("Common/GetCenterDrpList"),
                data: { id: bpoMasterId },
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

    this.AssignLeadsModal = function () {
        SelectedRecordArray = [];
        $('.deleteAll:checked').each(function () {
            SelectedRecordArray.push($(this).attr('value'));
        });
        var count = SelectedRecordArray.length;
        if (count > 0) {
            $.ajax({
                url: UrlContent("Lead/_AssignLead"),
                success: function (result) {
                    $("#common-sm-DialogContent").html(result);
                    $("#common-sm-dialog").modal("show");
                }
            })
        } else {
            AlphaLab.Common.ToastrError("Please select atleast one lead.")
        }
    }

    this.AssignLeads = function () {
        SelectedRecordArray = [];
        $('.deleteAll:checked').each(function () {
            SelectedRecordArray.push($(this).attr('value'));
        });
        var count = SelectedRecordArray.length;
        if (count > 0) {
            Swal.fire({
                title: '<h4><b>Are you sure want to assign these ' + count + ' leads to Agents for Audits?<b></h4>',
                html: '',
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#7460ee',
                cancelButtonColor: '#a1aab2',
                confirmButtonText: '<i class="fas fa-check"></i> Yes',
                cancelButtonText: '<i class="fas fa-ban"></i> Cancel'
            }).then((result) => {
                if (result.value) {

                    $('.preloader').show();
                    $.ajax({
                        url: UrlContent("Lead/AssignLeads"),
                        type: "POST",
                        data: {
                            ids: SelectedRecordArray,
                            //assignTo: agentId,
                        },
                        success: function (result) {
                            $('.preloader').hide();
                            if (result.isSuccess) {
                                $('.selectAll').prop('checked', false);
                                AlphaLab.Leads.Option.LeadTable.ajax.reload();
                                SelectedRecordArray = [];
                                $('#btnAssignToAgent').addClass("hide");
                                $('#btnValidateAddress').addClass("hide");
                                $("#common-sm-dialog").modal("hide");
                                Swal.fire({
                                    icon: 'success',
                                    title: 'Success',
                                    html: result.message,
                                })
                            }
                            else {
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Error',
                                    html: result.message,
                                })
                            }
                        }
                    })
                }
            });

        } else {
            AlphaLab.Common.ToastrError("Please select atleast one lead.")
        }
    }

    this.AssignLeadsSingle = function (leadId) {
        let SelectedRecordArray = []
        SelectedRecordArray.push(leadId);
        Swal.fire({
            title: '<h4><b>Are you sure want to assign this lead to Agent for Audits?<b></h4>',
            html: '',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#7460ee',
            cancelButtonColor: '#a1aab2',
            confirmButtonText: '<i class="fas fa-check"></i> Yes',
            cancelButtonText: '<i class="fas fa-ban"></i> Cancel'
        }).then((result) => {
            if (result.value) {

                $('.preloader').show();
                $.ajax({
                    url: UrlContent("Lead/AssignLeads"),
                    type: "POST",
                    data: {
                        ids: SelectedRecordArray,
                    },
                    success: function (result) {
                        $('.preloader').hide();
                        if (result.isSuccess) {
                            SelectedRecordArray = [];

                            Swal.fire({
                                icon: 'success',
                                title: 'Success',
                                html: result.message,
                            }).then((x) => {
                                window.location.reload();
                            });
                        }
                        else {
                            Swal.fire({
                                icon: 'error',
                                title: 'Error',
                                html: result.message,
                            })
                        }
                    }
                })
            }
        });

    }

    this.OnDirectReject = function () {
        if ($("#directReject").is(':checked')) {
            $("#directRejectionCommentId").removeClass('hide');
        } else {
            $("#txtDirectRejectionComment").val("");
            $("#directRejectionCommentId").addClass('hide');
        }
    }

    this.SaveAudit = function (isNext = false) {
        if ($("#AuditFormId").valid()) {
            $(".preloader").show();
            var formdata = $("#AuditFormId").serialize();
            $.ajax({
                type: "Post",
                url: UrlContent("Lead/SaveAudit/"),
                data: formdata,
                success: function (result) {
                    $(".preloader").hide();
                    if (result.isSuccess) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Success',
                            html: result.message,
                        }).then((x) => {
                            window.location.reload();
                        });
                        //AlphaLab.Common.ToastrSuccess(result.message);
                    } else {
                        AlphaLab.Common.ToastrError(result.message);
                    }
                },
            })
        }
    }

}
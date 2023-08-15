AlphaLab.Eligibility = new function () {

    //Variable
    var SelectedRecordArray = [];

    this.Option = {
        Table: null,
        TableId:"",
        CheckEligibilityTable: null,
        RoleId: 0
    }

    this.Init = function (options) {
        AlphaLab.Eligibility.Option = $.extend({}, AlphaLab.Eligibility.Option, options);
        AlphaLab.Eligibility.Option.Table = $(`#${AlphaLab.Eligibility.Option.TableId}`).DataTable(
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
                    url: UrlContent("Eligibility/GetList"),
                    data: function (dtParms) {
                        dtParms.search.value = $("#txtSearch").val();
                        dtParms.EVStatus = $("#hdnEVStatus").val();
                        dtParms.BPO = $("#hdnBPO").val();
                        dtParms.DateRange = $("#hdnCreatedDate").val();
                        dtParms.SNSStatus = $("#hdnSNSStatus").val();
                        return dtParms;
                    },
                    complete: function (response, result) {

                        var tableBottom = $(`#${AlphaLab.Eligibility.Option.TableId}_wrapper .btmpage`).detach();
                        $(".top_pagging").prepend(tableBottom);
                        $(".dataTables_length select").removeClass("form-control form-control-sm").addClass("form-select")
                        var lgndrp = $(`#${AlphaLab.Eligibility.Option.TableId}_length`).detach();
                        $(".lgndrp").prepend(lgndrp);
                        $(`#${AlphaLab.Eligibility.Option.TableId}_wrapper .top`).remove();
                        $("#searchId").removeClass("hide");
                    }
                },
                columns: [
                    {
                        data: "eligibilityId", orderable: false,
                        render: function (data, type, row) {
                            var renderResult = "";
                            if (AlphaLab.Eligibility.Option.RoleId == AlphaLab.Common.Role.Operation_Admin) {
                                renderResult += '<a href="' + (UrlContent("Eligibility/Add?id=") + row.encId + "&view=" + true) + '" title="View" class="mr-2 fs-0"  style="color:#333333"><b><i class="far fa-eye viewHover" ></i></b></a>'
                            }
                            else {
                                renderResult += '<input type="checkbox" class="deleteAll mr-2 fs-0" value="' + data + '" onChange="AlphaLab.Eligibility.OnSelectRecord(\'' + data + '\',this)"/>'
                                renderResult += '<a href="' + (UrlContent("Eligibility/Add?id=") + row.encId) + '" class="mr-2 fs-0" title="Edit" style="color:#333333"><b><i class="far fa-edit editHover" ></i></b></a>'
                                renderResult += '<a href="' + (UrlContent("Eligibility/Add?id=") + row.encId + "&view=" + true) + '" title="View" class="mr-2 fs-0"  style="color:#333333"><b><i class="far fa-eye viewHover" ></i></b></a>'
                            }
                            return renderResult;
                        }
                    },
                    { data: "leadNo", name: "LeadNo", autoWidth: true },
                    {
                        data: "leadStatus", name: "LeadStatus", autoWidth: true, className: "text-center", render: function (data, type, row) {
                            return AlphaLab.Common.GetLeadStatusHtml(data)
                        }
                    },
                    {
                        data: "medicareId", name: "MedicareId", autoWidth: true, render: function (data, type, row) {
                            return AlphaLab.Common.MaskString(data, AlphaLab.Common.MaskLastCharacters)
                        }
                    },
                    { data: "hcpcs", name: "HCPCS", autoWidth: true },
                    { data: "mac", name: "Mac", autoWidth: true },
                    {
                        data: "eligibilityStatus", name: "EligibilityStatus", autoWidth: true, className: "text-center", render: function (data, type, row) {
                            return AlphaLab.Common.GetEligibilityStatusHtml(data)
                        }
                    },
                    {
                        data: "snsStatus", name: "SNSStatus", autoWidth: true, className: "text-center", render: function (data, type, row) {
                            return AlphaLab.Common.GetSNSStatusHtml(data, row)
                        }
                    },
                    {
                        data: "bpo", name: "BPO", autoWidth: true, visible: AlphaLab.Eligibility.Option.RoleId == AlphaLab.Common.Role.SuperAdmin || AlphaLab.Eligibility.Option.RoleId == AlphaLab.Common.Role.User_Admin || AlphaLab.Eligibility.Option.RoleId == AlphaLab.Common.Role.Operation_Admin
                    },
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
                    //{ data: "pT_Availability", name: "PT_Availability", autoWidth: true },
                    //{ data: "last_Tested", name: "Last_Tested", autoWidth: true },
                    { data: "createdDate", name: "CreatedDate", autoWidth: true },
                ],
                order: [1, "DESC"],
                fixedColumns: {
                    left: 2,
                },
                language: {
                    processing: '<div class="dataTableLoader"></div>'
                }
            });
    }

    this.Search = function () {
        AlphaLab.Eligibility.Option.Table.ajax.reload();
    }

    this.Save = function (redirectionType = 3) {
        if ($("#EligibilityFormId").valid()) {
            $(".preloader").show();
            var formdata = $("#EligibilityFormId").serialize();
            $.ajax({
                type: "Post",
                url: UrlContent("Eligibility/Save/"),
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
                                    window.location.href = UrlContent("Eligibility/Add?id=" + result.result);
                                } else {
                                    window.location.href = UrlContent("Eligibility");
                                }
                            } else if (redirectionType == AlphaLab.Common.Redirection_Type.Save_And_Close) {
                                window.location.href = UrlContent("Eligibility");
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
            $("#btnDelete").removeClass("hide")
            //$("#btnMoveToBilling").removeClass("hide")
            $("#btnBulkEV").removeClass("hide")
        }
        else {
            $("#btnBulkEV").addClass("hide")
            $("#btnDelete").addClass("hide")
            //$("#btnMoveToBilling").addClass("hide")
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
            $("#btnBulkEV").removeClass("hide")
            $("#btnDelete").removeClass("hide")
            //$("#btnMoveToBilling").removeClass("hide")
        }
        else {
            $("#btnBulkEV").addClass("hide")
            $("#btnDelete").addClass("hide")
            //$("#btnMoveToBilling").addClass("hide")
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
                title: '<h4><b>Are you sure you want to delete these ' + count + ' Eligibility?<b></h4>',
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
                        url: UrlContent("Eligibility/Delete"),
                        data: {
                            ids: SelectedRecordArray,
                        },
                        success: function (result) {
                            $('.preloader').hide();
                            if (result.isSuccess) {
                                $('.selectAll').prop('checked', false);
                                AlphaLab.Eligibility.Option.Table.ajax.reload();
                                SelectedRecordArray = [];
                                $('#btnBulkEV').addClass("hide");
                                $('#btnDelete').addClass("hide");
                                $('#btnMoveToBilling').addClass("hide");
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

    this.MoveToBilling = function () {
        SelectedRecordArray = [];
        $('.deleteAll:checked').each(function () {
            SelectedRecordArray.push($(this).attr('value'));
        });
        var count = SelectedRecordArray.length;
        if (count > 0) {
            Swal.fire({
                title: '<h4><b>Are you sure you want to move these ' + count + ' Leads to Billing?<b></h4>',
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
                        url: UrlContent("Eligibility/MoveToBilling"),
                        data: {
                            ids: SelectedRecordArray,
                        },
                        success: function (result) {
                            $('.preloader').hide();
                            if (result.isSuccess) {
                                $('.selectAll').prop('checked', false);
                                AlphaLab.Eligibility.Option.Table.ajax.reload();
                                SelectedRecordArray = [];
                                $('#btnDelete').addClass("hide");
                                $('#btnMoveToBilling').addClass("hide");
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


    this.DownloadSpreadsheetReport = function () {
        $(".preloader").show();
        $.ajax({
            url: UrlContent("Eligibility/DownloadSpreadsheetReport"),
            type: "POST",
            data: {
                SearchText: $("#txtSearch").val(),
                LeadsStatus: $("#hdnLeadStatus").val(),
                EVStatus: $("#hdnEVStatus").val(),
                ShipmentStatus: $("#hdnShipmentStatus").val(),
                BPO: $("#hdnBPO").val(),
                DateRange: $("#hdnCreatedDate").val(),
                SNSStatus: $("#hdnSNSStatus").val(),
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

    this.CheckEligibility = function (id) {

        if ($("#EligibilityFormId").valid()) {
            $(".preloader").show();
            var formdata = $("#EligibilityFormId").serialize();
            $.ajax({
                type: "Post",
                url: UrlContent("Eligibility/Save/"),
                data: formdata,
                success: function (result) {

                    if (result.isSuccess) {
                        $.ajax({
                            type: "Post",
                            url: UrlContent("Common/CheckEligibility/"),
                            data: {
                                id: id
                            },
                            success: function (result) {
                                $(".preloader").hide();
                                AlphaLab.Eligibility.Option.CheckEligibilityTable.ajax.reload();
                                if (result.isSuccess) {

                                    AlphaLab.Common.ToastrSuccess(result.message);
                                } else {
                                    AlphaLab.Common.ToastrError(result.message);
                                }
                            },
                        })
                    } else {
                        $(".preloader").hide();
                        AlphaLab.Common.ToastrError(result.message);
                    }
                },
            })
        }

    }

    this.CheckEligibilityList = function (id) {
        AlphaLab.Eligibility.Option = $.extend({}, AlphaLab.Eligibility.Option);
        AlphaLab.Eligibility.Option.CheckEligibilityTable = $("#CheckEligibilityTableId").DataTable(
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
                pageLength: 1000,
                dom: '<"top"flp>rt<"row btmpage mb-1 mt-2"<"col-sm-5 txtSearchId"><"col-sm-2 lgndrp"><"col-sm-2"i><"col-sm-3"p>>',
                ajax: {
                    type: "Post",
                    url: UrlContent("Common/CheckEligibilityList/" + id),
                    data: function (dtParms) {
                        dtParms.search.value = $("#txtSearch").val();
                        return dtParms;
                    },
                    complete: function (response, result) {
                        $("#CheckEligibilityTableId_wrapper").addClass("pr-0");
                        var tableBottom = $("#CheckEligibilityTableId_wrapper .btmpage").detach();
                        $(".top_pagging").prepend(tableBottom);
                        var lgndrp = $("#CheckEligibilityTableId_length").detach();
                        $(".lgndrp").prepend(lgndrp);
                        $("#CheckEligibilityTableId_wrapper .top").remove();
                        $("#searchId").removeClass("hide");

                         
                    }

                },
                "columns": [
                    { data: "batchNo", name: "BatchNo", autoWidth: true, className: "col-1", orderable: false, },
                    { data: "requestType", name: "RequestType", autoWidth: true, className: "col-2", orderable: false, },
                    {
                        data: "verificationStatus", name: "VerificationStatus", autoWidth: true, orderable: false, className: "text-center col-1", render: function (data, type, row) {
                            return AlphaLab.Common.GetCheckEligibilityStatusHtml(data)
                        }
                    },
                    // { data: "errorMsg", name: "ErrorMsg", autoWidth: true ,className:"col-1" },
                    { data: "createdOn", name: "CreatedOn", autoWidth: true, className: "col-2", orderable: false, },
                    { data: "createdBy", name: "CreatedBy", autoWidth: true, className: "col-2", orderable: false, },
                    {
                        data: "verificationId", className: "text-center col-1", orderable: false, autoWidth: true, with: '20px',
                        render: function (data, type, row) {
                            var renderResult = "";
                            renderResult += '<button type="button" class="btn" onclick="AlphaLab.Eligibility.ViewVerification(' + data + ')" class="mr-2 fs-0" title="View"><b><i class="far fa-eye viewHover" ></i></b></button>'
                            return renderResult;
                        }
                    },
                ],
                order: [1, "ASC"],
                language: {
                    processing: '<div class="dataTableLoader"></div>'
                }

            });
    }

    this.ViewVerification = function (id) {
        $.ajax({
            url: UrlContent("Common/_ViewVerification"),
            data: {
                id: id
            },
            success: function (response) {
                if (response.includes("txtResponseModalPopupId")) {
                    $("#common-lg-dialogContent").html(response);
                    $("#common-lg-dialog").modal("show")
                } else {
                    $("#common-xxl-dialogContent").html(response);
                    $("#common-xxl-dialog").modal("show")
                }
            }
        });
    }

    this.BulkEV = function () {
        SelectedRecordArray = [];
        $('.deleteAll:checked').each(function () {
            SelectedRecordArray.push($(this).attr('value'));
        });
        var count = SelectedRecordArray.length;
        if (count > 0) {
            Swal.fire({
                title: '<h4><b>Are you sure want to check EV for these ' + count + ' Leads?<b></h4>',
                html: '',
                icon: 'question',
                showCancelButton: true,
                showDenyButton: true,
                confirmButtonColor: '#7460ee',
                cancelButtonColor: '#a1aab2',
                denyButtonColor: '#E2AA3F',
                confirmButtonText: '<i class="fas fa-check"></i> Check With DOB',
                denyButtonText: '<i class="fas fa-ban"></i> Check Without DOB',
                cancelButtonText: '<i class="fas fa-ban"></i> Cancel',
            }).then((result) => {
                    if (result.isConfirmed || result.isDenied) {
                        $('.preloader').show();
                        $.ajax({
                            type: "POST",
                            url: UrlContent("Eligibility/BulkEV"),
                            data: {
                                ids: SelectedRecordArray,
                                isWithoutDOB_Search: result.isDenied,
                            },
                            success: function (result) {
                                $('.preloader').hide();
                                if (result.isSuccess) {
                                    $('.selectAll').prop('checked', false);
                                    SelectedRecordArray = [];
                                    AlphaLab.Eligibility.Option.Table.ajax.reload();
                                    $('#btnBulkEV').addClass("hide");
                                    $('#btnDelete').addClass("hide");

                                    Swal.fire({
                                        icon: 'success',
                                        title: 'Success',
                                        html: result.message,
                                        showDenyButton: false,
                                        showCancelButton: true,
                                        confirmButtonText: 'Go To Batch Verifications',
                                    }).then((result) => {
                                        if (result.value) {
                                            window.location.href = UrlContent("BatchVerification/Index");
                                        }
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

    this.DownloadPendingSNS = function () {
        $(".preloader").show();
        $.ajax({
            url: UrlContent("Eligibility/DownloadPendingSNS"),
            type: "POST",
            data: {
                SearchText: $("#txtSearch").val(),
                LeadsStatus: $("#hdnLeadStatus").val(),
                EVStatus: $("#hdnEVStatus").val(),
                ShipmentStatus: $("#hdnShipmentStatus").val(),
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


}
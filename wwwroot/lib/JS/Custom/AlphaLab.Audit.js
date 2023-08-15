AlphaLab.Audit = new function () {
    let SelectedRecordArray = [];

    this.Option = {
        AuditTable: null,
        TableId: "",
        AuditSearchId: "",
        RoleId: 0,
    }

    this.Init = function (options) {
        AlphaLab.Audit.Option = $.extend({}, AlphaLab.Audit.Option, options);
         
        AlphaLab.Audit.Option.AuditTable = $(`#AuditTableId`).DataTable(
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
                    url: UrlContent("Audit/GetList"),
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
                        dtParms.AllocatedTo = $("#hdnAllocatedTo").val();
                        dtParms.AllocatedDate = $("#hdnAllocatedDate").val();
                        return dtParms;
                    },
                    complete: function (response, result) {
                        var tableBottom = $(`#${AlphaLab.Audit.Option.TableId}_wrapper .btmpage`).detach();
                        $(".top_pagging").prepend(tableBottom);
                        $(".dataTables_length select").removeClass("form-control form-control-sm").addClass("form-select")
                        var lgndrp = $(`#${AlphaLab.Audit.Option.TableId}_length`).detach();
                        $(".lgndrp").prepend(lgndrp);
                        $(`#${AlphaLab.Audit.Option.TableId}_wrapper .top`).remove();
                        $("#searchId").removeClass("hide");
                    }
                },
                "columns": [
                    {
                        data: "auditId", orderable: false,
                        render: function (data, type, row) {
                            var renderResult = "";
                            if (AlphaLab.Audit.Option.RoleId == AlphaLab.Common.Role.User_Admin || AlphaLab.Audit.Option.RoleId == AlphaLab.Common.Role.SuperAdmin || AlphaLab.Audit.Option.RoleId == AlphaLab.Common.Role.QA_Admin) {

                                renderResult += '<input type="checkbox" class="deleteAll  mr-2 fs-0" value="' + data + '" onChange="AlphaLab.Audit.OnSelectRecord()"/>'
                            }
                            renderResult += '<a href="' + (UrlContent("Audit/Add?id=") + row.encId + "&view=" + true) + '" title="View"  class="mr-2 fs-0" style="color:#333333"><b><i class="far fa-eye viewHover" ></i></b></a>';
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
                        data: "qaStatus", name: "QAStatus", autoWidth: true, className: "text-center",
                        render: function (data, type, row) {

                            return AlphaLab.Common.GetQAHtml(data)
                        }
                    },
                    {
                        data: "isPatientInterested", name: "IsPatientInterested", autoWidth: true, className: "text-center",
                        render: function (data, type, row) {
                            return AlphaLab.Common.GetQAReviewStatus(row)
                        }
                    },
                    {
                        data: "medicareId", name: "MedicareId", autoWidth: true, render: function (data, type, row) {
                            return AlphaLab.Common.GetMemberIdHtml(data, row);
                        }
                    },
                    {
                        data: "bpo", name: "BPO", autoWidth: true, visible: AlphaLab.Audit.Option.RoleId == AlphaLab.Common.Role.SuperAdmin || AlphaLab.Audit.Option.RoleId == AlphaLab.Common.Role.User_Admin || AlphaLab.Audit.Option.RoleId == AlphaLab.Common.Role.Operation_Admin
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
                language: {
                    processing: '<div class="dataTableLoader"></div>'
                }
            });
    }

    this.Search = function () {
        AlphaLab.Audit.Option.AuditTable.ajax.reload();
    }

    this.SaveLeads = function (redirectionType = 3) {
        if ($("#LeadsFormId").valid()) {
            $(".preloader").show();
            var formdata = $("#LeadsFormId").serialize();
            $.ajax({
                type: "Post",
                url: UrlContent("Audit/SaveLead/"),
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
                                    window.location.href = UrlContent("Audit/Add?id=" + result.result);
                                } else {
                                    window.location.href = UrlContent("Audit");
                                }
                            } else if (redirectionType == AlphaLab.Common.Redirection_Type.Save_And_Close) {
                                window.location.href = UrlContent("Audit");
                            }
                        })
                    } else {
                        AlphaLab.Common.ToastrError(result.message);
                    }
                },
            })
        }
    }

    this.Save = function (isNext = false) {
        if ($("#AuditFormId").valid()) {
            $(".preloader").show();
            var formdata = $("#AuditFormId").serialize();
            $.ajax({
                type: "Post",
                url: UrlContent("Audit/Save/"),
                data: formdata,
                success: function (result) {
                    $(".preloader").hide();
                    if (result.isSuccess) {
                        window.location.href = UrlContent("Audit");
                    } else {
                        AlphaLab.Common.ToastrError(result.message);
                    }
                },
            })
        }
    }

    this.CheckEligibility = function (id) {
        $(".preloader").show();
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
    }

    this.AuditSummaryReportByAgentDrillDown = function (allocatedTo, allocatedDate, isAssigned) {
        var QAStatus = "";
        if (isAssigned) {
            QAStatus = "1;3;4"
        }
        $.ajax({
            type: "GET",
            data: {
                AllocatedTo: allocatedTo,
                AllocatedDate: allocatedDate,
                QAStatus: QAStatus
            },
            url: UrlContent("Common/SaveTempFilter"),
            success: function (data) {
                window.location = UrlContent("Audit");
            }
        })
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
            $("#btnBulkStatusUpdate").removeClass("hide")
        }
        else {
            $("#btnBulkStatusUpdate").addClass("hide")
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
            $("#btnBulkStatusUpdate").removeClass("hide")
        }
        else {
            $("#btnBulkStatusUpdate").addClass("hide")
        }
    });

    this.BulkVerificationStatus = function () {
        SelectedRecordArray = [];
        $('.deleteAll:checked').each(function () {
            SelectedRecordArray.push($(this).attr('value'));
        });
        var count = SelectedRecordArray.length;
        if (count > 0) {
            Swal.fire({
                title: '<h4><b>Are you sure you want to update verification status these ' + count + ' records?<b></h4>',
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
                        url: UrlContent("Audit/_BulkChangeStatus"),
                        success: function (result) {
                            $('.preloader').hide();
                            $("#common-sm-DialogContent").html(result);
                            $("#common-sm-dialog").modal("show");
                        }
                    })
                }
            });

        }
        else {
            AlphaLab.Common.ToastrError("Please select atleast one lead")
        }
    }

    this.SaveBulkVerificationStatus = function () {
        SelectedRecordArray = [];
        $('.deleteAll:checked').each(function () {
            SelectedRecordArray.push($(this).attr('value'));
        });
        var count = SelectedRecordArray.length;
        if (count > 0) {
            $('.preloader').show();
            $.ajax({
                type: "POST",
                url: UrlContent("Audit/BulkChangeStatus"),
                data: {
                    ids: SelectedRecordArray,
                    status: $("#ddVerificationStatus").val(),
                    comments: $("#txtVerificatonComment").val(),
                },
                success: function (result) {
                    $('.preloader').hide();
                    if (result.isSuccess) {
                        $('.selectAll').prop('checked', false);
                        AlphaLab.Audit.Option.AuditTable.ajax.reload();
                        SelectedRecordArray = [];
                        $('#btnBulkStatusUpdate').addClass("hide");
                        Swal.fire({
                            icon: 'success',
                            title: 'Success',
                            html: result.message,
                        })
                        $("#common-sm-dialog").modal("hide");
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
        else {
            AlphaLab.Common.ToastrError("Please select atleast one lead")
        }

    }


    this.OnVerificationStatusChage = function () {
        let value = $("#ddVerificationStatus").val();
        if (value == 4) {
            $("#divVerificatonComment").removeClass("hide");
        } else {
            $("#txtVerificatonComment").val("");
            $("#divVerificatonComment").addClass("hide");
        }
    }
}
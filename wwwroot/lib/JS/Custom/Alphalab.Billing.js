AlphaLab.Billing = new function () {

    //Variable
    var SelectedRecordArray = [];

    this.Option = {
        BillingTable: null,
        TableId: "",
        BillingearchId: "",
        DrildownBillingTable: null,
        DrillDownValue1: "",
        RoleId: 0
    }

    this.Init = function (options) {
        AlphaLab.Billing.Option = $.extend({}, AlphaLab.Billing.Option, options);
        AlphaLab.Billing.Option.BillingTable = $(`#${AlphaLab.Billing.Option.TableId}`).DataTable(
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
                    url: UrlContent("Billing/GetList"),
                    data: function (dtParms) {
                        dtParms.search.value = $("#txtSearch").val();
                        dtParms.LeadsStatus = $("#hdnLeadStatus").val();
                        dtParms.ShipmentStatus = $("#hdnShipmentStatus").val();
                        dtParms.EVStatus = $("#hdnEVStatus").val();
                        dtParms.BPO = $("#hdnBPO").val();
                        dtParms.DateRange = $("#hdnCreatedDate").val();
                        return dtParms;
                    },
                    complete: function (response, result) {

                        var tableBottom = $(`#${AlphaLab.Billing.Option.TableId}_wrapper .btmpage`).detach();
                        $(".top_pagging").prepend(tableBottom);
                        $(".dataTables_length select").removeClass("form-control form-control-sm").addClass("form-select")
                        var lgndrp = $(`#${AlphaLab.Billing.Option.TableId}_length`).detach();
                        $(".lgndrp").prepend(lgndrp);
                        $(`#${AlphaLab.Billing.Option.TableId}_wrapper .top`).remove();
                        $("#searchId").removeClass("hide");
                    }
                },
                "columns": [
                    {
                        data: "billingId", orderable: false, width: "1%",
                        render: function (data, type, row) {
                            var renderResult = "";
                            if (AlphaLab.Billing.Option.RoleId == AlphaLab.Common.Role.Operation_Admin) {
                                renderResult += '<a href="' + (UrlContent("Billing/Add?id=") + row.encId + "&view=" + true) + '" title="View"  class="mr-2 fs-0"  style="color:#333333"><b><i class="far fa-eye viewHover" ></i></b></a>';
                            }
                            else {
                                /* renderResult += '<input type="checkbox" class="deleteAll" value="' + data + '" onChange="AlphaLab.Billing.OnSelectRecord(\'' + data + '\',this)"/>'*/
                                renderResult += '<a href="' + (UrlContent("Billing/Add?id=") + row.encId) + '" class="mr-2 fs-0" title="Edit" style="color:#333333"><b><i class="far fa-edit editHover" ></i></b></a>';
                                renderResult += '<a href="' + (UrlContent("Billing/Add?id=") + row.encId + "&view=" + true) + '" title="View"  class="mr-2 fs-0"  style="color:#333333"><b><i class="far fa-eye viewHover" ></i></b></a>';
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
                    { data: "dos", name: "Dos", autoWidth: true },
                    { data: "billingDate", name: "BillingDate", autoWidth: true },
                    { data: "billingNotes", name: "BillingNotes", autoWidth: true },
                    {
                        data: "bpo", name: "BPO", autoWidth: true, visible: AlphaLab.Billing.Option.RoleId == AlphaLab.Common.Role.SuperAdmin || AlphaLab.Billing.Option.RoleId == AlphaLab.Common.Role.User_Admin || AlphaLab.Billing.Option.RoleId == AlphaLab.Common.Role.Operation_Admin
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
        AlphaLab.Billing.Option.BillingTable.ajax.reload();
    }

    this.Save = function (redirectionType = 3) {
        if ($("#BillingFormId").valid()) {
            $(".preloader").show();
            var formdata = $("#BillingFormId").serialize();
            $.ajax({
                type: "Post",
                url: UrlContent("Billing/Save/"),
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
                                    window.location.href = UrlContent("Billing/Add?id=" + result.result);
                                } else {
                                    window.location.href = UrlContent("Billing");
                                }
                            } else if (redirectionType == AlphaLab.Common.Redirection_Type.Save_And_Close) {
                                window.location.href = UrlContent("Billing");
                            }
                        })
                    } else {
                        AlphaLab.Common.ToastrError(result.message);
                    }
                },
            })
        }
    }

    this.OnSelectRecord = function (id, $_this) {
        if ($($_this).is(":checked")) {
            if (!SelectedRecordArray.includes(id)) {
                SelectedRecordArray.push(id);
            }
        } else {
            var index = SelectedRecordArray.indexOf(id);
            SelectedRecordArray.splice(index, 1);
        }
        //checked unchecked header checkbox
        var totalRowLength = $(".deleteAll").length;
        var totalSelectedRowLength = $(".deleteAll:checked").length;

        if (parseInt(totalRowLength) == parseInt(totalSelectedRowLength)) {
            $(".selectAll").prop("checked", true);
        }
        else {
            $(".selectAll").prop("checked", false);
        }
        if (SelectedRecordArray.length > 0) {
            $("#btnDelete").removeClass("hide")
            $("#btnMoveToSM").removeClass("hide")
        }
        else {
            $("#btnDelete").addClass("hide")
            $("#btnMoveToSM").addClass("hide")
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
        SelectedRecordArray = [];
        $('#BillingTableBody input:checked').each(function () {
            SelectedRecordArray.push($(this).attr('value'));
        });
        if (SelectedRecordArray.length > 0) {
            $('#btnDelete').removeClass("hide");
            $('#btnMoveToSM').removeClass("hide");
        }
        else {
            $('#btnDelete').addClass("hide");
            $('#btnMoveToSM').addClass("hide");
        }

    });

    this.Delete = function () {
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
                        url: UrlContent("Billing/Delete"),
                        data: {
                            ids: SelectedRecordArray,
                        },
                        success: function (result) {
                            $('.preloader').hide();
                            if (result.isSuccess) {
                                $('.selectAll').prop('checked', false);
                                AlphaLab.Billing.Option.BillingTable.ajax.reload();
                                SelectedRecordArray = [];
                                $('#btnDelete').addClass("hide");
                                $('#btnMoveToSM').addClass("hide");
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

    this.MoveToSM = function () {
        var count = SelectedRecordArray.length;
        if (count > 0) {
            Swal.fire({
                title: '<h4><b>Are you sure you want to move these ' + count + ' Leads to Shipment?<b></h4>',
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
                        url: UrlContent("Billing/MoveToSM"),
                        data: {
                            ids: SelectedRecordArray,
                        },
                        success: function (result) {
                            $('.preloader').hide();
                            if (result.isSuccess) {
                                $('.selectAll').prop('checked', false);
                                AlphaLab.Billing.Option.BillingTable.ajax.reload();
                                SelectedRecordArray = [];
                                $('#btnDelete').addClass("hide");
                                $('#btnMoveToSM').addClass("hide");
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
            url: UrlContent("Billing/DownloadSpreadsheetReport"),
            type: "POST",
            data: {
                SearchText: $("#txtSearch").val(),
                LeadsStatus: $("#hdnLeadStatus").val(),
                EVStatus: $("#hdnEVStatus").val(),
                ShipmentStatus: $("#hdnShipmentStatus").val(),
                BPO: $("#hdnBPO").val(),
                DateRange: $("#hdnCreatedDate").val(),
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

    this.DownloadPendingData = function () {
        $(".preloader").show();
        $.ajax({
            url: UrlContent("Billing/DownloadPendingData"),
            type: "POST",
            data: {
                SearchText: $("#txtSearch").val(),
                LeadsStatus: $("#hdnLeadStatus").val(),
                EVStatus: $("#hdnEVStatus").val(),
                ShipmentStatus: $("#hdnShipmentStatus").val(),
                BPO: $("#hdnBPO").val(),
                DateRange: $("#hdnCreatedDate").val(),
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

    this.DownloadApprovalPending = function () {
        $(".preloader").show();
        $.ajax({
            url: UrlContent("Billing/DownloadApprovalPending"),
            type: "POST",
            data: {
                SearchText: $("#txtSearch").val(),
                EVStatus: $("#hdnEVStatus").val(),
                ShipmentStatus: $("#hdnShipmentStatus").val(),
                BPO: $("#hdnBPO").val(),
                DateRange: $("#hdnCreatedDate").val(),
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
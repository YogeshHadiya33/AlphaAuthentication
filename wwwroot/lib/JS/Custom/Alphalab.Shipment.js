AlphaLab.Shipment = new function () {

    //Variable
    var SelectedRecordArray = [];

    this.Option = {
        ShipmentTable: null,
        TableId: "",
        ShipmentearchId: "",
        DrildownShipmentTable: null,
        DrillDownValue1: "",
        RoleId: 0
    }

    this.Init = function (options) {
        AlphaLab.Shipment.Option = $.extend({}, AlphaLab.Shipment.Option, options);
        AlphaLab.Shipment.Option.ShipmentTable = $(`#${AlphaLab.Shipment.Option.TableId}`).DataTable(
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
                    url: UrlContent("Shipments/GetList"),
                    data: function (dtParms) {
                        dtParms.search.value = $("#txtSearch").val();
                        dtParms.LeadsStatus = $("#hdnLeadStatus").val();
                        dtParms.ShipmentStatus = $("#hdnShipmentStatus").val();
                        dtParms.BPO = $("#hdnBPO").val();
                        dtParms.DateRange = $("#hdnCreatedDate").val();
                        return dtParms;
                    },
                    complete: function (response, result) {

                        var tableBottom = $(`#${AlphaLab.Shipment.Option.TableId}_wrapper .btmpage`).detach();
                        $(".top_pagging").prepend(tableBottom);
                        $(".dataTables_length select").removeClass("form-control form-control-sm").addClass("form-select")
                        var lgndrp = $(`#${AlphaLab.Shipment.Option.TableId}_length`).detach();
                        $(".lgndrp").prepend(lgndrp);
                        $(`#${AlphaLab.Shipment.Option.TableId}_wrapper .top`).remove();
                        $("#searchId").removeClass("hide");
                    }
                },
                "columns": [
                    {
                        data: "shipmentId", orderable: false, width: "1%",
                        render: function (data, type, row) {
                            var renderResult = "";
                            if (AlphaLab.Shipment.Option.RoleId == AlphaLab.Common.Role.Operation_Admin) {
                                renderResult += '<a href="' + (UrlContent("Shipments/Add?id=") + row.encId + "&view=" + true) + '" title="View"  class="mr-2 fs-0"  style="color:#333333"><b><i class="far fa-eye viewHover" ></i></b></a>';
                            }
                            else {
                                renderResult += '<input type="checkbox" class="deleteAll mr-2 fs-0" value="' + data + '" onChange="AlphaLab.Shipment.OnSelectRecord(\'' + data + '\',this)"/>'
                                renderResult += '<a href="' + (UrlContent("Shipments/Add?id=") + row.encId) + '" class="mr-2 fs-0" title="Edit" style="color:#333333"><b><i class="far fa-edit editHover" ></i></b></a>';
                                renderResult += '<a href="' + (UrlContent("Shipments/Add?id=") + row.encId + "&view=" + true) + '" title="View"  class="mr-2 fs-0"  style="color:#333333"><b><i class="far fa-eye viewHover" ></i></b></a>';

                                if (row.trackingNo != null && row.trackingNo != "" && typeof row.trackingNo != "undefined")
                                    renderResult += '<a href="javascript:AlphaLab.Common.Track(\'' + row.trackingNo + '\')" title="Track " style="color:#333333"><b><i class="fas fa-truck viewHover mr-2 fs-0" ></i></b></a>'
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
                    { data: "shipmentDate", name: "ShipmentDate", autoWidth: true },
                    { data: "trackingNo", name: "TrackingNo", autoWidth: true },
                    { data: "batchNo", name: "BatchNo", autoWidth: true },
                    { data: "returnDate", name: "ReturnDate", autoWidth: true },
                    { data: "returnTrackingNo", name: "ReturnTrackingNo", autoWidth: true },
                    {
                        data: "bpo", name: "BPO", autoWidth: true, visible: AlphaLab.Shipment.Option.RoleId == AlphaLab.Common.Role.SuperAdmin || AlphaLab.Shipment.Option.RoleId == AlphaLab.Common.Role.User_Admin || AlphaLab.Shipment.Option.RoleId == AlphaLab.Common.Role.Operation_Admin
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
        AlphaLab.Shipment.Option.ShipmentTable.ajax.reload();
    }

    this.Save = function (redirectionType = 3) {
        if ($("#ShipmentFormId").valid()) {
            $(".preloader").show();
            var formdata = $("#ShipmentFormId").serialize();
            $.ajax({
                type: "Post",
                url: UrlContent("Shipments/Save/"),
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
                                    window.location.href = UrlContent("Shipments/Add?id=" + result.result);
                                } else {
                                    window.location.href = UrlContent("Shipments");
                                }
                            } else if (redirectionType == AlphaLab.Common.Redirection_Type.Save_And_Close) {
                                window.location.href = UrlContent("Shipments");
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
            $("#btnBulkTracking").removeClass("hide");
        }
        else {
            $("#btnBulkTracking").addClass("hide");
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
        $('#ShipmentTableBody input:checked').each(function () {
            SelectedRecordArray.push($(this).attr('value'));
        });
        if (SelectedRecordArray.length > 0) {
            $('#btnBulkTracking').removeClass("hide");
        }
        else {
            $('#btnBulkTracking').addClass("hide");
        }

    });

    this.BulkTracking = function () {
        SelectedRecordArray = [];
        $('.deleteAll:checked').each(function () {
            SelectedRecordArray.push($(this).attr('value'));
        });
        var count = SelectedRecordArray.length;
        if (count > 0) {
            Swal.fire({
                title: '<h4><b>Are you sure want to update status of these ' + count + ' Shipment?<b></h4>',
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
                        url: UrlContent("Shipments/BulkTracking"),
                        data: {
                            ids: SelectedRecordArray,
                        },
                        success: function (result) {
                            $('.preloader').hide();
                            if (result.isSuccess) {
                                $('.selectAll').prop('checked', false);
                                AlphaLab.Shipment.Option.ShipmentTable.ajax.reload();
                                SelectedRecordArray = [];
                                $('#btnBulkTracking').addClass("hide");
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
            url: UrlContent("Shipments/DownloadSpreadsheetReport"),
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

    this.OnChangeShipmentStatus = function () {
        var statusVal = $("#shippingStatusId").val();
        $("#txtDeliveredDate").val("");
        $("#txtReturnDate").val("");
        $("#txtReturnTrackingNo").val("");
        if (statusVal == 3 || statusVal == 2) {
            if (statusVal == 3) { // retuned
                $("#showdivId").removeClass('hide');
            }
            else {
                $("#showdivId").addClass('hide');
            }
            if (statusVal == 2) {  // delivered
                $("#showDeliveredDatedivId").removeClass('hide');
            }
            else {
                $("#showDeliveredDatedivId").addClass('hide');
            }
        }
        else {
            $("#showdivId").addClass('hide');
            $("#showDeliveredDatedivId").addClass('hide');
            $("#txtDeliveredDate").val("");
            $("#txtReturnDate").val("");
            $("#txtReturnTrackingNo").val("");
        }
    }

    this.DownloadPendingShipments = function () {
        $(".preloader").show();
        $.ajax({
            url: UrlContent("Shipments/DownloadPendingData"),
            type: "POST",
            data: {
                SearchText: $("#txtSearch").val(),
                LeadsStatus: $("#hdnLeadStatus").val(),
                EVStatus: $("#hdnEVStatus").val(),
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
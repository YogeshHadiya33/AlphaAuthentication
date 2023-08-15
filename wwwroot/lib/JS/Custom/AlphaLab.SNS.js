AlphaLab.SNS = new function () {

    //Variable 
    this.Option = {
        Table: null,
        TableId:"",
        CheckEligibilityTable: null,
        RoleId: 0
    }

    this.Init = function (options) {
        AlphaLab.SNS.Option = $.extend({}, AlphaLab.SNS.Option, options);
        AlphaLab.SNS.Option.Table = $(`#${AlphaLab.SNS.Option.TableId}`).DataTable(
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
                    url: UrlContent("SNS/GetList"),
                    data: function (dtParms) {
                        dtParms.search.value = $("#txtSearch").val();
                        dtParms.LeadsStatus = $("#hdnLeadStatus").val();
                        dtParms.EVStatus = $("#hdnEVStatus").val();
                        dtParms.ShipmentStatus = $("#hdnShipmentStatus").val();
                        dtParms.BPO = $("#hdnBPO").val();
                        dtParms.DateRange = $("#hdnCreatedDate").val();
                        dtParms.SNSStatus = $("#hdnSNSStatus").val();
                        dtParms.AudioStatus = $("#hdnAudioStatus").val();
                        return dtParms;
                    },
                    complete: function (response, result) {

                        var tableBottom = $(`#${AlphaLab.SNS.Option.TableId}_wrapper .btmpage`).detach();
                        $(".top_pagging").prepend(tableBottom);
                        $(".dataTables_length select").removeClass("form-control form-control-sm").addClass("form-select")
                        var lgndrp = $(`#${AlphaLab.SNS.Option.TableId}_length`).detach();
                        $(".lgndrp").prepend(lgndrp);
                        $(`#${AlphaLab.SNS.Option.TableId}_wrapper .top`).remove();
                        $("#searchId").removeClass("hide");
                    }
                },
                "columns": [
                    {
                        data: "eligibilityId", orderable: false,
                        render: function (data, type, row) {
                            var renderResult = "";
                            if (AlphaLab.SNS.Option.RoleId == AlphaLab.Common.Role.Operation_Admin) {
                                renderResult += '<a href="' + (UrlContent("SNS/Add?id=") + row.encId + "&view=" + true) + '" title="View" class="mr-2 fs-0"  style="color:#333333"><b><i class="far fa-eye viewHover" ></i></b></a>';
                            }
                            else {
                                renderResult += '<input type="checkbox" class="deleteAll  mr-2 " value="' + data + '" onChange="AlphaLab.SNS.OnSelectRecord(\'' + data + '\',this)"/>'
                                renderResult += '<a href="' + (UrlContent("SNS/Add?id=") + row.encId) + '" class="mr-2 fs-0" title="Edit" style="color:#333333"><b><i class="far fa-edit editHover" ></i></b></a>'
                                renderResult += '<a href="' + (UrlContent("SNS/Add?id=") + row.encId + "&view=" + true) + '" title="View" class="mr-2 fs-0"  style="color:#333333"><b><i class="far fa-eye viewHover" ></i></b></a>';
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
                        data: "bpo", name: "BPO", autoWidth: true, visible: AlphaLab.SNS.Option.RoleId == AlphaLab.Common.Role.SuperAdmin || AlphaLab.SNS.Option.RoleId == AlphaLab.Common.Role.User_Admin || AlphaLab.SNS.Option.RoleId == AlphaLab.Common.Role.Operation_Admin
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
                    {
                        data: "audioCount", name: "AudioCount", autoWidth: true, className: "text-center",
                        render: function (data, type, row) {
                            return AlphaLab.Common.GetAudioRecordHtml(data)
                        }
                    },
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
        AlphaLab.SNS.Option.Table.ajax.reload();
    }

    this.Save = function (redirectionType = 3) {
        if ($("#SNSFormId").valid()) {
            $(".preloader").show();
            var formdata = $("#SNSFormId").serialize();
            $.ajax({
                type: "Post",
                url: UrlContent("SNS/Save/"),
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
                                    window.location.href = UrlContent("SNS/Add?id=" + result.result);
                                } else {
                                    window.location.href = UrlContent("SNS");
                                }
                            } else if (redirectionType == AlphaLab.Common.Redirection_Type.Save_And_Close) {
                                window.location.href = UrlContent("SNS");
                            }
                        })
                    } else {
                        AlphaLab.Common.ToastrError(result.message);
                    }
                },
            })
        }
    }

    this.DownloadSpreadsheetReport = function () {
        $(".preloader").show();
        $.ajax({
            url: UrlContent("SNS/DownloadSpreadsheetReport"),
            type: "POST",
            data: {
                SearchText: $("#txtSearch").val(),
                LeadsStatus: $("#hdnLeadStatus").val(),
                EVStatus: $("#hdnEVStatus").val(),
                ShipmentStatus: $("#hdnShipmentStatus").val(),
                DateRange: $("#hdnCreatedDate").val(),
                SNSStatus: $("#hdnSNSStatus").val(),
                AudioStatus: $("#hdnAudioStatus").val(),
                BPO: $("#hdnBPO").val(),
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

    this.DownloadPendingSNS = function () {
        $(".preloader").show();
        $.ajax({
            url: UrlContent("SNS/DownloadPendingSNS"),
            type: "POST",
            data: {
                SearchText: $("#txtSearch").val(),
                LeadsStatus: $("#hdnLeadStatus").val(),
                EVStatus: $("#hdnEVStatus").val(),
                ShipmentStatus: $("#hdnShipmentStatus").val(),
                DateRange: $("#hdnCreatedDate").val(),
                SNSStatus: $("#hdnSNSStatus").val(),
                AudioStatus: $("#hdnAudioStatus").val(),
                BPO: $("#hdnBPO").val(),
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
            $("#btnBulkByPass").removeClass("hide")
        }
        else {
            $("#btnBulkByPass").addClass("hide")
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
            $("#btnBulkByPass").removeClass("hide")
        }
        else {
            $("#btnBulkByPass").addClass("hide")
        }
    });


    this.ByPassSNS = function () {
        SelectedRecordArray = [];
        $('.deleteAll:checked').each(function () {
            SelectedRecordArray.push($(this).attr('value'));
        });
        var count = SelectedRecordArray.length;
        if (count > 0) {
            Swal.fire({
                title: '<h4><b>Are you sure want to Bypass SNS & move to Billing for these ' + count + ' Leads? <b></h4>',
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
                        url: UrlContent("SNS/ByPassSNS"),
                        data: {
                            ids: SelectedRecordArray,
                        },
                        success: function (result) {
                            $('.preloader').hide();
                            if (result.isSuccess) {
                                $('.selectAll').prop('checked', false);
                                AlphaLab.SNS.Option.Table.ajax.reload();
                                SelectedRecordArray = [];
                                $('#btnBulkByPass').addClass("hide"); 
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

}
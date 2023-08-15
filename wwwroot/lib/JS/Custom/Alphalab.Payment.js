AlphaLab.Payment = new function () {

    //Variable
    var SelectedRecordArray = [];

    this.Option = {
        PaymentTable: null,
        TableId: "",
        PaymentearchId: "",
        DrildownPaymentTable: null,
        DrillDownValue1: "",
        RoleId: 0
    }

    this.Init = function (options) {
        AlphaLab.Payment.Option = $.extend({}, AlphaLab.Payment.Option, options);
        AlphaLab.Payment.Option.PaymentTable = $(`#${AlphaLab.Payment.Option.TableId}`).DataTable(
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
                    url: UrlContent("Payments/GetList"),
                    data: function (dtParms) {
                        dtParms.search.value = $("#txtSearch").val();
                        dtParms.BPO = $("#hdnBPO").val();
                        return dtParms;
                    },
                    complete: function (response, result) {
                        var tableBottom = $(`#${AlphaLab.Payment.Option.TableId}_wrapper .btmpage`).detach();
                        $(".top_pagging").prepend(tableBottom);
                        $(".dataTables_length select").removeClass("form-control form-control-sm").addClass("form-select")
                        var lgndrp = $(`#${AlphaLab.Payment.Option.TableId}_length`).detach();
                        $(".lgndrp").prepend(lgndrp);
                        $(`#${AlphaLab.Payment.Option.TableId}_wrapper .top`).remove();
                        $("#searchId").removeClass("hide");
                    }
                },
                "columns": [
                    //{
                    //    data: "paymentId", orderable: false, width: "1%",
                    //    render: function (data, type, row) {
                    //        var renderResult = "";
                    //        if (AlphaLab.Payment.Option.RoleId == AlphaLab.Common.Role.Operation_Admin) {
                    //            renderResult += '<a href="' + (UrlContent("Payments/Add?id=") + row.encId + "&view=" + true) + '" title="View" style="color:#333333"><b><i class="ti-eye viewHover" style="padding: 5px;font-size: 14px"></i></b></a>'
                    //        }

                    //        else {
                    //            /*   renderResult += '<input type="checkbox" class="deleteAll" value="' + data + '" onChange="AlphaLab.Payment.OnSelectRecord(\'' + data + '\',this)"/>'*/
                    //            renderResult += '<a href="' + (UrlContent("Payments/Add?id=") + row.encId) + '" class="" title="Edit" style="color:#333333"><b><i class="ti-pencil editHover" style="padding: 5px;font-size: 14px"></i></b></a>'
                    //            renderResult += '<a href="' + (UrlContent("Payments/Add?id=") + row.encId + "&view=" + true) + '" title="View" style="color:#333333"><b><i class="ti-eye viewHover" style="padding: 5px;font-size: 14px"></i></b></a>'
                    //        }
                    //        return renderResult;
                    //    }
                    //},
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
                    { data: "paymentDate", name: "PaymentDate", autoWidth: true },
                    {
                        data: "bpo", name: "BPO", autoWidth: true, visible: AlphaLab.Payment.Option.RoleId == AlphaLab.Common.Role.SuperAdmin || AlphaLab.Payment.Option.RoleId == AlphaLab.Common.Role.User_Admin || AlphaLab.Payment.Option.RoleId == AlphaLab.Common.Role.Operation_Admin
                    },
                    { data: "firstName", name: "FirstName", autoWidth: true },
                    { data: "lastName", name: "LastName", autoWidth: true },
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
        AlphaLab.Payment.Option.PaymentTable.ajax.reload();
    }

    this.SavePaymentDetails = function () {
        if ($("#PaymentFormId").valid()) {
            $(".preloader").show();
            var formdata = $("#PaymentFormId").serialize();
            $.ajax({
                type: "Post",
                url: UrlContent("Payments/Save/"),
                data: formdata,
                success: function (result) {
                    $(".preloader").hide();
                    if (result.isSuccess) {
                        AlphaLab.Common.ToastrSuccess(result.message);
                        window.location.href = UrlContent("Payments");
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
            $("#btnMoveToEV").removeClass("hide")
        }
        else {
            $("#btnDelete").addClass("hide")
            $("#btnMoveToEV").addClass("hide")
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
        $('#PaymentTableBody input:checked').each(function () {
            SelectedRecordArray.push($(this).attr('value'));
        });
        if (SelectedRecordArray.length > 0) {
            $('#btnDelete').removeClass("hide");
            $('#btnMoveToEV').removeClass("hide");
        }
        else {
            $('#btnDelete').addClass("hide");
            $('#btnMoveToEV').addClass("hide");
        }

    });

    this.Delete = function () {
        var count = SelectedRecordArray.length;
        if (count > 0) {
            Swal.fire({
                title: '<h4><b>Are you sure you want to delete these ' + count + ' Payment?<b></h4>',
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
                        url: UrlContent("Payments/Delete"),
                        data: {
                            ids: SelectedRecordArray,
                        },
                        success: function (result) {
                            $('.preloader').hide();
                            if (result.isSuccess) {
                                $('.selectAll').prop('checked', false);
                                AlphaLab.Payment.Option.PaymentTable.ajax.reload();
                                SelectedRecordArray = [];
                                $('#btnDelete').addClass("hide");
                                $('#btnMoveToEV').addClass("hide");
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
            url: UrlContent("Payments/DownloadSpreadsheetReport"),
            type: "POST",
            data: {
                SearchText: $("#txtSearch").val(),
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
}
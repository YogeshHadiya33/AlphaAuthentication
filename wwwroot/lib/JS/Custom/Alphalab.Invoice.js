AlphaLab.Invoice = new function () {
    var SelectedRecordArray = [];
    var balanceAmount = 0;
    var totalRemaing = [];
    this.Option = {
        Table: null,
        PaymentTable: null,
        InvoiceTableId: "",
        PaymentTableId: "",
        InvoiceTableSearchId: "",
        PaymentTableSearchId: "",
        TableLengthId: "",
        TableLength: "",
        ClientInviocTableId: "",
    };

    this.Init = function (options) {
        AlphaLab.Invoice.Option = $.extend({}, AlphaLab.Invoice.Option, options);
        AlphaLab.Invoice.Option.Table = $("#" + AlphaLab.Invoice.Option.InvoiceTableId).DataTable({
            searching: false,
            paging: true,
            "serverSide": "true",
            "processing": true,
            "bPaginate": true,
            dom: '<"top"flp>rt<"row btmpage mb-1 mt-2"<"col-sm-3 txtSearchId"><"col-sm-2 lgndrp"><"col-sm-4"i><"col-sm-3"p>>',
            bLengthChange: true,
            "bInfo": true,
            async: false,
            lengthMenu: [[10, 25, 50, 100, 500], [10, 25, 50, 100, 500]],
            pageLength: 25,
            ajax: {
                type: "Post",
                url: "/Invoice/GetInvoiceList",
                data: function (dtParms) {
                    dtParms.search.value = $("#" + AlphaLab.Invoice.Option.InvoiceTableSearchId).val();
                    return dtParms;
                },
                "complete": function (response, result) {

                    var tableBottom = $("#InvoiceTableId_wrapper .btmpage").detach();
                    $(".top_pagging").prepend(tableBottom);
                    var lgndrp = $("#InvoiceTableId_length").detach();
                    $(".lgndrp").prepend(lgndrp);
                    $("#InvoiceTableId_wrapper .top").remove();
                    $("#searchId").removeClass("hide");
                }
            },
            "columns": [
                { "data": "invoiceNumber", "name": "InvoiceId", "autoWidth": true },
                { "data": "invoiceMonthYear", "name": "MonthName", "autoWidth": true },
                {
                    "data": "invoiceAmount", "name": "invoiceAmount", "className": "text-right", "autoWidth": true,
                    "render": function (data, type, row) {
                        return AlphaLab.Common.FormatMoney(data);
                    }
                },

                /* { "data": "totalEv", "name": "TotalEv", class: "text-right", "autoWidth": true },
                 {
                     "data": "evrate", "name": "Evrate", "className": "text-right", "autoWidth": true,
                     "render": function (data, type, row) {
                         return AlphaLab.Common.FormatMoney(data);
                     }
                 },*/
                {
                    "data": "evAmount", "name": "EvAmount", "className": "text-right", "autoWidth": true,
                    "render": function (data, type, row) {
                        return AlphaLab.Common.FormatMoney(data);
                    }
                },
                /* { "data": "comment", "name": "Comment", class: "text-right", "autoWidth": true },*/
                {
                    "data": "showOtherAmount", "name": "ShowOtherAmount", "className": "text-right", "autoWidth": true,
                    "render": function (data, type, row) {
                        return AlphaLab.Common.FormatMoney(data);
                    }
                },
                {
                    "data": "totalAmount", "name": "TotalAmount", "className": "text-right", "autoWidth": true,
                    "render": function (data, type, row) {
                        return AlphaLab.Common.FormatMoney(data);
                    }
                },
                {
                    "data": "paidAmount", "name": "PaidAmount", "className": "text-right", "autoWidth": true,
                    "render": function (data, type, row) {
                        return AlphaLab.Common.FormatMoney(data);
                    }
                },
                {
                    "data": "remaingAmount", "name": "RemaingAmount", "className": "text-right", "autoWidth": true,
                    "render": function (data, type, row) {
                        return AlphaLab.Common.FormatMoney(data);
                    }
                },
                {
                    "data": "paidAmount", "name": "PaidAmount", "autoWidth": true, className: "text-center", render: function (data, type, row) {
                        if (data == row.totalAmount) {
                            return '<span class="badge badge-success font-12">Paid</span>';
                        }
                        else if (data == 0 || data == null) {
                            return '<span class="badge badge-danger font-12">Not Paid</span>';
                        } else if (data < row.totalAmount) {
                            return '<span class="badge badge-info font-12">Partial Paid</span>';
                        }
                    }
                },
                {
                    "data": "encId", "className": "text-center", "autoWidth": true, orderable: false,
                    "render": function (data, type, row) {
                        var btn = ""
                        btn += '<button title="Download" class="btn btn-primary btn-sm  mt-1 mr-1" onclick="AlphaLab.Invoice.Download(\'' + data + '\')"><i class=" ti-download "></i></button>';
                        if (row.paidAmount == 0) {
                            btn += '<button title="Delete" class="btn btn-danger btn-sm  mt-1 mr-1" onclick="AlphaLab.Invoice.Delete(\'' + data + '\')"><i class=" ti-trash "></i></button>';
                        }
                        btn += '<button title="View" class="btn btn-info btn-sm  mt-1 mr-1" onclick="AlphaLab.Invoice.AddInvoice(\'' + data + '\')"><i class="ti-eye "></i></button>';
                        return btn;
                    }
                },
            ],
            order: [0, "DESC"]

        });
    }

    this.Search = function () {
        AlphaLab.Invoice.Option.Table.ajax.reload();;
    }

    this.SearchPayment = function () {
        AlphaLab.Invoice.Option.PaymentTable.ajax.reload();;
    }

    this.AddInvoice = function (id) {
        $.ajax({
            type: "GET",
            url: UrlContent("Invoice/AddInvoice/") + "?id=" + id,
            success: function (data) {
                $("#contactDialogContent").html(data);
                AlphaLab.Invoice.SubscriptionTypeOnEVCheck()
                AlphaLab.Invoice.OnEVTypeEvCheck()
                AlphaLab.Invoice.OnOtherTypeEVCheck()
                AlphaLab.Common.InitMask();
                AlphaLab.Invoice.GetTotalEVAmount();
                $('.date-picker').datepicker({
                    orientation: "bottom",
                    autoclose: true,
                    format: 'mm/dd/yyyy',
                    todayHighlight: true,
                });
                InitDateKeyEvent();
                $.validator.unobtrusive.parse($("#SaveInvoiceForm"));
                $("#contact-dialog").modal('show');
            }
        })
    }

    this.GetTotalEv = function () {
        $.ajax({
            url: UrlContent("Invoice/GetTotalEv/"),
            type: "POST",
            data: {
                startDate: $("#StartDateId").val(),
                endDate: $("#EndDateId").val(),
            },
            success: function (data) {
                $("#hidTotalEv").val(data);
                $("#totalEv").val(data.toFixed(2));
                AlphaLab.Invoice.GetTotalEVAmount();
            }
        })
    }

    this.GetTotalEVAmount = function () {
        var totalAmount = 0;
        var totalEv = $("#totalEv").val();
        var EvRate = $("#Evrate").val();
        var otherAmount = $("#otherAmount").val();
        var invoiceAmount = $("#invoiceAmount").val();
        if (!isNaN(EvRate) && EvRate != "" && EvRate != "undefined")
            var EvAmount = totalEv * EvRate;
        $("#EvAmount").val(EvAmount.toFixed(2))
        if (!isNaN(invoiceAmount) && invoiceAmount != "" && invoiceAmount != "undefined")
            totalAmount += parseFloat(invoiceAmount)
        if (!isNaN(EvAmount) && EvAmount != "" && EvAmount != "undefined")
            totalAmount += parseFloat(EvAmount)
        if (!isNaN(otherAmount) && otherAmount != "" && otherAmount != "undefined")
            totalAmount += parseFloat(otherAmount)
        if (totalAmount > 0)
            $("#totalAmount").text(AlphaLab.Common.FormatMoney(totalAmount))
    }

    this.SaveInvoiceData = function () {
        if ($("#SaveInvoiceForm").valid()) {
            $(".preloader").show();
            var formdata = $("#SaveInvoiceForm").serialize();
            $.ajax({
                type: "Post",
                url: UrlContent("Invoice/SaveInvoiceData/"),
                data: formdata,
                success: function (result) {
                    $(".preloader").hide();
                    if (result.isSuccess) {
                        AlphaLab.Common.ToastrSuccess(result.message);
                        AlphaLab.Invoice.Option.Table.ajax.reload();
                        $("#contact-dialog").modal("hide");
                    } else {
                        AlphaLab.Common.ToastrError(result.message);
                    }
                },
            })
        }
    }

    this.Download = function (id) {
        $(".preloader").show();
        $.ajax({
            type: "GET",
            url: UrlContent("Invoice/Download/" + id),
            success: function (data) {
                $(".preloader").hide();
                if (data.isSuccess) {
                    window.location.href = UrlContent("Invoice/DownloadFile?fileName=" + data.message);
                } else {
                    AlphaLab.Common.ToastrError(data.message);
                }
            }
        })
    }

    this.Delete = function (id) {
        Swal.fire({
            title: '<h4>Are you sure want to delete this Invoice?</h4>',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#6c757d',
            confirmButtonText: '<i class="fas fa-trash"></i> Delete',
            cancelButtonText: '<i class="ti-na"></i> Cancel'
        }).then((result) => {
            if (result.value) {
                $.ajax({
                    type: "POST",
                    url: UrlContent("Invoice/Delete") + "?id=" + id,
                    success: function (result) {
                        if (result.isSuccess) {
                            AlphaLab.Invoice.Option.Table.ajax.reload();
                            Swal.fire({
                                icon: 'success',
                                text: result.message,
                            });
                        }
                        else {
                            Swal.fire({
                                icon: 'error',
                                text: result.message,
                            })
                        }
                    }
                })
            }
        })

    }

    this.SubscriptionTypeOnEVCheck = function () {
        if ($("#SubscriptionType").is(':checked')) {
            $("#SubscriptionDiv").removeClass('hide');
        } else
            $("#SubscriptionDiv").addClass('hide');
    }

    this.OnEVTypeEvCheck = function () {
        if ($("#EvType").is(':checked')) {
            $("#EvDiv").removeClass('hide');
        } else
            $("#EvDiv").addClass('hide');
    }

    this.OnOtherTypeEVCheck = function () {
        if ($("#OtherType").is(':checked')) {
            $("#OtherDiv").removeClass('hide');
        } else
            $("#OtherDiv").addClass('hide');
    }

    this.Payment = function (options) {
        AlphaLab.Invoice.Option = $.extend({}, AlphaLab.Invoice.Option, options);
        AlphaLab.Invoice.Option.PaymentTable = $("#" + AlphaLab.Invoice.Option.PaymentTableId).DataTable({
            searching: false,
            paging: true,
            "serverSide": "true",
            "processing": true,
            "bPaginate": true,
            dom: '<"top"flp>rt<"row btmpage mb-1 mt-2"<"col-sm-3 txtSearchId"><"col-sm-2 lgndrp"><"col-sm-4"i><"col-sm-3"p>>',
            bLengthChange: true,
            "bInfo": true,
            async: false,
            lengthMenu: [[10, 25, 50, 100, 500], [10, 25, 50, 100, 500]],
            pageLength: 25,
            ajax: {
                type: "Post",
                url: "/Invoice/GetPaymentList",
                data: function (dtParms) {
                    dtParms.search.value = $("#" + AlphaLab.Invoice.Option.PaymentTableSearchId).val();
                    return dtParms;
                },
                "complete": function (response, result) {

                    var tableBottom = $("#clientPaymentTable_wrapper .btmpage").detach();
                    $(".top_pagging").prepend(tableBottom);
                    var lgndrp = $("#clientPaymentTable_length").detach();
                    $(".lgndrp").prepend(lgndrp);
                    $("#clientPaymentTable_wrapper .top").remove();
                    $("#searchId").removeClass("hide");
                }
            },
            "columns": [
                { "data": "clientPaymentId", "name": "ClientPaymentId" },
                {
                    "data": "paidAmount", "name": "PaidAmount", "className": "text-right", "autoWidth": true,
                    "render": function (data, type, row) {
                        return AlphaLab.Common.FormatMoney(data);
                    }
                },
                { "data": "paidDateString", "name": "PaidDateString", "autoWidth": true, "className": "text-center" },
                { "data": "paymentMode", "name": "PaymentMode", "autoWidth": true },
                { "data": "refNo", "name": "RefNo", "autoWidth": true },
                { "data": "comments", "name": "Comments", "autoWidth": true },
                {
                    "data": "encClientInvoicePaymentId", "className": "text-center", "width": "70px", orderable: false,
                    "render": function (data, type, row) {
                        var btn = ""
                        btn += '<button title="View" class="btn btn-info btn-sm  mt-1 mr-1" onclick="AlphaLab.Invoice.AddPayment(\'' + data + '\')"><i class="ti-eye "></i></button>';
                         btn += '<button title="Delete" class="btn btn-danger btn-sm  mt-1 mr-1" onclick="AlphaLab.Invoice.DeleteInvoicePayment(\'' + data + '\')"><i class=" ti-trash "></i></button>';
                        return btn
                    }
                },

            ],
            order: [0, "DESC"]

        });
    }

    this.AddPayment = function (id) {
        $.ajax({
            type: "GET",
            url: UrlContent("Invoice/_AddPayment/") + "?id=" + id, 
            success: function (data) {
                $("#PaymentDialogContent").html(data);
                AlphaLab.Common.InitMask();
                $.validator.unobtrusive.parse($("#SavePaymentForm"));
                $("#Payment-dialog").modal('show');
            }
        })
    }

    this.SavePaymentData = function () {
        if ($("#SavePaymentForm").valid()) {
            $(".preloader").show();
            $("#selectArrayId").val(SelectedRecordArray);
            var arrayval = $("#selectArrayId").val();
            var formdata = $("#SavePaymentForm").serialize();
            $.ajax({
                type: "Post",
                url: UrlContent("Invoice/SavePaymentData/"),
                data: formdata,
                success: function (result) {
                    $(".preloader").hide();
                    if (result.isSuccess) {
                        AlphaLab.Common.ToastrSuccess(result.message);
                        AlphaLab.Invoice.Option.PaymentTable.ajax.reload();
                        $("#Payment-dialog").modal("hide");
                    } else {
                        AlphaLab.Common.ToastrError(result.message);
                    }
                },
            })
        }
    }

    this.ShowInvoiceList = function () {
        if ($("#SavePaymentForm").valid()) {
            var amount = $("#PaidAmount").val();
            balanceAmount = amount;
            $.ajax({
                type: "GET",
                url: UrlContent("Invoice/_ClientInvoiceList/"),
                data: {
                    amount: amount,
                },
                success: function (data) {
                    $("#reportByDateBilled").html('');
                    $("#reportByDateBilled").html(data);
                    $("#reportByDateBilled").show();
                }
            })
        }
    }

    this.ClientInviocTableInit = function (options) {
        AlphaLab.Invoice.Option = $.extend({}, AlphaLab.Invoice.Option, options);
        AlphaLab.Invoice.Option.Table = $("#" + AlphaLab.Invoice.Option.ClientInviocTableId).DataTable({
            searching: false,
            paging: true,
            "serverSide": "true",
            "processing": true,
            "bPaginate": true,
            dom: '<"top"flp>rt<"row btmpage mb-1 mt-2"<"col-sm-3 txtSearchId"><"col-sm-2 lgndrp"><"col-sm-4"i><"col-sm-3"p>>',
            bLengthChange: true,
            "bInfo": true,
            async: false,
            lengthMenu: [[10, 25, 50, 100, 500], [10, 25, 50, 100, 500]],
            pageLength: 25,
            ajax: {
                type: "Post",
                url: "/Invoice/GetPandingInvoiceList",
                data: function (dtParms) {
                    return dtParms;
                },
                "complete": function (response, result) {
                    var tableBottom = $("#clientInvoiceTable_wrapper .btmpage").detach();
                    var lgndrp = $("#iclientInvoiceTable_length").detach();
                    $("#clientInvoiceTable_wrapper .top").remove();
                    $("#searchId").removeClass("hide");
                }
            },
            "columns": [
                {
                    "data": "invoiceId", id: "InvoiceId ", "className": "text-center", "width": "70px", orderable: false,
                    "render": function (data, type, row) {
                        var renderResult = '<input type="checkbox" class="chkAddClaimComment" data-amt="' + row.remaingAmount + '" onChange="AlphaLab.Invoice.OnSelectCheckBoxFor(\'' + data + '\',this)"/>';
                        return renderResult;
                    }
                },
                { "data": "invoiceNumber", "name": "InvoiceId", "autoWidth": true },
                { "data": "invoiceMonthYear", "name": "MonthName", "autoWidth": true },
                {
                    "data": "invoiceAmount", "name": "invoiceAmount", "className": "text-right", "autoWidth": true,
                    "render": function (data, type, row) {
                        return AlphaLab.Common.FormatMoney(data);
                    }
                },

                {
                    "data": "evAmount", "name": "EvAmount", "className": "text-right", "autoWidth": true,
                    "render": function (data, type, row) {
                        return AlphaLab.Common.FormatMoney(data);
                    }
                },
                {
                    "data": "showOtherAmount", "name": "ShowOtherAmount", "className": "text-right", "autoWidth": true,
                    "render": function (data, type, row) {
                        return AlphaLab.Common.FormatMoney(data);
                    }
                },
                {
                    "data": "totalAmount", "name": "TotalAmount", "className": "text-right", "autoWidth": true,
                    "render": function (data, type, row) {
                        return AlphaLab.Common.FormatMoney(data);
                    }
                },
                {
                    "data": "paidAmount", "name": "PaidAmount", "className": "text-right", "autoWidth": true,
                    "render": function (data, type, row) {
                        return AlphaLab.Common.FormatMoney(data);
                    }
                },
                {
                    "data": "remaingAmount", "name": "RemaingAmount", "className": "text-right", "autoWidth": true,
                    "render": function (data, type, row) {
                        return AlphaLab.Common.FormatMoney(data);
                    }
                },
            ],
            order: [0, "DESC"]

        });
    }

    this.OnSelectCheckBoxFor = function (id, $_this) {
        let invoiceAmount = $($_this).data("amt");
        let totalBalance = parseFloat($("#TotalRemaing").text());
        if ($($_this).is(":checked")) {
            let remaingBalance = totalBalance - invoiceAmount
            $("#TotalRemaing").text(remaingBalance.toFixed(2));
            if (!SelectedRecordArray.includes(id)) {
                SelectedRecordArray.push(id);
            }
        } else {
            let remaingBalance = totalBalance + invoiceAmount;
            $("#TotalRemaing").text(remaingBalance.toFixed(2));
            var index = SelectedRecordArray.indexOf(id);
            SelectedRecordArray.splice(index, 1);
        }
    }

    this.DeleteInvoicePayment = function (id) {
        Swal.fire({
            title: '<h4>Are you sure want to delete this Invoice Payment?</h4>',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#6c757d',
            confirmButtonText: '<i class="fas fa-trash"></i> Delete',
            cancelButtonText: '<i class="ti-na"></i> Cancel'
        }).then((result) => {
            if (result.value) {
                $.ajax({
                    type: "POST",
                    url: UrlContent("Invoice/DeleteInvoicePayment") + "?id=" + id,
                    success: function (result) {
                        if (result.isSuccess) {
                            AlphaLab.Invoice.Option.PaymentTable.ajax.reload();
                            Swal.fire(
                                'Deleted!',
                                'Invoice Payment has been deleted.',
                                'success'
                            );
                        }
                        else {
                            Swal.fire({
                                icon: 'error',
                                title: 'Error Deleting Comment',
                                text: result.message,
                            })
                        }
                    }
                })
            }
        })

    }

}
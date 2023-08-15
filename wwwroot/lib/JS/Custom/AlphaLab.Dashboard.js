AlphaLab.Dashboard = new function () {

    this.Option = {
        BillingTable: null,
        EVSummaryTable: null,
        NotificationTable: null,
        BillingTableId: "",
        BillingearchId: "",
        RoleId: 0
    }
    const datalabels = {
        color: '#000000',
        display: true,
        //anchor: 'center',
        align: 'end',
        font: {
            weight: 'bold',
        },

    }

    this.SetRejectedReportByPayer = function () {
        $.ajax({
            type: "GET",
            url: UrlContent("Dashboard/GetRejectionReportByPayer"),
            success: function (data) {
                $("#rejectedReportByPayer-loader").addClass("hide");
                $("#rejectedReportByPayer").removeClass("hide");
                if (data != null && data.data['datasets'] != null && data.data['datasets'].length > 0) {

                    $('#rejectedReportByPayerGraphDiv').removeClass("hide");
                    $('#rejectedReportByPayerChart').remove();
                    $('#rejectedReportByPayerGraphDiv').append('<canvas id="rejectedReportByPayerChart"><canvas>');
                    var ctx = document.getElementById('rejectedReportByPayerChart').getContext('2d');
                    var canvas = document.getElementById('rejectedReportByPayerChart')
                    $("#rejectedReportByPayerChart").css("cursor", "pointer");
                    var myChart = new Chart(ctx, {
                        type: "horizontalBar",
                        data: data.data,
                        options: {
                            indexAxis: 'y',
                            scales: {
                                xAxes: [{
                                    ticks: {
                                        beginAtZero: true,
                                        stepSize: 1
                                    },
                                    scaleLabel: {
                                        showDatapoints: true,
                                        display: true,
                                        labelString: data.yAxesLabel,
                                        fontSize: 20,
                                    },
                                }],
                                yAxes: [{
                                    ticks: {
                                        autoSkip: false,
                                        labelOffset: 0
                                    },
                                    scaleLabel: {
                                        display: true,
                                        labelString: data.xAxesLabel,
                                        fontSize: 20,
                                    },
                                   // barPercentage: 0.4
                                }]
                            },
                            legend: {
                                display: false,
                                labels: {
                                    fontColor: '#0089cd'
                                },
                                position: "bottom"
                            },
                            responsive: true,
                            plugins: {
                                datalabels: datalabels

                            }

                        }
                    });

                    $(".rejectedReportByPayerNoChartDataLbl").addClass("hide");

                    canvas.onclick = function (evt) {

                        var activePoints = myChart.getElementsAtEvent(evt);
                        if (activePoints != null && activePoints.length > 0) {
                            let dvalue = activePoints[0]._model.label
                            if (dvalue != null && dvalue != "" && typeof dvalue != "undefined") {
                                window.location = UrlContent("Dashboard/BillingView?dtype=1&dvalue=" + AlphaLab.Common.EncodeString(dvalue));
                            }
                        }
                    }
                }
                else {
                    $('#rejectedReportByPayerGraphDiv').addClass("hide");
                    $(".rejectedReportByPayerNoChartDataLbl").removeClass("hide");
                }
            }
        });
    }

    this.SetLeadSummaryReport = function () {
        $.ajax({
            type: "GET",
            url: UrlContent("Dashboard/GetlLeadSummaryReport"),
            success: function (data) {
                $("#leadSummaryReport-loader").addClass("hide");
                $("#leadSummaryReport").removeClass("hide");
                if (data != null && data.data['datasets'] != null && data.data['datasets'].length > 0) {

                    $("#leadSummaryReportGraphDiv").removeClass("hide");
                    $('#leadSummaryReportChart').remove();
                    $('#leadSummaryReportGraphDiv').append('<canvas id="leadSummaryReportChart"><canvas>');
                    var ctx = document.getElementById('leadSummaryReportChart').getContext('2d');
                    var canvas = document.getElementById('leadSummaryReportChart')
                    $("#leadSummaryReportChart").css("cursor", "pointer");
                    var myChart = new Chart(ctx, {
                        type: "horizontalBar",
                        data: data.data,
                        options: {
                            indexAxis: 'y',
                            scales: {
                                xAxes: [{
                                    ticks: {
                                        beginAtZero: true,
                                        stepSize: 1
                                    },
                                    scaleLabel: {
                                        showDatapoints: true,
                                        display: true,
                                        labelString: data.yAxesLabel,
                                        fontSize: 20,
                                    },
                                }],
                                yAxes: [{
                                    ticks: {
                                        autoSkip: false,
                                        labelOffset: 0
                                    },
                                    scaleLabel: {
                                        display: true,
                                        labelString: data.xAxesLabel,
                                        fontSize: 20,
                                    },
                                  //  barPercentage: 0.4
                                }]
                            },
                            legend: {
                                display: false,
                                labels: {
                                    fontColor: '#0089cd'
                                },
                                position: "bottom"
                            },
                            responsive: true,

                            plugins: {
                                datalabels: datalabels

                            },
                        }
                    });


                    $(".leadSummaryReportNoChartDataLbl").addClass("hide");

                    canvas.onclick = function (evt) {
                        var activePoints = myChart.getElementsAtEvent(evt);
                        if (activePoints != null && activePoints.length > 0) {
                            let label = activePoints[0]._model.label
                            if (label != null && label != "" && typeof label != "undefined") {
                                window.location = UrlContent("Dashboard/BillingView?dtype=2&dvalue=" + AlphaLab.Common.EncodeString(label));
                            }
                        }
                    }
                }
                else {
                    $(".leadSummaryReportNoChartDataLbl").removeClass("hide");
                    $("#leadSummaryReportGraphDiv").addClass("hide");
                }
            }
        });
    }

    this.SetCenterSummaryReport = function () {
        let chartDiv = $("#centerSummaryReportByBpoChart");
        if (chartDiv.length > 0) {
            $.ajax({
                type: "GET",
                url: UrlContent("Dashboard/GetCenterSummaryReport"),
                success: function (data) {
                    $("#centerSummaryReportByBpo-loader").addClass("hide");
                    $("#centerSummaryReportByBpo").removeClass("hide");
                    if (data != null && data.data['datasets'] != null && data.data['datasets'].length > 0) {
                        $("#centerSummaryReportByBpoGraphDiv").removeClass("hide");
                        $('#centerSummaryReportByBpoChart').remove();
                        $('#centerSummaryReportByBpoGraphDiv').append('<canvas id="centerSummaryReportByBpoChart"><canvas>');
                        var ctx = document.getElementById('centerSummaryReportByBpoChart').getContext('2d');
                        var canvas = document.getElementById('centerSummaryReportByBpoChart')
                        $("#centerSummaryReportByBpoChart").css("cursor", "pointer");
                        var myChart = new Chart(ctx, {
                            type: "horizontalBar",
                            data: data.data,
                            options: {
                                indexAxis: 'y',
                                scales: {
                                    xAxes: [{
                                        ticks: {
                                            beginAtZero: true,
                                            stepSize: 1,

                                        },
                                        scaleLabel: {
                                            showDatapoints: true,
                                            display: true,
                                            labelString: data.yAxesLabel,
                                            fontSize: 20,
                                        },
                                    }],
                                    yAxes: [{
                                        ticks: {
                                            autoSkip: false,
                                            labelOffset: 0,
                                            callback: function (value, index, ticks) {
                                                let labels = value.split('-_-');
                                                if (labels.length > 0) {
                                                    return labels[0];
                                                } else
                                                    return value;
                                            }
                                        },
                                        scaleLabel: {
                                            display: true,
                                            labelString: data.xAxesLabel,
                                            fontSize: 20,
                                        },
                                        //barPercentage: 0.4
                                    }]
                                },
                                legend: {
                                    display: false,
                                    labels: {
                                        fontColor: '#0089cd'
                                    },
                                    position: "bottom"
                                },
                                responsive: true,
                                plugins: {
                                    datalabels: datalabels

                                }

                            }
                        });


                        $(".centerSummaryReportByBpoNoChartDataLbl").addClass("hide");

                        canvas.onclick = function (evt) { 
                            var activePoints = myChart.getElementsAtEvent(evt);
                            if (activePoints != null && activePoints.length > 0) {
                                let labels = activePoints[0]._model.label.split("-_-")
                                if (labels.length > 1) {
                                    let label = labels[1];

                                    if (label != null && label != "" && typeof label != "undefined") {
                                        $.ajax({
                                            type: "GET",
                                            data: {
                                                BPOCenter: label
                                            },
                                            url: UrlContent("Common/SaveTempFilter"),
                                            success: function (data) {
                                                window.location = UrlContent("Lead");
                                            }
                                        })

                                    }
                                }
                            }
                        }
                    }
                    else {
                        $(".centerSummaryReportByBpoNoChartDataLbl").removeClass("hide");
                        $("#centerSummaryReportByBpoGraphDiv").addClass("hide");
                    }
                }
            });
        }
    }

    this.SetBpoSummaryReport = function () {
        let chartDiv = $("#bpoSummaryReportChart");
        if (chartDiv.length > 0) {
            $.ajax({
                type: "GET",
                url: UrlContent("Dashboard/GetBpoSummaryReport"),
                success: function (data) {
                    $("#bpoSummaryReport-loader").addClass("hide");
                    $("#bpoSummaryReport").removeClass("hide");
                    if (data != null && data.data['datasets'] != null && data.data['datasets'].length > 0) {
                        $('#bpoSummaryReportChart').remove();
                        $("#bpoSummaryReportGraphDiv").removeClass("hide");
                        $('#bpoSummaryReportGraphDiv').append('<canvas id="bpoSummaryReportChart"><canvas>');
                        var ctx = document.getElementById('bpoSummaryReportChart').getContext('2d');
                        var canvas = document.getElementById('bpoSummaryReportChart')
                        $("#bpoSummaryReportChart").css("cursor", "pointer");
                        var myChart = new Chart(ctx, {
                            type: "horizontalBar",
                            data: data.data,
                            options: {
                                indexAxis: 'y',
                                scales: {
                                    xAxes: [{
                                        ticks: {
                                            beginAtZero: true,
                                            stepSize: 1,

                                        },
                                        scaleLabel: {
                                            showDatapoints: true,
                                            display: true,
                                            labelString: data.yAxesLabel,
                                            fontSize: 20,
                                        },

                                    }],
                                    yAxes: [{
                                        ticks: {
                                            autoSkip: false,
                                            labelOffset: 0,
                                            callback: function (value, index, ticks) {
                                                let labels = value.split('-_-');
                                                if (labels.length > 0) {
                                                    return labels[0];
                                                } else
                                                    return value;
                                            }
                                        },
                                        scaleLabel: {
                                            display: true,
                                            labelString: data.xAxesLabel,
                                            fontSize: 20,
                                        },
                                        //barPercentage: 0.4,

                                    }]
                                },
                                legend: {
                                    display: false,

                                },
                                responsive: true,
                                plugins: {
                                    datalabels: datalabels

                                }
                            }
                        });

                        $(".bpoSummaryReportNoChartDataLbl").addClass("hide");

                        canvas.onclick = function (evt) {
                            var activePoints = myChart.getElementsAtEvent(evt);
                            if (activePoints != null && activePoints.length > 0) {
                                let labels = activePoints[0]._model.label.split("-_-")
                                if (labels.length > 1) {
                                    let label = labels[1];

                                    if (label != null && label != "" && typeof label != "undefined") {
                                        $.ajax({
                                            type: "GET",
                                            data: {
                                                BPO: label
                                            },
                                            url: UrlContent("Common/SaveTempFilter"),
                                            success: function (data) {
                                                window.location = UrlContent("Lead");
                                            }
                                        })

                                    }
                                }
                            }
                        }
                    }
                    else {
                        $(".bpoSummaryReportNoChartDataLbl").removeClass("hide");
                        $("#bpoSummaryReportGraphDiv").addClass("hide");
                    }
                }
            });
        }
    }

    this.InitBilling = function (options) {
        AlphaLab.Dashboard.Option = $.extend({}, AlphaLab.Dashboard.Option, options);
        AlphaLab.Dashboard.Option.BillingTable = $("#BillingTableId").DataTable(
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
                    url: UrlContent("Dashboard/GetBillingList"),
                    data: function (dtParms) {
                        dtParms.search.value = $("#txtSearch").val();
                        dtParms.LeadsStatus = $("#hdnLeadStatus").val();
                        dtParms.ShipmentStatus = $("#hdnShipmentStatus").val();
                        dtParms.EVStatus = $("#hdnEVStatus").val();
                        dtParms.BPO = $("#hdnBPO").val();
                        dtParms.DateRange = $("#hdnCreatedDate").val();
                        dtParms.dtype = $("#hdnDrillDownType").val();
                        dtParms.dvalue = $("#hdnDrillDownValue").val();
                        return dtParms;
                    },
                    complete: function (response, result) {
                        var tableBottom = $("#BillingTableId_wrapper .btmpage").detach();
                        $(".top_pagging").prepend(tableBottom);
                        var lgndrp = $("#BillingTableId_length").detach();
                        $(".lgndrp").prepend(lgndrp);
                        $("#BillingTableId_wrapper .top").remove();
                        $("#searchId").removeClass("hide");


                        var tableBottom = $(`#BillingTableId_wrapper .btmpage`).detach();
                        $(".top_pagging").prepend(tableBottom);
                        $(".dataTables_length select").removeClass("form-control form-control-sm").addClass("form-select")
                        var lgndrp = $(`#BillingTableId_length`).detach();
                        $(".lgndrp").prepend(lgndrp);
                        $(`#BillingTableId_wrapper .top`).remove();
                        $("#searchId").removeClass("hide");
                    }
                },
                "columns": [
                    {
                        data: "leadId", orderable: false,
                        render: function (data, type, row) {
                            var renderResult = "";
                            if (AlphaLab.Dashboard.Option.RoleId == AlphaLab.Common.Role.Operation_Admin) {
                                renderResult += '<a href="' + (UrlContent("Lead/Add?id=") + row.encId + "&view=" + true) + '" title="View"  class="mr-2 fs-0" style="color:#333333"><b><i class="far fa-eye viewHover" ></i></b></a>'
                            }
                            else {
                                if (AlphaLab.Dashboard.Option.RoleId != AlphaLab.Common.Role.BPO || !row.isMovedToBilling) {
                                    renderResult += '<a href="' + (UrlContent("Lead/Add?id=") + row.encId) + '" class="mr-2 fs-0" title="Edit" style="color:#333333"><b><i class="far fa-edit editHover"></i></b></a>'
                                }
                                else {
                                    renderResult += '<a href="#" class="" title=""><b><span style="margin-right: 20px;">&nbsp;</i></b></a>'
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
                        data: "medicareId", name: "MedicareId", autoWidth: true, render: function (data, type, row) {
                            return AlphaLab.Common.GetMemberIdHtml(data, row);
                        }
                    },
                    {
                        data: "bpo", name: "BPO", autoWidth: true, visible: AlphaLab.Dashboard.Option.RoleId == AlphaLab.Common.Role.SuperAdmin || AlphaLab.Dashboard.Option.RoleId == AlphaLab.Common.Role.User_Admin || AlphaLab.Dashboard.Option.RoleId == AlphaLab.Common.Role.Operation_Admin
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
        AlphaLab.Dashboard.Option.BillingTable.ajax.reload();
    }

    this.DailyLeadSummaryReport = function () {
        $.ajax({
            type: "GET",
            url: UrlContent("Dashboard/_GetdailyleadSummaryReport"),
            success: function (data) {
                $("#DailyleadSummaryReport").show();
                $("#DailyleadSummaryReport-loader").hide();
                $("#DailyleadSummaryReport").html(data);
            }
        })
    }
    this.DailyLeadSummaryReportForBPO = function () {
        $.ajax({
            type: "GET",
            url: UrlContent("Dashboard/_GetdailyleadSummaryReportForBPO"),
            success: function (data) {
                $("#DailyleadSummaryByCenter").show();
                $("#DailyleadSummaryByCenter-loader").hide();
                $("#DailyleadSummaryByCenter").html(data);
            }
        })
    }

    this.DailyLeadDrillDown = function (date, bpoId) {
        $.ajax({
            type: "GET",
            data: {
                BPO: bpoId,
                DateRange: date + "-" + date
            },
            url: UrlContent("Common/SaveTempFilter"),
            success: function (data) {
                window.location = UrlContent("Lead");
            }
        })
    }

    this.DailyLeadForBPODrillDown = function (date, centerId) {
        $.ajax({
            type: "GET",
            data: {
                BPOCenter: centerId,
                DateRange: date + "-" + date
            },
            url: UrlContent("Common/SaveTempFilter"),
            success: function (data) {
                window.location = UrlContent("Lead");
            }
        })
    }

    this.AuditSummaryReport = function () {
        $.ajax({
            type: "GET",
            url: UrlContent("Dashboard/_AuditSummaryReport"),
            success: function (data) {
                $("#AuditSummaryReport").show();
                $("#AuditSummaryReport-loader").hide();
                $("#AuditSummaryReport").html(data);
            }
        })
    }

    this.AuditSummaryReportByAgent = function () {
        $.ajax({
            type: "GET",
            url: UrlContent("Dashboard/_AuditSummaryReportByAgent"),
            success: function (data) {
                $("#AuditSummaryByAgentReport").show();
                $("#AuditSummaryByAgentReport-loader").hide();
                $("#AuditSummaryByAgentReport").html(data);
            }
        })
    }

    this.AuditSummaryDrillDown = function (date, qaStatus) {
        $.ajax({
            type: "GET",
            data: {
                DateRange: date + "-" + date,
                QAStatus: qaStatus,
            },
            url: UrlContent("Common/SaveTempFilter"),
            success: function (data) {
                window.location = UrlContent("Audit");
            }
        })
    }

    this.DailyEVSummaryReport = function () {
        $.ajax({
            type: "GET",
            url: UrlContent("Dashboard/_DailyEvSummaryReport"),
            success: function (data) {
                $("#DailyEVSummaryReport").show();
                $("#DailyEVSummaryReport-loader").hide();
                $("#DailyEVSummaryReport").html(data);
            }
        })
    }

    this.EVSummaryInit = function (options) {
        AlphaLab.Dashboard.Option = $.extend({}, AlphaLab.Dashboard.Option, options);
        AlphaLab.Dashboard.Option.EVSummaryTable = $("#EVSummaryTableId").DataTable(
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
                    url: UrlContent("Dashboard/GetEVSummaryList"),
                    data: function (dtParms) {
                        dtParms.search.value = $("#txtSearch").val();
                        dtParms.BPO = $("#hidBpoId").val();
                        dtParms.DateRange = $("#hidEvdate").val();
                        return dtParms;
                    },
                    complete: function (response, result) {
                        var tableBottom = $("#EVSummaryTableId_wrapper .btmpage").detach();
                        $(".top_pagging").prepend(tableBottom);
                        var lgndrp = $("#EVSummaryTableId_length").detach();
                        $(".lgndrp").prepend(lgndrp);
                        $("#EVSummaryTableId_wrapper .top").remove();
                        $("#searchId").removeClass("hide");
                    }
                },
                "columns": [
                    { data: "requestId", name: "RequestId", autoWidth: true },
                    { data: "batchId", name: "BatchId", autoWidth: true },
                    { data: "leadNo", name: "LeadNo", autoWidth: true },
                    {
                        data: "medicareId", name: "MedicareId", autoWidth: true, render: function (data, type, row) {
                            return AlphaLab.Common.MaskString(data, AlphaLab.Common.MaskLastCharacters)
                        }
                    },
                    { data: "firstName", name: "FirstName", autoWidth: true },
                    { data: "lastName", name: "LastName", autoWidth: true },
                    { data: "dob", name: "Dob", autoWidth: true },
                    {
                        data: "verificationStatus", name: "VerificationStatus", autoWidth: true, orderable: false, className: "text-center col-1", render: function (data, type, row) {
                            return AlphaLab.Common.GetCheckEligibilityStatusHtml(data)
                        }
                    },
                    { data: "createdOn", name: "CreatedOn", autoWidth: true },
                    { data: "createdBy", name: "CreatedBy", autoWidth: true },
                ],
                order: [0, "DESC"],
                fixedColumns: {
                    left: 3,
                },
            });
    }

    this.SearchEVSummary = function () {
        AlphaLab.Dashboard.Option.EVSummaryTable.ajax.reload();
    }

    this.DailyEvDrillDown = function (date, bpoId, nameDecode) {
        window.location = UrlContent("Dashboard/DailyEvSummaryReportByDate?date=" + date + "&bpoId=" + bpoId + "&nameDecode=" + nameDecode);

    }

    this.NotificationReport = function () {
        $.ajax({
            type: "GET",
            url: UrlContent("Dashboard/_Notification"),
            success: function (data) {
                $("#NotificationReport").show();
                $("#NotificationReport-loader").hide();
                $("#NotificationReport").html(data);
            }
        })
    }

    this.InitNotification = function (options) {
        AlphaLab.Dashboard.Option = $.extend({}, AlphaLab.Dashboard.Option, options);

        AlphaLab.Dashboard.Option.NotificationTable = $("#notificationTableId").DataTable(
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
                dom: '<"top"flp>rt<"row btmpage mb-1 mt-2"<"col-8"i><"col-4"p>>',
                ajax: {
                    type: "Post",
                    url: UrlContent("Dashboard/GetNotificationList"),
                    data: function (dtParms) {
                        dtParms.search.value = $("#txtSearch").val();
                        dtParms.BPO = $("#hidBpoId").val();
                        dtParms.DateRange = $("#hidEvdate").val();
                        return dtParms;
                    },
                    complete: function (response, result) {
                        var tableBottom = $(`#notificationTableId_wrapper .btmpage`).detach();
                        $(".top_pagging").prepend(tableBottom);
                        $(".dataTables_length select").removeClass("form-control form-control-sm").addClass("form-select")
                        var lgndrp = $(`#notificationTableId_length`).detach();
                        $(".lgndrp").prepend(lgndrp);
                        $(`#notificationTableId_wrapper .top`).remove();
                        $("#searchId").removeClass("hide");
                    }
                },
                "columns": [
                    {
                        data: "leadNo", name: "LeadNo", className: "col-2",
                        render: function (data, type, row) {
                            return '<a style="color:#333 !important" target="_blank" href="' + (UrlContent("Lead/Add?id=") + row.encId + "&view=" + true) + '"><u>' + data + '</u></a>'
                        }
                    },
                    {
                        data: "medicareId", name: "MedicareId", autoWidth: true, className: "col-2", orderable: false, render: function (data, type, row) {
                            return AlphaLab.Common.MaskString(data, AlphaLab.Common.MaskLastCharacters)
                        }
                    },
                    { data: "comments", name: "Comments", orderable: false, autoWidth: true },

                ],
                order: [0, "DESC"],

                language: {
                    processing: '<div class="dataTableLoader"></div>'
                }
            });
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
}
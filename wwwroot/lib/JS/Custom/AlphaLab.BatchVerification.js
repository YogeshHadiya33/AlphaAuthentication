AlphaLab.BatchVerification = new function () {

    //Variable 

    this.Option = {
        Table: null,
        TableId: "",
        SearchId: "",
    }


    this.Init = function (options) {
        AlphaLab.BatchVerification.Option = $.extend({}, AlphaLab.BatchVerification.Option, options);
        AlphaLab.BatchVerification.Option.Table = $("#BatchVerificationTable").DataTable(
            {
                searching: false,
                paging: true,
                serverSide: true,
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
                    url: UrlContent("BatchVerification/GetList"),
                    data: function (dtParms) {
                        dtParms.search.value = $("#txtSearch").val();
                        return dtParms;
                    },
                    complete: function (response, result) {
                        var tableBottom = $(`#BatchVerificationTable_wrapper .btmpage`).detach();
                        $(".top_pagging").prepend(tableBottom);
                        $(".dataTables_length select").removeClass("form-control form-control-sm").addClass("form-select")
                        var lgndrp = $(`#BatchVerificationTable_length`).detach();
                        $(".lgndrp").prepend(lgndrp);
                        $(`#BatchVerificationTable_wrapper .top`).remove();
                        $("#searchId").removeClass("hide");
                    }
                },
                "columns": [
                    {
                        data: "verificationBatchId", orderable: false, width: "1%",
                        render: function (data, type, row) {
                            var renderResult = '<a href="#"  onclick="AlphaLab.BatchVerification.DownloadBatchEV(' + data + ')"  class="mr-2 fs-0" title="Download Response" style="color:#333333"><b><i class="fas fa-download viewHover" ></i></b></a>';
                            //var renderResult = '<button onclick="AlphaLab.BatchVerification.DownloadBatchEV(' + data + ')"  class="mr-2 fs-0" title="Download Response" style="color:#333333"><b><i class="fas fa-download viewHover" ></i></b></button>'
                            return renderResult;
                        }
                    },
                    { data: "batchNo", name: "VerificationBatchId", },
                    { data: "totalVerification", name: "TotalVerification", className: "text-right col-1" },
                    { data: "totalEligible", name: "TotalEligible", className: "text-right col-1" },
                    { data: "totalNotEligible", name: "TotalNotEligible", className: "text-right col-1" },
                    { data: "totalErrors", name: "TotalErrors", className: "text-right col-1" },
                    { data: "createdBy", name: "CreatedBy", className: "col-2" },
                    { data: "createdDate", name: "CreatedDate", className: "col-2" },
                ],
                order: [1, "DESC"],
                language: {
                    processing: '<div class="dataTableLoader"></div>'
                }

            });
    }

    this.DownloadBatchEV = function (batchId) {
        $(".preloader").show();
        $.ajax({
            url: UrlContent("BatchVerification/DownloadBatchEV"),
            type: "POST",
            data: {
                batchId: batchId,
            },
            success: function (response) {
                $(".preloader").hide();
                if (response.isSuccess) {
                    window.location.href = UrlContent("ExtraFiles/Downloads/" + response.result);
                } else {
                    AlphaLab.Common.ToastrError(response.message);
                }
            }
        });
    }

}
AlphaLab.ManualEV = new function () {

    this.Option = {
        Table: null,
        TableId: "",
        SearchId: "",
    }

    this.Init = function (options) {
        AlphaLab.ManualEV.Option.Table = $("#ManualVerificationTable").DataTable(
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
                dom: '<"top"flp>rt<"row btmpage mb-1 mt-2"<"col-sm-3 txtSearchId"><"col-sm-2 lgndrp"><"col-sm-3"i><"col-sm-4"p>>',
                ajax: {
                    type: "Post",
                    url: UrlContent("ManualEV/GetList"),
                    data: function (dtParms) {
                        dtParms.search.value = $("#txtSearch").val();
                        return dtParms;
                    },
                    complete: function (response, result) {
                         
                        var tableBottom = $(`#ManualVerificationTable_wrapper .btmpage`).detach();
                        $(".top_pagging").prepend(tableBottom);
                        $(".dataTables_length select").removeClass("form-control form-control-sm").addClass("form-select")
                        var lgndrp = $(`#ManualVerificationTable_length`).detach();
                        $(".lgndrp").prepend(lgndrp);
                        $(`#ManualVerificationTable_wrapper .top`).remove();
                        $("#searchId").removeClass("hide");
                    }
                },
                "columns": [
                    {
                        data: "manualEVBatchId", orderable: false, width: "1%",
                        render: function (data, type, row) {
                            var renderResult = '<a href="#"  onclick="AlphaLab.ManualEV.DownloadBatchEV(' + data + ')"  class="mr-2 fs-0" title="Download Response" style="color:#333333"><b><i class="fas fa-download viewHover" ></i></b></a>';
                            return renderResult;
                        }
                    },
                    { data: "batchNo", name: "manualEVBatchId", },
                    { data: "requestType", name: "RequestType", },
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
            url: UrlContent("ManualEV/DownloadBatchEV"),
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

    this.Upload = function () {
        $("#divMsg").addClass("hide");
        $("#btnDownloadError").addClass("hide");
        var fileUpload = $("#fileUpload").get(0);
        var files = fileUpload.files;


        $(".preloader").show();

        var formdata = new FormData();
        for (var i = 0; i < files.length; i++) {
            formdata.append("ImportFile", files[i]);
        }

        $.ajax({
            type: "POST",
            url: UrlContent("ManualEV/Upload"),
            data: formdata,
            contentType: false,
            processData: false,
            success: function (response) {
                $(".preloader").hide();
                $("#btnDownloadError").addClass("hide");
                $("#divMsg").addClass("hide");
                $("#fileUpload").val(null);
                if (response.isSuccess) {
                    $("#divMsg").removeClass("hide");
                    $("#lblMsg").html(response.message);
                    if (response.result != null && response.result != "" && typeof response.result != "undefined") {
                        $("#btnDownloadError").attr("href", response.result);
                        $("#btnDownloadError").removeClass("hide");
                    }

                } else {
                    $("#divMsg").removeClass("hide");
                    $("#lblMsg").html(response.message);
                }

            },
            error: function (textStatus, errorThrown) {
            }
        });
    }

    this.Save = function () {
        if ($("#manualEvForm").valid()) {
            $(".preloader").show();
            var formData = $("#manualEvForm").serialize();
            $.ajax({
                url: UrlContent("ManualEV/Save"),
                type: "POST",
                data: formData,
                success: function (response) {
                    $(".preloader").hide();
                    if (response.isSuccess) {
                        $.ajax({
                            url: UrlContent("Common/_ViewManualVerification/" + response.result),
                            success: function (evResponse) {
                                $(".preloader").hide();
                                if (evResponse.includes("txtResponseModalPopupId")) {
                                    $("#common-md-DialogContent").html(evResponse);
                                    $("#common-md-dialog").modal("show");                                    
                                } else {
                                    $("#common-xl-DialogContent").html(evResponse);
                                    $("#common-xl-dialog").modal("show");
                                    $("#ddSearchType").val(1);
                                    OnSearchTypeChange();
                                    $("#ManualEvModel_MedicareId").val("");
                                    $("#ManualEvModel_FirstName").val("");
                                    $("#ManualEvModel_LastName").val("");
                                    $("#ManualEvModel_Dob").val("");
                                }
                            },
                            error: function (error) {

                            }
                        });
                    } else {
                        Swal.fire({
                            title: "Error!",
                            icon: "error",
                            text: response.message
                        });
                    }
                },
                error: function (error) {

                }
            });
        }
    }

}
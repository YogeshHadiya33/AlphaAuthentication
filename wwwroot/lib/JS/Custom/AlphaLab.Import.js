AlphaLab.Import = new function () {

    this.ImportFile = function () {
        $("#divMsg").addClass("hide");
        $("#btnDownloadError").addClass("hide");
        var fileUpload = $("#fileUpload").get(0);
        var files = fileUpload.files;


        $(".preloader").show();

        var formdata = new FormData();
        for (var i = 0; i < files.length; i++) {
            formdata.append("ImportFile", files[i]);
        }
        formdata.append("ImportTable", $("#ImportTable").val());
        formdata.append("BPOId", $("#BPOId").val());
        console.log(formdata)
        $.ajax({
            type: "POST",
            url: UrlContent("Import/ImportFile"),
            data: formdata,
            contentType: false,
            processData: false,
            success: function (response) {
                console.log(response)
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


    this.ImportSNS = function () {
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
            url: UrlContent("Import/ImportSNS"),
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

    this.ImportPendingBilled = function () {
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
            url: UrlContent("Import/ImportPendingBilled"),
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

    this.ImportPendingShipment = function () {
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
            url: UrlContent("Import/ImportPendingShipment"),
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

    this.ImportReturnShipment = function () {
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
            url: UrlContent("Import/ImportReturnShipment"),
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

    this.ImportDuplicateCheck = function () {
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
            url: UrlContent("Import/ImportDuplicateCheck"),
            data: formdata,
            contentType: false,
            processData: false,
            success: function (response) {
                $(".preloader").hide();
                $("#fileUpload").val(null);
                $("#divMsg").removeClass("hide");
                if (response.isSuccess) {
                    $("#divMsg").html(response.message);

                } else {
                    $("#divMsg").html(response.message);
                }

            },
            error: function (textStatus, errorThrown) {
            }
        });
    }
}
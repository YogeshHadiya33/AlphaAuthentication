AlphaLab.Audio = new function () {

    //Variable
    var SelectedRecordArray = [];

    this.Option = {
        AudioTable: null,
        AudioTableId: "",
        AudioearchId: "",
        RoleId: 0
    }

    this.Init = function (options) {
        AlphaLab.Audio.Option = $.extend({}, AlphaLab.Audio.Option, options);
        AlphaLab.Audio.Option.AudioTable = $("#AudioTableId").DataTable(
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
                    url: UrlContent("AudioRecordings/GetList"),
                    data: function (dtParms) {
                        dtParms.search.value = $("#txtSearch").val();
                        return dtParms;
                    },
                    complete: function (response, result) {
                        var tableBottom = $("#AudioTableId_wrapper .btmpage").detach();
                        $(".top_pagging").prepend(tableBottom);
                        var lgndrp = $("#AudioTableId_length").detach();
                        $(".lgndrp").prepend(lgndrp);
                        $("#AudioTableId_wrapper .top").remove();
                        $("#searchId").removeClass("hide");
                    }
                },
                "columns": [
                    {
                        data: "audioId", orderable: false, with: "1%",
                        render: function (data, type, row) {
                            var renderResult = "";
                            if (AlphaLab.Audio.Option.RoleId == AlphaLab.Common.Role.Operation_Admin) {
                                renderResult += '<a href="' + (UrlContent("AudioRecordings/Add?id=") + row.encId + "&view=" + true) + '" title="View" style="color:#333333"><b><i class="ti-eye viewHover" style="padding: 5px;font-size: 14px"></i></b></a>'
                            }
                            else {
                                renderResult += '<input type="checkbox" class="deleteAll" value="' + data + '" onChange="AlphaLab.Audio.OnSelectRecord(\'' + data + '\',this)"/>'
                                renderResult += '<a href="' + (UrlContent("AudioRecordings/Add?id=") + row.encId) + '" class="" title="Edit" style="color:#333333"><b><i class="ti-pencil editHover" style="padding: 5px;font-size: 14px"></i></b></a>'
                                renderResult += '<a href="' + (UrlContent("AudioRecordings/Add?id=") + row.encId + "&view=" + true) + '" title="View" style="color:#333333"><b><i class="ti-eye viewHover" style="padding: 5px;font-size: 14px"></i></b></a>'
                            }
                            return renderResult;
                        }
                    },
                    { data: "audioTitle", name: "AudioTitle", autoWidth: true, className: "col-2" },
                    {
                        data: "dropboxURL", name: "DropboxURL", autoWidth: true, className: "whiteSpace col-7",
                        render: function (data) {
                            return '<a href="' + data + '" target="_blank">' + data + '</a>'
                        }
                    },
                    { data: "createdDate", name: "CreatedDate", autoWidth: true, className: "col-2" },
                ],
                order: [1, "ASC"],
                fixedColumns: {
                    left: 2,
                },
            });
    }

    this.Search = function () {
        AlphaLab.Audio.Option.AudioTable.ajax.reload();
    }

    this.SaveAudioDetails = function () {
        if ($("#AudioFormId").valid()) {
            $(".preloader").show();
            var formdata = $("#AudioFormId").serialize();
            $.ajax({
                type: "Post",
                url: UrlContent("AudioRecordings/Save/"),
                data: formdata,
                success: function (result) {
                    $(".preloader").hide();
                    if (result.isSuccess) {
                        AlphaLab.Common.ToastrSuccess(result.message);
                        window.location.href = UrlContent("AudioRecordings");
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
        }
        else {
            $("#btnDelete").addClass("hide")
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
        $('#AudioTableBody input:checked').each(function () {
            SelectedRecordArray.push($(this).attr('value'));
        });
        if (SelectedRecordArray.length > 0) {
            $('#btnDelete').removeClass("hide");
        }
        else {
            $('#btnDelete').addClass("hide");
        }

    });

    this.Delete = function () {
        var count = SelectedRecordArray.length;
        if (count > 0) {
            Swal.fire({
                title: '<h4><b>Are you sure you want to delete these ' + count + ' audio recordings?<b></h4>',
                html: '',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#f33c02',
                cancelButtonColor: '#a1aab2',
                confirmButtonText: '<i class="fas fa-trash"></i> Delete',
                cancelButtonText: '<i class="ti-na"></i> Cancel'
            }).then((result) => {
                if (result.value) {
                    $('.preloader').show();
                    $.ajax({
                        type: "POST",
                        url: UrlContent("AudioRecordings/Delete"),
                        data: {
                            ids: SelectedRecordArray,
                        },
                        success: function (result) {
                            $('.preloader').hide();
                            if (result.isSuccess) {
                                $('.selectAll').prop('checked', false);
                                AlphaLab.Audio.Option.AudioTable.ajax.reload();
                                SelectedRecordArray = [];
                                $('#btnDelete').addClass("hide");
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
            url: UrlContent("AudioRecordings/DownloadSpreadsheetReport"),
            type: "POST",
            data: {
                SearchText: $("#txtSearch").val(),
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
AlphaLab.BpoCenter = new function () {

    //Variable
    var SelectedRecordArray = [];

    this.Option = {
        BpoTable: null,
        BpoTableId: "",
        BpoearchId: "",
        DrildownBpoTable: null,
        DrillDownValue1: "",
        RoleId: 0
    }

    this.Init = function (options) {
        AlphaLab.BpoCenter.Option = $.extend({}, AlphaLab.BpoCenter.Option, options);
        AlphaLab.BpoCenter.Option.BpoTable = $(`#${AlphaLab.BpoCenter.Option.BpoTableId}`).DataTable(
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
                    url: UrlContent("BPOCenter/GetList"),
                    data: function (dtParms) {
                        dtParms.search.value = $("#txtSearch").val();
                        dtParms.BpoStatus = $("#ddBpoStatus").val();
                        return dtParms;
                    },
                    complete: function (response, result) { 

                        var tableBottom = $(`#${AlphaLab.BpoCenter.Option.BpoTableId}_wrapper .btmpage`).detach();
                        $(".top_pagging").prepend(tableBottom);
                        $(".dataTables_length select").removeClass("form-control form-control-sm").addClass("form-select")
                        var lgndrp = $(`#${AlphaLab.BpoCenter.Option.BpoTableId}_length`).detach();
                        $(".lgndrp").prepend(lgndrp);
                        $(`#${AlphaLab.BpoCenter.Option.BpoTableId}_wrapper .top`).remove();
                        $("#searchId").removeClass("hide");
                    }
                },
                columns: [
                    {
                        data: "bpoCenterId", orderable: false, width: "1%",
                        render: function (data, type, row) {
                            var renderResult = "";

                            var renderResult = "";
                            if (AlphaLab.BpoCenter.Option.RoleId == AlphaLab.Common.Role.Operation_Admin) {
                                renderResult += '<a href="' + (UrlContent("BPOCenter/Add?id=") + row.encId + "&view=" + true) + '" class="mr-2 fs-0" title="View" style="color:#333333"><b><i class="far fa-eye viewHover"></i></b></a>'
                            } else {

                                renderResult += '<input type="checkbox" class="deleteAll mr-2 fs-0" value="' + data + '" onChange="AlphaLab.BpoCenter.OnSelectRecord()"/>'
                                renderResult += '<a href="' + (UrlContent("BPOCenter/Add?id=") + row.encId) + '" class="mr-2 fs-0" title="Edit" style="color:#333333"><b><i class="far fa-edit  editHover" ></i></b></a>'
                                renderResult += '<a href="' + (UrlContent("BPOCenter/Add?id=") + row.encId + "&view=" + true) + '" class="mr-2 fs-0" title="View" style="color:#333333"><b><i class="far fa-eye viewHover"></i></b></a>'
                            }
                            return renderResult;
 
                        }
                    },
                    { data: "centerName", name: "CenterName", autoWidth: true },
                    { data: "centerCode", name: "CenterCode", autoWidth: true },
                    { data: "companyName", name: "CompanyName", autoWidth: true },
                    { data: "phone", name: "Phone", className: " col-1 text-center", autoWidth: true,},
                    { data: "email", name: "Email", autoWidth: true,},
                    {
                        data: "isActive", orderable: false, className: "col-1 text-center", render: function (data, type, row) {
                            if (data) {
                                return '<span class="badge badge-phoenix  badge-phoenix-success font-12">ACTIVE</span>';
                            } else {
                                return '<span class="badge badge-phoenix  badge-phoenix-danger font-12">IN-ACTIVE</span>';
                            }
                        }
                    },
                    { data: "createdDate", name: "CreatedDate", className: " col-1 text-center", autoWidth: true },
                ],
                order: [1, "ASC"],
                fixedColumns: {
                    left: 2,
                },
                language: {
                    processing: '<div class="dataTableLoader"></div>'
                }
            });
    }

    this.Search = function () {
        AlphaLab.BpoCenter.Option.BpoTable.ajax.reload();
    }
    this.Save = function () {
        if ($("#BpoCenterFormId").valid()) {
            $(".preloader").show();
            var formdata = $("#BpoCenterFormId").serialize();
            $.ajax({
                type: "Post",
                url: UrlContent("BPOCenter/Save/"),
                data: formdata,
                success: function (result) {
                    $(".preloader").hide();
                    if (result.isSuccess) {
                        AlphaLab.Common.ToastrSuccess(result.message);
                        window.location.href = UrlContent("BPOCenter");
                    } else {
                        AlphaLab.Common.ToastrError(result.message);
                    }
                },
            })
        }
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
        var totalSelectedRowLength = $(".deleteAll:checked").length;
        if (totalSelectedRowLength > 0) {
            $("#btnDelete").removeClass("hide")
        }
        else {
            $("#btnDelete").addClass("hide")
        }
    });

    this.Delete = function () {
        SelectedRecordArray = [];
        $('.deleteAll:checked').each(function () {
            SelectedRecordArray.push($(this).attr('value'));
        });
        var count = SelectedRecordArray.length;
        if (count > 0) {
            Swal.fire({
                title: '<h4><b>Are you sure you want to delete these ' + count + ' Center ?<b></h4>',
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
                        url: UrlContent("BPOCenter/Delete"),
                        data: {
                            ids: SelectedRecordArray,
                        },
                        success: function (result) {
                            $('.preloader').hide();
                            if (result.isSuccess) {
                                $('.selectAll').prop('checked', false);
                                AlphaLab.BpoCenter.Option.BpoTable.ajax.reload();
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
}
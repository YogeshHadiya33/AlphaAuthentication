AlphaLab.Bpo = new function () {

    //Variable
    var SelectedRecordArray = [];

    this.Option = {
        BpoTable: null,
        BpoTableId: "",
        BpoearchId: "",
        DrildownBpoTable: null,
        DrillDownValue1: "",
        RoleId:0
    }

    this.Init = function (options) {
        AlphaLab.Bpo.Option = $.extend({}, AlphaLab.Bpo.Option, options);
        AlphaLab.Bpo.Option.BpoTable = $(`#${AlphaLab.Bpo.Option.BpoTableId}`).DataTable(
            {
                searching: false,
                paging: true,
                serverSide: "true",
                processing:true,
                bPaginate: true,
                bLengthChange: true,
                bInfo: true,
                async: false,
                lengthMenu: [[10, 25, 50, 100, 500], [10, 25, 50, 100, 500]],
                pageLength: 100,
                dom: '<"top"flp>rt<"row btmpage mb-1 mt-2"<"col-3 txtSearchId"><" col-3 lgndrp"><"col-2"i><"col-4"p>>',
                ajax: {
                    type: "Post",
                    url: UrlContent("Bpo/GetList"),
                    data: function (dtParms) {
                        dtParms.search.value = $("#txtSearch").val();
                        dtParms.BpoStatus = $("#ddBpoStatus").val();
                        return dtParms;
                    },
                    complete: function (response, result) {

                        var tableBottom = $(`#${AlphaLab.Bpo.Option.BpoTableId}_wrapper .btmpage`).detach();
                        $(".top_pagging").prepend(tableBottom);
                        $(".dataTables_length select").removeClass("form-control form-control-sm").addClass("form-select")
                        var lgndrp = $(`#${AlphaLab.Bpo.Option.BpoTableId}_length`).detach();
                        $(".lgndrp").prepend(lgndrp);
                        $(`#${AlphaLab.Bpo.Option.BpoTableId}_wrapper .top`).remove();
                        $("#searchId").removeClass("hide");
                    }
                },
                columns: [
                    {
                        data: "bpoMasterId", orderable: false, width: "1%",
                        render: function (data, type, row) {
                            var renderResult = "";
                            if (AlphaLab.Bpo.Option.RoleId == AlphaLab.Common.Role.Operation_Admin) {
                                renderResult += '<a href="' + (UrlContent("Bpo/Add?id=") + row.encId + "&view=" + true) + '" class="mr-2 fs-0" title="View" style="color:#333333"><b><i class="far fa-eye viewHover"></i></b></a>'
                            } else {

                                renderResult += '<input type="checkbox" class="deleteAll mr-2 fs-0" value="' + data + '" onChange="AlphaLab.Bpo.OnSelectRecord()"/>'
                                renderResult += '<a href="' + (UrlContent("Bpo/Add?id=") + row.encId) + '" class="mr-2 fs-0" title="Edit" style="color:#333333"><b><i class="far fa-edit editHover" ></i></b></a>'
                                renderResult += '<a href="' + (UrlContent("Bpo/Add?id=") + row.encId + "&view=" + true) + '" class="mr-2 fs-0" title="View" style="color:#333333"><b><i class="far fa-eye viewHover"></i></b></a>'
                            }
                            return renderResult;
                        }
                    },
                    { data: "companyName", name: "CompanyName", autoWidth: true },
                    { data: "phone", name: "Phone", autoWidth: true, className: "col-2" },
                    { data: "email", name: "Email", autoWidth: true, className: "col-3" },
                    {
                        data: "auditPercetage", name: "AuditPercetage", autoWidth: true, className: "col-1 text-center", render: function (data, type, row) {
                            return AlphaLab.Common.FormatPercentage(data);
                        }
                    },
                    {
                        data: "isActive", orderable: false, className: "col-1 text-center", render: function (data, type, row) {
                            if (data) {
                                return '<span class="badge badge-phoenix  badge-phoenix-success font-12">ACTIVE</span>';
                            } else {
                                return '<span class="badge badge-phoenix  badge-phoenix-danger font-12">IN-ACTIVE</span>';
                            }
                        }
                    },
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
        AlphaLab.Bpo.Option.BpoTable.ajax.reload();
    }

    this.SaveBpoDetails = function () {
        if ($("#BpoFormId").valid()) {
            $(".preloader").show();
            var formdata = $("#BpoFormId").serialize();
            $.ajax({
                type: "Post",
                url: UrlContent("Bpo/Save/"),
                data: formdata,
                success: function (result) {
                    $(".preloader").hide();
                    if (result.isSuccess) {
                        AlphaLab.Common.ToastrSuccess(result.message);
                        window.location.href = UrlContent("Bpo");
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
                title: '<h4><b>Are you sure you want to delete these ' + count + ' Bpo?<b></h4>',
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
                        url: UrlContent("Bpo/Delete"),
                        data: {
                            ids: SelectedRecordArray,
                        },
                        success: function (result) {
                            $('.preloader').hide();
                            if (result.isSuccess) {
                                $('.selectAll').prop('checked', false);
                                AlphaLab.Bpo.Option.BpoTable.ajax.reload();
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
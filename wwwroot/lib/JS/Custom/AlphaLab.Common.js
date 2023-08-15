AlphaLab.Common = new function () {
    //function
    this.ToastrSuccess = function (msg) {
        toastr.success(msg);
    }

    this.ToastrError = function (msg) {
        toastr.error(msg);
    }

    this.ToastrRemove = function () {
        toastr.remove();
    }

    this.Role = {
        SuperAdmin: 1,
        User_Admin: 2,
        Operation_Admin: 3,
        BPO: 4,
        Eligibility: 5,
        Billing: 6,
        Shipping: 7,
        BpoCenter: 8,
        QA_Admin: 9,
        QA_Agent: 10,
        Manual_EV: 11,
    }

    this.Redirection_Type = {
        Stay_On_Same_Page: 1,
        Save_And_Next: 2,
        Save_And_Close: 3,
    }
    this.InvoiceType = {
        Subscription: 1,
        EV: 2,
        Other: 3,
    }

    this.EncodeString = function (value) {
        if (value == null || value == "" || typeof value == "undefined")
            return "";
        return value.replaceAll("\n", "").replaceAll("\r", "").replaceAll(" ", "-SP-").replaceAll("~", "-TLD-").replaceAll("!", "-EX-").replaceAll("@", "-AT-").replaceAll("$", "-DL-").replaceAll("^", "-CRT-").replaceAll("_", "-UN-").replaceAll("/", "-SL-").replaceAll(".", "-DT-").replaceAll("*", "-ST-").replaceAll("#", "-HS-").replaceAll("%", "-PR-").replaceAll("&", "-AD-").replaceAll("(", "-OB-").replaceAll(")", "-CB-").replaceAll("+", "-PL-").replaceAll(":", "-CLN-").replaceAll(",", "-CMA-").replaceAll("?", "-QM-").replaceAll("<", "-LT-").replaceAll(">", "-GT-").replaceAll("[", "-BBO-").replaceAll("]", "-BBC-").replaceAll("{", "-CBO-").replaceAll("}", "-CBC-").replaceAll("'", "-QT-").replaceAll("\"", "-DQT-");
    }

    this.FormatMoney = function (value) {
        if (value != null && typeof value != "undefined") {
            const formatter = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
            });
            return formatter.format(value);
        } else
            return "";
    }

    this.FormatPercentage = function (value) {
        if (value != null && typeof value != "undefined" && !isNaN(value)) {
            if (value != 0)
                value = value / 100;
            const formatter = new Intl.NumberFormat("en-GB", {
                style: "percent",
                minimumFractionDigits: 1,
                maximumFractionDigits: 2
            });
            return formatter.format(value);
        } else
            return value;
    }

    this.FormatPhoneNumber = function (phoneNumber) {
        if (phoneNumber != null && phoneNumber != "" && typeof phoneNumber != "undefined") {

            // remove all non-digit characters from the input string
            const cleaned = phoneNumber.replace(/\D/g, '');

            // check if the cleaned phone number is a valid length
            if (cleaned.length !== 10) {
                return phoneNumber;
            }

            // extract the area code and phone number segments
            const areaCode = cleaned.substring(0, 3);
            const phoneSegment1 = cleaned.substring(3, 6);
            const phoneSegment2 = cleaned.substring(6, 10);

            // concatenate the segments with the formatting characters
            return `(${areaCode}) ${phoneSegment1}-${phoneSegment2}`;
        } else {
            return phoneNumber
        }
    }

    this.InitMask = function () {
        $(".fax-inputmask").inputmask("999 999-9999");
        $(".phone-inputmask").inputmask("(999) 999-9999");
        $(".ssn-inputmask").inputmask("999-99-9999");
        $(".zipcode-inputmask").inputmask("99999-9999");
        $(".email-inputmask").inputmask({
            mask: "*{1,20}[.*{1,20}][.*{1,20}][.*{1,20}]@*{1,20}[.*{2,6}][.*{1,2}]",
            greedy: false,
            onBeforePaste: function (pastedValue, opts) {
                return pastedValue.replace("mailto:", "");
            },
            definitions: {
                '*': {
                    validator: "[0-9A-Za-z!#$%&'*+/=?^_`{|}~\-]",
                    cardinality: 1
                }
            }
        });
    }

    this.InitDateKeyEvent = function () {
        $('.date-picker').on('keypress', function (e) {
            var Id = "#" + $(this).attr("Id");
            var key = e.keyCode ? e.keyCode : e.which ? e.which : e.charCode;
            if ($(Id).val().length < 10 && key != 47 && key != 45) {
                FormatDate(e, this);
            }
            else {
                e.preventDefault();
                return false;
            }
        });
    }

    this.MaskLastCharacters = 4;
    this.MaskString = function (value, num) {
        if (!value || isNaN(num)) {
            return value;
        }
        if (num >= value.length) {
            return value;
        }
        const maskedValue = '*'.repeat(value.length - num) + value.slice(value.length - num);
        return maskedValue;
    }

    this.ChangePassword = function () {
        $.ajax({
            type: "GET",
            url: UrlContent("Account/ChangePassword/"),
            success: function (data) {
                console.log(data)
                $("#common-sm-dialogContent").html(data);
                $.validator.unobtrusive.parse($("#ChangePwdForm"));
                $(".pwd").click(function () {
                    if ($(this).children(".svg-inline--fa").hasClass("fa-eye")) {
                        $(this).children(".svg-inline--fa").removeClass("fa-eye").addClass("fa-eye-slash");
                        $(this).next().attr("type", "text");
                    }
                    else {
                        $(this).children(".svg-inline--fa").removeClass("fa-eye-slash").addClass("fa-eye");
                        $(this).next().attr("type", "password");
                    }
                });

                $("#common-sm-dialog").modal('show');
            }
        })
    }

    this.SavePassword = function () {
        if ($("#ChangePwdForm").valid()) {
            $(".preloader").show();
            var formdata = $("#ChangePwdForm").serialize();
            $.ajax({
                type: "POST",
                url: UrlContent("Account/ChangePassword/"),
                data: formdata,
                success: function (result) {
                    console.log(result)
                    $(".preloader").hide();
                    if (result.isSuccess) {
                        top.location.href = UrlContent("Account/Logout");
                        $("#common-sm-dialog").modal("hide");
                    }
                    else {
                        AlphaLab.Common.ToastrError(result.message);
                    }
                },
                error: function (textStatus, errorThrown) {
                }
            });
        }
    }

    this.GetLeadStatusHtml = function (data) {
        if (data == null || typeof data == "undefined" || data == '') {
            return '<span class="badge badge-phoenix badge-phoenix-secondary">' + data + '</span>';
        }
        else if (data.toLowerCase() == 'sns pending' || data.toLowerCase() == 'undeliverable') {
            return '<span class="badge badge-phoenix badge-phoenix-info">' + data + '</span>';
        }
        else if (data.toLowerCase() == 'sns not accepted' || data.toLowerCase() == 'returned' || data.toLowerCase() == 'not eligible' || data.toLowerCase() == 'ev error' || data.toLowerCase() == 'billing rejected' || data.toLowerCase() == 'rejected / void') {
            return '<span class="badge badge-phoenix badge-phoenix-danger">' + data + '</span>';
        }
        else if (data.toLowerCase() == 'billed' || data.toLowerCase() == 'recipient action required') {
            return '<span class="badge badge-phoenix badge-phoenix-warning">' + data + '</span>';
        }
        else if (data.toLowerCase() == 'shipment pending' || data.toLowerCase() == 'in-transit') {
            return '<span class="badge badge-phoenix badge-phoenix-primary">' + data + '</span>';
        }
        else if (data.toLowerCase() == 'paid') {
            return '<span class="badge badge-phoenix badge-phoenix-success">' + data + '</span>';
        }
        else if (data.toLowerCase() == 'billing pending') {
            return '<span class="badge badge-phoenix badge-phoenix-brown">' + data + '</span>';
        }
        else if (data.toLowerCase() == 'delivered') {
            return '<span class="badge badge-phoenix badge-phoenix-brightGreen">' + data + '</span>';
        }
        else {
            return '<span class="badge badge-phoenix badge-phoenix-secondary">' + data + '</span>';
        }
    }

    this.GetSNSStatusHtml = function (data, row) {
        if (data == 1) {
            return '<span class="badge badge-phoenix badge-phoenix-danger">NOT ACCEPTED' + (row.isByPass ? " (Bypassed) " : "") + '</span>';
        } else if (data == 2) {
            return '<span class="badge badge-phoenix badge-phoenix-success">ACCEPTED' + (row.isByPass ? " (Bypassed) " : "") + '</span>';
        } else if (data == null || typeof data == "undefined" || data == 0) {
            return '<span class="badge badge-phoenix badge-phoenix-secondary">PENDING' + (row.isByPass ? " (Bypassed) " : "") + '</span>';
        }
        else {
            return '';
        }
    }

    this.GetEligibilityStatusHtml = function (data) {
        if (data == null || typeof data == "undefined" || data == 0) {
            return '<span class="badge badge-phoenix badge-phoenix-secondary">PENDING</span>';
        }
        else if (data == 1) {
            return '<span class="badge badge-phoenix badge-phoenix-success">ELIGIBLE</span>';
        }
        else if (data == 2) {
            return '<span class="badge badge-phoenix badge-phoenix-danger">NOT ELIGIBLE</span>';
        }
        else if (data == 3) {
            return '<span class="badge badge-phoenix badge-phoenix-danger">ERROR</span>';
        }
        else {
            return '';
        }
    }

    this.GetCheckEligibilityStatusHtml = function (data) {
        if (data == null || typeof data == "undefined" || data == 0) {
            return '<span class="badge badge-phoenix badge-phoenix-secondary">PENDING</span>';
        }
        else if (data == 1) {
            return '<span class="badge badge-phoenix badge-phoenix-success ">ELIGIBLE</span>';
        }
        else if (data == 2) {
            return '<span class="badge badge-phoenix badge-phoenix-warning ">NOT ELIGIBLE</span>';
        }
        else if (data == 3) {
            return '<span class="badge badge-phoenix badge-phoenix-danger ">ERROR</span>';
        }
        else {
            return '';
        }
    }

    this.GetBillingStatusHtml = function (data) {
        if (data == null || typeof data == "undefined" || data == 0) {
            return '<span class="badge badge-phoenix badge-phoenix-secondary">PENDING</span>';
        }
        else if (data == 1) {
            return '<span class="badge badge-phoenix badge-phoenix-success">BILLED</span>';
        }
        else {
            return '';
        }
    }

    this.GetShipmentStatusHtml = function (data) {
        if (data == null || typeof data == "undefined" || data == 0) {
            return '<span class="badge badge-phoenix badge-phoenix-secondary">PENDING</span>';
        }
        else if (data == 1) {
            return '<span class="badge badge-phoenix badge-phoenix-primary">IN-TRANSIT</span>';
        }
        else if (data == 2) {
            return '<span class="badge badge-phoenix badge-phoenix-success">DELIVERED</span>';
        }
        else if (data == 3) {
            return '<span class="badge badge-phoenix badge-phoenix-warning">RETURNED</span>';
        }
        else if (data == 4) {
            return '<span class="badge badge-phoenix badge-phoenix-info">UNDELIVERABLE</span>';
        }
        else if (data == 5) {
            return '<span class="badge badge-phoenix badge-phoenix-info ">RECIPIENT ACTION REQUIRED</span>';
        }
        else {
            return '';
        }
    }

    this.GetPaymentStatusHtml = function (data) {
        if (data == null || typeof data == "undefined" || data == 0) {
            return '<span class="badge badge-phoenix badge-phoenix-secondary">PENDING</span>';
        }
        else if (data == 1) {
            return '<span class="badge badge-phoenix badge-phoenix-success">PAID</span>';
        }
        else {
            return '';
        }
    }

    this.GetAddressStatusHtml = function (data, row) {
        if (data == true) {
            return '<span class="fas fa-check btn btn-sm btn-success iconAddrStatus" title="Address Valid" onclick="AlphaLab.Common.ShowAddrStatusInfo(\'' + row.addressStatus + '\',\'' + row.addressVerifiedOn + '\')"></span>';
        }
        else if (data == false) {
            return '<span class="fas fa-times btn btn-sm btn-danger iconAddrStatus" title="Address Invalid" onclick="AlphaLab.Common.ShowAddrStatusInfo(\'' + row.addressStatus + '\',\'' + row.addressVerifiedOn + '\')"></span>';
        }
        else {
            return '<span class="fas fa-info-circle btn btn-sm btn-secondary iconAddrStatus" title="Verification is pending" onclick="AlphaLab.Common.ShowAddrStatusInfo(\'' + row.addressStatus + '\',\'' + row.addressVerifiedOn + '\')"></span>';
        }
    }

    this.GetMemberIdHtml = function (data, row) {
        data = AlphaLab.Common.MaskString(data, AlphaLab.Common.MaskLastCharacters);
        let status = [];
        if (row.isDoNotCall) {
            status.push("DO NOT CALL AGAIN");
        }
        if (row.isRequestForReturn) {
            status.push("REQUEST FOR RETURN");
        }
        if (row.isReturnReceived) {
            status.push("RETURN RECEIVED");
        }
        if (status.length > 0) {
            let title = 'Customer Status: ' + status.join(", ");
            return '<span title="' + title + '" class="text-danger"><b>' + data + '</b></span>';
        } else {
            return data;
        }
    }

    this.GetAudioRecordHtml = function (data) {
        if (data > 0) {
            return '<span class="fas fa-check btn btn-sm btn-success iconAddrStatus" title="' + data + ' Audio Recording Added" ></span>';
        }
        else {
            return '<span class="fas fa-info-circle btn btn-sm btn-secondary iconAddrStatus" title="No Audio Recording Added"></span>';
        }
    }

    this.GetRecordStatusHtml = function (isOld) {
        if (isOld) {
            return '<img src="' + UrlContent("Lib/Images/old.png") + '" />'
        }
        else {
            return '<img  src="' + UrlContent("Lib/Images/new.png") + '" />'
        }
    }

    this.ShowAddrStatusInfo = function (addressStatus, addressVerifiedOn) {
        var showMsg = '';
        if (addressStatus == "true")
            showMsg = "<span style='color:green'>Address: Verified On " + addressVerifiedOn + " - Address Valid</span>";
        else if (addressStatus == "false")
            showMsg = "<span style='color:maroon'>Address: Verified On " + addressVerifiedOn + " - Address Invalid</span>";
        else {
            showMsg = "<span style='color:black'>Address: Verification is pending</span>";
        }
        $("#addressStatusDialogContent").html(showMsg);
        $("#addressStatusdialog").modal('show');
    }

    this.GetQAHtml = function (data) {
        if (data == null || typeof data == "undefined" || data == 0) {
            return '<span class="badge badge-phoenix badge-phoenix-secondary ">PENDING</span>';
        }
        if (data == 1) {
            return '<span class="badge badge-phoenix badge-phoenix-primary">IN-REVIEW</span>';
        }
        if (data == 2) {
            return '<span class="badge badge-phoenix badge-phoenix-warning">WAITING FOR QA ADMIN</span>';
        }
        if (data == 3) {
            return '<span class="badge badge-phoenix badge-phoenix-success">APPROVED</span>';
        }
        if (data == 4) {
            return '<span class="badge badge-phoenix badge-phoenix-danger">REJECTED</span>';
        }
        else {
            return '';
        }
    }

    this.GetQAReviewStatus = function (row) {
        let PatientInterested = '', PatientEligible = '', SNSAccepted = '', ReportedToAdmin = '';

        if (row.isPatientInterested == 1) {
            PatientInterested = '<span class="fas fa-check btn btn-sm btn-success iconAddrStatus mr-1" title="Patient Is Interested" ></span>';
        } else if (row.isPatientInterested == 2) {
            PatientInterested = '<span class="fas fa-times btn btn-sm btn-danger iconAddrStatus mr-1" title="Patient Is Not Interested" ></span>';
        }
        else {
            PatientInterested = '<span class="fas fa-info-circle btn btn-sm btn-secondary iconAddrStatus mr-1" title="Patient Interesting Status Is Pending"></span>';
        }

        if (row.isPatientEligible == 1) {
            PatientEligible = '<span class="fas fa-check btn btn-sm btn-success iconAddrStatus mr-1" title="Patient Is Eligible" ></span>';
        } else if (row.isPatientEligible == 2) {
            PatientEligible = '<span class="fas fa-times btn btn-sm  btn-danger iconAddrStatus mr-1" title="Patient Is Not Eligible" ></span>';
        }
        else {
            PatientEligible = '<span class="fas fa-info-circle btn btn-sm btn-secondary iconAddrStatus mr-1" title="Patient Eligibility Status Is Pending"></span>';
        }

        if (row.isSNSAccepted == 1) {
            SNSAccepted = '<span class="fas fa-check btn btn-sm btn-success iconAddrStatus mr-1" title="Good Audio" ></span>';
        } else if (row.isSNSAccepted == 2) {
            SNSAccepted = '<span class="fas fa-times btn btn-sm btn-danger iconAddrStatus mr-1" title="Not Good Audio" ></span>';
        }
        else {
            SNSAccepted = '<span class="fas fa-info-circle btn btn-sm btn-secondary iconAddrStatus mr-1" title="Good Audio Status Is Pending"></span>';
        }

        if (row.isReportedToAdmin == 1) {
            ReportedToAdmin = '<span class="fas fa-times btn btn-sm btn-danger iconAddrStatus mr-1" title="Lead Reported To QA Admin" ></span>';
        } else if (row.isReportedToAdmin == 2) {
            ReportedToAdmin = '<span class="fas fa-check btn btn-sm  btn-success iconAddrStatus mr-1" title="Lead Not Reported To QA Admin" ></span>';
        }
        else {
            ReportedToAdmin = '<span class="fas fa-info-circle btn btn-sm btn-secondary iconAddrStatus mr-1" title="Report Status Is Pending"></span>';
        }

        return PatientInterested + PatientEligible + SNSAccepted + ReportedToAdmin;
    }

    this.ValidateAddress = function (isView = false) {
        $(".preloader").show();
        var model = {
            Add1: $("#Address1").val(),
            Add2: $("#Address2").val(),
            City: $("#City").val(),
            StateId: $("#StateId").val(),
            Country: "US",
            ZipCode: $("#ZipCode").val(),
            LastName: $("#LastName").val(),
            FirstName: $("#FirstName").val(),
        }
        $.ajax({
            url: UrlContent("USPS/ValidateAddress"),
            type: 'POST',
            data: model,
            success: function (data) {

                if (data.isSuccess) {
                    $("#Address1").val(data.add1);
                    $("#Address2").val(data.add2);
                    $("#City").val(data.city);
                    $("#StateId").val(data.stateId).trigger("change");
                    $("#ZipCode").val(data.zipCode);
                    $("#IsAddressVerified").val(true);
                    $("#AddressVerifiedOn").val(data.verifiedOn);
                    $("#addressVerifiedIcon").removeClass('hide');
                    $("#notAddressVerifiedIcon").addClass('hide');

                    //save update address in db
                    if (isView) {
                        var addressModel = {
                            Add1: $("#Address1").val(),
                            Add2: $("#Address2").val(),
                            City: $("#City").val(),
                            StateId: $("#StateId").val(),
                            ZipCode: $("#ZipCode").val(),
                            LeadId: $("#hdnLeadId").val(),
                            IsAddressVerified: $("#IsAddressVerified").val(),
                        }
                        $.ajax({
                            url: UrlContent("Common/SaveValidateAddress"),
                            type: 'POST',
                            data: addressModel,
                            success: function (data) {

                            }
                        });
                    };
                    $(".preloader").hide();
                }
                else {
                    $(".preloader").hide();
                    $("#IsAddressVerified").val(false);
                    AlphaLab.Common.ToastrError(data.message)
                    $("#addressVerifiedIcon").addClass('hide');
                    $("#notAddressVerifiedIcon").removeClass('hide');
                };

            },
            error: function (errorr) {
                $(".preloader").hide();
            }
        });
    }

    this.Track = function (trackingNumber, isReloadPage = false) {
        $(".preloader").show();
        $.ajax({
            url: UrlContent("USPS/_Track"),
            data: { trackingNumber: trackingNumber },
            success: function (response) {
                $(".preloader").hide();
                if (response.includes("txtResponseModalPopupId")) {
                    $("#common-md-dialogContent").html(response);
                    $("#common-md-dialog").modal("show")
                } else {
                    $("#common-lg-dialogContent").html(response);
                    $("#common-lg-dialog").modal("show")
                }
                if (isReloadPage) {
                    $('.modal').on('hidden.bs.modal', function (e) {
                        window.location.reload();
                    })
                }
            },
            error: function (errorr) {
                $(".preloader").hide();
            }
        });
    }

    this.OnFilterClick = function (dataClass) {
        if ($("." + dataClass).hasClass("filter")) {
            $("." + dataClass).removeClass("filter");
            $("#" + dataClass).addClass("hide");
        } else {
            $("#" + dataClass).removeClass("hide");
            $("." + dataClass).addClass("filter");
        }
        AlphaLab.Common.ApplyFilter();
    }

    this.ApplyFilter = function () {
        var LeadStatus = $(".LeadStatus.filter");
        var EVStatus = $(".EVStatus.filter");
        var ShipmentStatus = $(".ShipmentStatus.filter");
        var AddressStatus = $(".AddressStatus.filter");
        var BPO = $(".BPO.filter");
        var SNSStatus = $(".SNSStatus.filter");
        var QAStatus = $(".QAStatus.filter");
        var RecordStatus = $(".RecordStatus.filter");
        var DNCStatus = $(".DNCStatus.filter");
        var BPOCenter = $(".BPOCenter.filter");
        var AudioStatus = $(".AudioStatus.filter");

        listLeadStatus = [];
        listEVStatus = [];
        listShipmentStatus = [];
        listAddressStatus = [];
        listBPO = [];
        listSNSStatus = [];
        listQAStatus = [];
        listRecordStatus = [];
        listDNCStatus = [];
        listBPOCenter = [];
        listAudioStatus = [];

        $.each(LeadStatus, function (index, data) {
            let childrens = $(data)[0].children;
            for (var i = 0; i < childrens.length; i++) {
                if (childrens[i].className == "dataValue")
                    listLeadStatus.push(childrens[i].value);
            }
        })
        $.each(EVStatus, function (index, data) {
            let childrens = $(data)[0].children;
            for (var i = 0; i < childrens.length; i++) {
                if (childrens[i].className == "dataValue")
                    listEVStatus.push(childrens[i].value);
            }
        })
        $.each(ShipmentStatus, function (index, data) {
            let childrens = $(data)[0].children;
            for (var i = 0; i < childrens.length; i++) {
                if (childrens[i].className == "dataValue")
                    listShipmentStatus.push(childrens[i].value);
            }
        })
        $.each(AddressStatus, function (index, data) {
            let childrens = $(data)[0].children;
            for (var i = 0; i < childrens.length; i++) {
                if (childrens[i].className == "dataValue")
                    listAddressStatus.push(childrens[i].value);
            }
        })
        $.each(BPO, function (index, data) {
            let childrens = $(data)[0].children;
            for (var i = 0; i < childrens.length; i++) {
                if (childrens[i].className == "dataValue")
                    listBPO.push(childrens[i].value);
            }
        })
        $.each(SNSStatus, function (index, data) {
            let childrens = $(data)[0].children;
            for (var i = 0; i < childrens.length; i++) {
                if (childrens[i].className == "dataValue")
                    listSNSStatus.push(childrens[i].value);
            }
        })
        $.each(QAStatus, function (index, data) {
            let childrens = $(data)[0].children;
            for (var i = 0; i < childrens.length; i++) {
                if (childrens[i].className == "dataValue")
                    listQAStatus.push(childrens[i].value);
            }
        })
        $.each(RecordStatus, function (index, data) {
            let childrens = $(data)[0].children;
            for (var i = 0; i < childrens.length; i++) {
                if (childrens[i].className == "dataValue")
                    listRecordStatus.push(childrens[i].value);
            }
        })
        $.each(DNCStatus, function (index, data) {
            let childrens = $(data)[0].children;
            for (var i = 0; i < childrens.length; i++) {
                if (childrens[i].className == "dataValue")
                    listDNCStatus.push(childrens[i].value);
            }
        })
        $.each(BPOCenter, function (index, data) {
            let childrens = $(data)[0].children;
            for (var i = 0; i < childrens.length; i++) {
                if (childrens[i].className == "dataValue")
                    listBPOCenter.push(childrens[i].value);
            }
        })
        $.each(AudioStatus, function (index, data) {
            let childrens = $(data)[0].children;
            for (var i = 0; i < childrens.length; i++) {
                if (childrens[i].className == "dataValue")
                    listAudioStatus.push(childrens[i].value);
            }
        })

        $("#hdnLeadStatus").val('');
        $("#hdnEVStatus").val('');
        $("#hdnShipmentStatus").val('');
        $("#hdnAddressStatus").val('');
        $("#hdnBPO").val('');
        $("#hdnSNSStatus").val('');
        $("#hdnQAStatus").val('');
        $("#hdnRecordStatus").val('');
        $("#hdnDNCStatus").val('');
        $("#hdnBPOCenter").val('');
        $("#hdnAudioStatus").val('');

        if (listLeadStatus.length > 0)
            $("#hdnLeadStatus").val(listLeadStatus.join(";"));
        if (listEVStatus.length > 0)
            $("#hdnEVStatus").val(listEVStatus.join(";"));
        if (listShipmentStatus.length > 0)
            $("#hdnShipmentStatus").val(listShipmentStatus.join(";"));
        if (listAddressStatus.length > 0)
            $("#hdnAddressStatus").val(listAddressStatus.join(";"));
        if (listBPO.length > 0)
            $("#hdnBPO").val(listBPO.join(";"));
        if (listSNSStatus.length > 0)
            $("#hdnSNSStatus").val(listSNSStatus.join(";"));
        if (listQAStatus.length > 0)
            $("#hdnQAStatus").val(listQAStatus.join(";"));
        if (listRecordStatus.length > 0)
            $("#hdnRecordStatus").val(listRecordStatus.join(";"));
        if (listDNCStatus.length > 0)
            $("#hdnDNCStatus").val(listDNCStatus.join(";"));
        if (listBPOCenter.length > 0)
            $("#hdnBPOCenter").val(listBPOCenter.join(";"));
        if (listAudioStatus.length > 0)
            $("#hdnAudioStatus").val(listAudioStatus.join(";"));

        if (AlphaLab.Leads != null && AlphaLab.Leads.Option != null && AlphaLab.Leads.Option.LeadTable != null) {
            AlphaLab.Leads.Option.LeadTable.ajax.reload();
        }
        if (AlphaLab.Shipment != null && AlphaLab.Shipment.Option != null && AlphaLab.Shipment.Option.ShipmentTable != null) {
            AlphaLab.Shipment.Option.ShipmentTable.ajax.reload();
        }
        if (AlphaLab.Eligibility != null && AlphaLab.Eligibility.Option != null && AlphaLab.Eligibility.Option.Table != null) {
            AlphaLab.Eligibility.Option.Table.ajax.reload();
        }
        if (AlphaLab.Billing != null && AlphaLab.Billing.Option != null && AlphaLab.Billing.Option.BillingTable != null) {
            AlphaLab.Billing.Option.BillingTable.ajax.reload();
        }
        if (AlphaLab.SNS != null && AlphaLab.SNS.Option != null && AlphaLab.SNS.Option.Table != null) {
            AlphaLab.SNS.Option.Table.ajax.reload();
        }
        if (AlphaLab.Dashboard != null && AlphaLab.Dashboard.Option != null && AlphaLab.Dashboard.Option.BillingTable != null) {
            AlphaLab.Dashboard.Option.BillingTable.ajax.reload();
        }
        if (AlphaLab.Audit != null && AlphaLab.Audit.Option != null && AlphaLab.Audit.Option.AuditTable != null) {
            AlphaLab.Audit.Option.AuditTable.ajax.reload();
        }
        if (AlphaLab.Adjudicated != null && AlphaLab.Adjudicated.Option != null && AlphaLab.Adjudicated.Option.Table != null) {
            AlphaLab.Adjudicated.Option.Table.ajax.reload();
        }
        if (AlphaLab.Payment != null && AlphaLab.Payment.Option != null && AlphaLab.Payment.Option.PaymentTable != null) {
            AlphaLab.Payment.Option.PaymentTable.ajax.reload();
        }

        AlphaLab.Common.SaveFilterInTemp();
    }

    this.Protect = function (value) {
        let protectedValue = "";
        $.ajax({
            type: "GET",
            data: { value: value },
            url: UrlContent("Common/Protect"),
            async: false,
            success: function (data) {
                protectedValue = data
            }
        })
        return protectedValue;
    }

    this.HistoryBack = function () {
        window.history.back()
    }

    this.SaveFilterInTemp = function () {
        $.ajax({
            type: "GET",
            data: {
                SearchText: $("#txtSearch").val(),
                LeadsStatus: $("#hdnLeadStatus").val(),
                EVStatus: $("#hdnEVStatus").val(),
                ShipmentStatus: $("#hdnShipmentStatus").val(),
                AddressStatus: $("#hdnAddressStatus").val(),
                BPO: $("#hdnBPO").val(),
                DateRange: $("#hdnCreatedDate").val(),
                SNSStatus: $("#hdnSNSStatus").val(),
                QAStatus: $("#hdnQAStatus").val(),
                RecordStatus: $("#hdnRecordStatus").val(),
                DNCStatus: $("#hdnDNCStatus").val(),
                BPOCenter: $("#hdnBPOCenter").val(),
                AudioStatus: $("#hdnAudioStatus").val(),
            },
            url: UrlContent("Common/SaveTempFilter"),
            success: function (data) {

            }
        })
    }

    this.SaveAndCheckEV = function () {

        var formdata = {
            FirstName: $("#FirstName").val(),
            LastName: $("#LastName").val(),
            Dob: $("#Dob").val(),
            Suffix: $("#Suffix").val(),
            LeadId: $("#hdnLeadId").val(),
            MedicareId: $("#txtMedicareId").val(),
        };
        Swal.fire({
            title: '',
            html: '',
            icon: 'question',
            allowOutsideClick: false,
            showCancelButton: true,
            confirmButtonColor: '#6BBD57',
            cancelButtonColor: '#E2AA3F',
            confirmButtonText: '<i class="fas fa-check"></i> With DOB ',
            cancelButtonText: '<i class="far fa-lightbulb"></i> Without DOB ',
        }).then((confirmationresult) => {
            $(".preloader").show();
            var isWithoutDOB_Search = !confirmationresult.value;
            $.ajax({
                type: "Post",
                url: UrlContent("Common/SaveDataForEV"),
                data: formdata,
                success: function (result) {
                    if (result.isSuccess) {
                        let eligibilityId = $("#hdnEligibilityId").val();
                        $.ajax({
                            type: "Post",
                            url: UrlContent("Common/CheckEligibility"),
                            data: {
                                id: eligibilityId,
                                isWithoutDOB_Search: isWithoutDOB_Search
                            },
                            success: function (eligibilityResult) {
                                $(".preloader").hide();
                                AlphaLab.Eligibility.Option.CheckEligibilityTable.ajax.reload();
                                // update eligibility status
                                if (eligibilityResult.result != null && eligibilityResult.result != "" && typeof eligibilityResult.result != "undefined") {
                                    let status = $("#EligibilityStatusId");
                                    if (status != null) {
                                        $("#EligibilityStatusId").val(eligibilityResult.result)
                                    }
                                }
                                // update eligibility comments
                                if (eligibilityResult.result1 != null && eligibilityResult.result1 != "" && typeof eligibilityResult.result1 != "undefined") {
                                    let status = $("#EligibilityComments");
                                    if (status != null) {
                                        $("#EligibilityComments").val(eligibilityResult.result1)
                                    }
                                }
                                // update Patient DOB
                                if (eligibilityResult.isSuccess && eligibilityResult.result2 != null && eligibilityResult.result2 != "" && typeof eligibilityResult.result2 != "undefined") {
                                    $("#Dob").val(eligibilityResult.result2);
                                }
                                if (eligibilityResult.isSuccess) {
                                    AlphaLab.Common.ToastrSuccess(eligibilityResult.message);
                                } else {
                                    AlphaLab.Common.ToastrError(eligibilityResult.message);
                                }
                            },
                        })
                    } else {
                        $(".preloader").hide();
                        AlphaLab.Common.ToastrError(result.message);
                    }
                },
            })
        });

    }


    this.isNumber = function (evt) {
        evt = (evt) ? evt : window.event;
        var charCode = (evt.which) ? evt.which : evt.keyCode;
        if ((charCode > 31 && charCode < 48) || charCode > 57) {
            return false;
        }
        return true;
    }

    this.GetActionButtons = function () {
        let buttons = '';
        for (var i = 0; i < arguments.length; i++) {
            buttons += arguments[i];
        }

        let div = `
            <div class="font-sans-serif btn-reveal-trigger position-static">
                <button class="btn btn-sm dropdown-toggle dropdown-caret-none transition-none btn-reveal fs--2" type="button" data-bs-toggle="dropdown" data-boundary="window" aria-haspopup="true" aria-expanded="false" data-bs-reference="parent"><span class="fas fa-ellipsis-h fs--2"></span></button>
                <div class="dropdown-menu dropdown-menu-end py-2">
                    `+ buttons + `
                            
                </div>
            </div>`
        return div;
    }

}
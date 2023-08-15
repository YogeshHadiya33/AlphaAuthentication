AlphaLab.Auth = new function () {

    this.RefreshCaptcha = function () {
        $.ajax({
            url: UrlContent("Account/RefreshCaptcha"),
            type: 'GET',
            dataType: 'json',
            contentType: 'application/json',
            success: function (data) {
                $(".imgCaptcha").attr("src", data);
            }
        });
    }


    this.EncryptPwd = function () {
        if ($("#txtUsername") != null) {
            var txtUserName = $("#txtUsername").val();
            var txtPassword = $("#txtPassword").val();
            var txtCaptcha = $("#txtCaptcha").val();

            if (txtUserName == null || txtUserName == "" || typeof txtUserName == "undefined") {
                return false;
            }
            else if (txtPassword == null || txtPassword == "" || typeof txtPassword == "undefined") {
                return false;
            }
            else if (txtCaptcha == null || txtCaptcha == "" || typeof txtCaptcha == "undefined") {
                return false;
            }
            else {
                $(".preloader").show();
                var key = CryptoJS.enc.Utf8.parse('8080808080808080');
                var iv = CryptoJS.enc.Utf8.parse('8080808080808080');
                var encryptedpassword = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(txtPassword), key,
                    {
                        keySize: 128 / 8,
                        iv: iv,
                        mode: CryptoJS.mode.CBC,
                        padding: CryptoJS.pad.Pkcs7
                    });
                $("#txtPassword").val(encryptedpassword);
                return true;
            }
        }
    }

    this.EncryptPwdInReset = function () {
        if ($("#resetPasswordForm").valid()) {
            var txtPassword = $("#Password").val();

            if (txtPassword == null || typeof txtPassword == "undefined" || txtPassword == "") {
                return false;
            }
            else {
                var key = CryptoJS.enc.Utf8.parse('8080808080808080');
                var iv = CryptoJS.enc.Utf8.parse('8080808080808080');
                var encryptedpassword = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(txtPassword), key,
                    {
                        keySize: 128 / 8,
                        iv: iv,
                        mode: CryptoJS.mode.CBC,
                        padding: CryptoJS.pad.Pkcs7
                    });
                $("#Password").val(encryptedpassword);
                let confPass = $("#ConfirmPassword");
                if (confPass != null && typeof confPass != "undefined") {
                    var encryptedConfpassword = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(confPass.val().trim()), key,
                        {
                            keySize: 128 / 8,
                            iv: iv,
                            mode: CryptoJS.mode.CBC,
                            padding: CryptoJS.pad.Pkcs7
                        });
                    confPass.val(encryptedConfpassword);
                }
                return true;
            }
        }
    }

}
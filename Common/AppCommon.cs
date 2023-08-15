using System.Security.Cryptography;
using System.Security.Cryptography.Xml;
using System.Text;
using System.Xml.Linq;

namespace AlphaAuthentication.Common
{
    public static class AppCommon
    {
        static string key = "8080808080808080";

        public static string ConnectionString = "";
        public static string ErrorMessage = "Something went wrong. Please try again";


        public static void LogException(Exception ex, string source = "")
        {
            try
            {
                var TraceMsg = ex.StackTrace.ToString();
                var ErrorLineNo = TraceMsg.Substring(ex.StackTrace.Length - 7, 7);
                var ErrorMsg = ex.Message.ToString();
                var ErrorMsginDept = ex.InnerException;
                var Errortype = ex.GetType().ToString();
                var ErrorLocation = ex.Message.ToString();
                string filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/LogFiles/");

                if (!Directory.Exists(filePath))
                    Directory.CreateDirectory(filePath);
                filePath = filePath + DateTime.Now.ToString("dd-MMM-yyyy") + ".txt";
                using (StreamWriter sw = File.AppendText(filePath))
                {
                    sw.WriteLine("---------------------------------------------------------------------------------------");
                    sw.WriteLine("Log date time     : " + DateTime.Now.ToString("dd-MMM-yyyy HH:mm:ss"));
                    sw.WriteLine("Source			: " + source);
                    sw.WriteLine("Error line number : " + ErrorLineNo);
                    sw.WriteLine("Error message     : " + ErrorMsg + ErrorLocation);
                    sw.WriteLine("Trace message     : " + TraceMsg);
                    sw.WriteLine("Inner Exception   : " + ErrorMsginDept);
                    sw.WriteLine("----------------------------------------------------------------------------------------");
                    sw.WriteLine("\n");
                    sw.Flush();
                    sw.Close();
                }
            }
            catch (IOException)
            {
                System.Threading.Thread.Sleep(100);
            }
        }

        public static string Encrypt(string input)
        {
            try
            {
                using (Aes aesAlg = Aes.Create())
                {
                    aesAlg.Key = Encoding.UTF8.GetBytes(key);
                    aesAlg.Mode = CipherMode.ECB;
                    aesAlg.Padding = PaddingMode.PKCS7;

                    ICryptoTransform encryptor = aesAlg.CreateEncryptor(aesAlg.Key, aesAlg.IV);
                    byte[] encryptedBytes = encryptor.TransformFinalBlock(Encoding.UTF8.GetBytes(input), 0, input.Length);

                    string encryptedHex = BitConverter.ToString(encryptedBytes).Replace("-", string.Empty);
                    return FormatText(encryptedHex);

                }
            }
            catch (Exception ex)
            {
                LogException(ex, "AppCommon=Encrypt");
            }
            return "";
        }

        public static string Decrypt(string encrypted)
        {
            try
            {
                string encryptedHex = DeformatText(encrypted);

                using (Aes aesAlg = Aes.Create())
                {
                    aesAlg.Key = Encoding.UTF8.GetBytes(key);
                    aesAlg.Mode = CipherMode.ECB;
                    aesAlg.Padding = PaddingMode.PKCS7;

                    ICryptoTransform decryptor = aesAlg.CreateDecryptor(aesAlg.Key, aesAlg.IV);
                    byte[] encryptedBytes = new byte[encryptedHex.Length / 2];
                    for (int i = 0; i < encryptedHex.Length; i += 2)
                    {
                        encryptedBytes[i / 2] = Convert.ToByte(encryptedHex.Substring(i, 2), 16);
                    }

                    byte[] decryptedBytes = decryptor.TransformFinalBlock(encryptedBytes, 0, encryptedBytes.Length);
                    return Encoding.UTF8.GetString(decryptedBytes);

                }

            }
            catch (Exception ex)
            {
                LogException(ex, "AppCommon=Decrypt");
            }
            return "";
        }

        static string FormatText(string text)
        {
            return $"{text.Substring(0, 8)}-{text.Substring(8, 4)}-{text.Substring(12, 4)}-{text.Substring(16, 4)}-{text.Substring(20)}";
        }

        static string DeformatText(string formattedText)
        {
            return formattedText.Replace("-", string.Empty);
        }
    }
}

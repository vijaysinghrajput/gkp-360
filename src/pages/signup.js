import { useState } from "react";
import { sendOtp } from "../firebase"; // Import Firebase utility function

function SendOtpComponent() {
  const [mobile, setMobile] = useState("");
  const [message, setMessage] = useState("");

  const handleSendOtp = async () => {
    if (!/^[0-9]{10}$/.test(mobile)) {
      setMessage("Enter a valid 10-digit mobile number.");
      return;
    }

    const result = await sendOtp(mobile);
    if (result.success) {
      setMessage("OTP sent successfully!");
    } else {
      setMessage(`Error: ${result.error}`);
    }
  };

  return (
    <div>
      <h2>Send OTP</h2>
      <input
        type="tel"
        value={mobile}
        onChange={(e) => setMobile(e.target.value)}
        placeholder="Enter your mobile number"
        style={{ padding: "10px", marginBottom: "10px", width: "300px" }}
      />
      <br />
      <button onClick={handleSendOtp} style={{ padding: "10px 20px" }}>
        Send OTP
      </button>
      <div id="recaptcha-container"></div>
      {message && <p style={{ marginTop: "10px" }}>{message}</p>}
    </div>
  );
}

export default SendOtpComponent;

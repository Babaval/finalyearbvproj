// src/Auth.js
import React, { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';

const Auth = ({ onAuthSuccess }) => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [generatedOtp, setGeneratedOtp] = useState('');
    const [isOtpSent, setIsOtpSent] = useState(false);

    const handleSendOtp = () => {
        if (!phoneNumber) {
            alert("Please enter a phone number.");
            return;
        }

        // Generate a 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        setGeneratedOtp(otp);
        setIsOtpSent(true);

        // Mock sending the OTP by displaying it in the QR Code (in a real app, this would be sent via SMS)
        alert(`Your OTP is ${otp}`); // For demo purposes
    };

    const handleVerifyOtp = () => {
        if (otp === generatedOtp) {
            onAuthSuccess(); // Grant access
        } else {
            alert("Invalid OTP. Please try again.");
        }
    };

    return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
            <h2>Authenticate to Access</h2>
            
            <input
                type="text"
                placeholder="Enter phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                style={{ marginBottom: '10px', padding: '8px', width: '200px' }}
            />
            <button onClick={handleSendOtp} style={{ padding: '8px 20px', marginLeft: '10px' }}>
                Send OTP
            </button>

            {isOtpSent && (
                <div style={{ marginTop: '20px' }}>
                    <p>Scan this QR Code:</p>
                    <QRCodeCanvas value={`Your OTP is: ${generatedOtp}`} />

                    <div style={{ marginTop: '20px' }}>
                        <input
                            type="text"
                            placeholder="Enter OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            style={{ padding: '8px', width: '200px' }}
                        />
                        <button onClick={handleVerifyOtp} style={{ padding: '8px 20px', marginLeft: '10px' }}>
                            Verify OTP
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Auth;

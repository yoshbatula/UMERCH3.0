<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>UMERCH OTP Verification</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
            line-height: 1.6;
            color: #333;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }

        .email-container {
            max-width: 600px;
            width: 100%;
            background: white;
            border-radius: 12px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }

        .header {
            background: linear-gradient(135deg, #9C0306 0%, #7a0205 100%);
            padding: 40px 20px;
            text-align: center;
            color: white;
        }

        .logo {
            font-size: 28px;
            font-weight: 700;
            letter-spacing: 1px;
            margin-bottom: 10px;
        }

        .tagline {
            font-size: 14px;
            opacity: 0.9;
            font-weight: 300;
        }

        .content {
            padding: 40px 30px;
        }

        .greeting {
            font-size: 18px;
            font-weight: 600;
            color: #333;
            margin-bottom: 15px;
        }

        .description {
            font-size: 14px;
            color: #666;
            margin-bottom: 30px;
            line-height: 1.8;
        }

        .otp-section {
            background: linear-gradient(135deg, #f8f9fa 0%, #f0f2f5 100%);
            border-left: 4px solid #9C0306;
            padding: 25px;
            margin: 30px 0;
            border-radius: 8px;
            text-align: center;
        }

        .otp-label {
            font-size: 12px;
            color: #9C0306;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 12px;
        }

        .otp-code {
            font-size: 42px;
            font-weight: 700;
            color: #9C0306;
            letter-spacing: 8px;
            font-family: 'Courier New', monospace;
            word-break: break-all;
        }

        .otp-validity {
            font-size: 12px;
            color: #999;
            margin-top: 12px;
            font-style: italic;
        }

        .warning {
            background-color: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
            font-size: 13px;
            color: #856404;
            line-height: 1.6;
        }

        .warning-icon {
            display: inline-block;
            margin-right: 8px;
            font-weight: bold;
        }

        .footer-content {
            color: #666;
            font-size: 13px;
            line-height: 1.8;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
        }

        .footer-content p {
            margin-bottom: 8px;
        }

        .footer {
            background: #f8f9fa;
            padding: 20px 30px;
            text-align: center;
            border-top: 1px solid #eee;
        }

        .footer-text {
            font-size: 12px;
            color: #999;
        }

        .footer-links {
            margin-top: 15px;
        }

        .footer-links a {
            font-size: 12px;
            color: #9C0306;
            text-decoration: none;
            margin: 0 10px;
        }

        .footer-links a:hover {
            text-decoration: underline;
        }

        .divider {
            height: 1px;
            background: #eee;
            margin: 20px 0;
        }

        .help-section {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            margin-top: 20px;
            font-size: 13px;
            color: #666;
        }

        .help-section strong {
            color: #333;
        }

        @media (max-width: 600px) {
            .email-container {
                border-radius: 0;
            }

            .header {
                padding: 30px 15px;
            }

            .content {
                padding: 25px 15px;
            }

            .otp-code {
                font-size: 32px;
                letter-spacing: 4px;
            }

            .footer {
                padding: 15px 15px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Header -->
        <div class="header">
            <div class="logo">🛍️ UMERCH</div>
            <div class="tagline">Your One-Stop Shop for Quality Products</div>
        </div>

        <!-- Content -->
        <div class="content">
            <div class="greeting">
                Hello {{ $userName }},
            </div>

            <div class="description">
                Thank you for using UMERCH! We've received a request to verify your email address. To proceed with your login, please use the verification code below:
            </div>

            <!-- OTP Display -->
            <div class="otp-section">
                <div class="otp-label">Your Verification Code</div>
                <div class="otp-code">{{ $otp }}</div>
                <div class="otp-validity">✓ This code is valid for 5 minutes</div>
            </div>

            <!-- Security Warning -->
            <div class="warning">
                <span class="warning-icon">⚠️</span>
                <strong>Security Notice:</strong> Never share this code with anyone. UMERCH staff will never ask for your OTP code.
            </div>

            <div class="help-section">
                <strong>Didn't request this code?</strong><br>
                If you didn't request a verification code, you can safely ignore this email. Your account remains secure.
            </div>

            <!-- Additional Information -->
            <div class="footer-content">
                <p>
                    <strong>Why did you receive this email?</strong><br>
                    You received this email because someone (hopefully you) requested a login verification code for your UMERCH account.
                </p>
                <p>
                    <strong>Having trouble?</strong><br>
                    If you're having issues with your account, please contact our support team at <strong>info@umindanao.edu.ph</strong>
                </p>
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <div class="footer-text">
                UMERCH © 2026 All Rights Reserved<br>
                University of Mindanao | Matina Campus
            </div>
            <div class="footer-links">
                <a href="#">Privacy Policy</a>
                <a href="#">Terms of Service</a>
                <a href="#">Contact Support</a>
            </div>
        </div>
    </div>
</body>
</html>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ config('app.name') }} - Under Maintenance</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #fff;
            padding: 20px;
        }
        
        .container {
            text-align: center;
            max-width: 600px;
        }
        
        .logo {
            width: 120px;
            height: 120px;
            margin: 0 auto 30px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            backdrop-filter: blur(10px);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }
        
        .logo svg {
            width: 60px;
            height: 60px;
            fill: #fff;
        }
        
        h1 {
            font-size: 48px;
            font-weight: 700;
            margin-bottom: 20px;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
        }
        
        .message {
            font-size: 18px;
            line-height: 1.6;
            margin-bottom: 30px;
            opacity: 0.9;
        }
        
        .timer {
            background: rgba(255, 255, 255, 0.1);
            padding: 20px 40px;
            border-radius: 10px;
            backdrop-filter: blur(10px);
            display: inline-block;
            margin-bottom: 30px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }
        
        .timer-label {
            font-size: 14px;
            opacity: 0.8;
            margin-bottom: 10px;
        }
        
        .timer-value {
            font-size: 36px;
            font-weight: 700;
        }
        
        .info {
            background: rgba(255, 255, 255, 0.1);
            padding: 20px;
            border-radius: 10px;
            backdrop-filter: blur(10px);
            margin-top: 30px;
        }
        
        .info p {
            font-size: 16px;
            margin-bottom: 10px;
        }
        
        .info strong {
            color: #fff;
            font-weight: 600;
        }
        
        .social {
            margin-top: 40px;
        }
        
        .social a {
            color: #fff;
            text-decoration: none;
            margin: 0 15px;
            opacity: 0.8;
            transition: all 0.3s;
            display: inline-block;
        }
        
        .social a:hover {
            opacity: 1;
            transform: translateY(-2px);
        }
        
        @keyframes pulse {
            0%, 100% {
                transform: scale(1);
            }
            50% {
                transform: scale(1.05);
            }
        }
        
        .logo {
            animation: pulse 2s infinite;
        }
        
        @keyframes spin {
            0% {
                transform: rotate(0deg);
            }
            100% {
                transform: rotate(360deg);
            }
        }
        
        .spinner {
            width: 40px;
            height: 40px;
            margin: 20px auto;
            border: 4px solid rgba(255, 255, 255, 0.3);
            border-top-color: #fff;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
        
        @media (max-width: 768px) {
            h1 {
                font-size: 36px;
            }
            
            .timer-value {
                font-size: 28px;
            }
            
            .message {
                font-size: 16px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">
            <!-- Tools/Wrench Icon for Maintenance -->
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"/>
            </svg>
        </div>
        
        <h1>We'll Be Back Soon!</h1>
        
        <p class="message">
            @if(isset($exception) && $exception->getMessage())
                {{ $exception->getMessage() }}
            @else
                We are currently performing scheduled maintenance to improve your experience. 
                Thank you for your patience!
            @endif
        </p>
        
        <div class="spinner"></div>
        
        <div class="timer">
            <div class="timer-label">Estimated time remaining:</div>
            <div class="timer-value" id="countdown">15:00</div>
        </div>
        
        <div class="info">
            <p>
                <strong>Need immediate assistance?</strong><br>
                Contact us at: <strong>support@avhira.com</strong>
            </p>
            <p style="margin-top: 15px; font-size: 14px; opacity: 0.8;">
                Don't worry! Your orders and data are safe. We're just making things better.
            </p>
        </div>
        
        <div class="social">
            <a href="https://twitter.com/avhira" target="_blank" title="Follow us on Twitter">
                <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
                </svg>
            </a>
            <a href="https://facebook.com/avhira" target="_blank" title="Follow us on Facebook">
                <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
                </svg>
            </a>
            <a href="https://instagram.com/avhira" target="_blank" title="Follow us on Instagram">
                <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
            </a>
        </div>
    </div>
    
    <script>
        // Countdown timer - get retry after from Laravel or default to 15 minutes
        let totalSeconds = 900; // 15 minutes default
        
        function updateCountdown() {
            const display = document.getElementById('countdown');
            const minutes = Math.floor(totalSeconds / 60);
            const seconds = totalSeconds % 60;
            
            display.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
            
            if (totalSeconds === 0) {
                display.textContent = 'Checking...';
                // Refresh page when timer reaches 0
                setTimeout(() => location.reload(), 2000);
                return;
            }
            
            totalSeconds--;
        }
        
        // Update countdown every second
        updateCountdown();
        const countdownInterval = setInterval(updateCountdown, 1000);
        
        // Auto-refresh every 30 seconds to check if site is back
        setInterval(() => {
            // Use fetch to check if site is back without full page reload
            fetch('/', { method: 'HEAD' })
                .then(response => {
                    if (response.ok) {
                        clearInterval(countdownInterval);
                        location.reload();
                    }
                })
                .catch(() => {
                    // Site still down, continue waiting
                });
        }, 30000);
    </script>
</body>
</html>

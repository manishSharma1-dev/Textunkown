import * as React from 'react';

interface EmailTemplateProps {
  username: string;
  verificationCode  : string;
}

export const EmailTemplate: React.FC<EmailTemplateProps> = ({
  username, verificationCode
}) => (
  <div>
    <h1>Welcome, {username}!</h1>
    <p>Your {verificationCode.length} digit code is {verificationCode}.</p>
    <p>If you didn't call for this otp ,then ignore it...</p>
  </div>
);
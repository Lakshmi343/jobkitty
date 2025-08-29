import React from 'react';
import { AlertTriangle, Mail, Phone } from 'lucide-react';
import { Button } from './ui/button';

const BlockedAccount = ({ userType = 'user' }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {/* Warning Icon */}
        <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
          <AlertTriangle className="w-8 h-8 text-red-600" />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Account Blocked
        </h1>

        {/* Message */}
        <div className="text-gray-600 mb-6 space-y-3">
          <p className="text-lg font-medium text-red-600">
            Your account has been blocked by the administrator.
          </p>
          <p className="text-base">
            You cannot access the website or use any features until an administrator removes this block from your account.
          </p>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm">
            <p className="font-medium text-red-800 mb-2">What this means:</p>
            <ul className="list-disc list-inside space-y-1 text-red-700">
              <li>You cannot log in to your account</li>
              <li>All website features are unavailable to you</li>
              <li>This applies to both employers and jobseekers</li>
              <li>Your account data is safe and will be restored when unblocked</li>
            </ul>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">Need Help?</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center justify-center gap-2">
              <Mail className="w-4 h-4" />
              <span>support@jobkitty.com</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Phone className="w-4 h-4" />
              <span>+1 (555) 123-4567</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <Button 
          onClick={() => window.location.href = '/'}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          Return to Homepage
        </Button>

        {/* Additional Info */}
        <p className="text-xs text-gray-500 mt-4">
          If you believe this is an error, please contact our support team for assistance.
        </p>
      </div>
    </div>
  );
};

export default BlockedAccount;

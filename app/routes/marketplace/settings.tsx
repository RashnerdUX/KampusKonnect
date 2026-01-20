import React from 'react';

const SettingsPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl lg:text-4xl font-bold mb-6 text-foreground">Account Settings</h1>
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Profile & Security</h2>
          <ul className="space-y-3">
            <li className="border border-border rounded-lg p-4 flex items-center justify-between">
              <span className="font-semibold">Change Email</span>
              <button className="text-primary hover:underline text-sm">Edit</button>
            </li>
            <li className="border border-border rounded-lg p-4 flex items-center justify-between">
              <span className="font-semibold">Change Password</span>
              <button className="text-primary hover:underline text-sm">Edit</button>
            </li>
            <li className="border border-border rounded-lg p-4 flex items-center justify-between">
              <span className="font-semibold">Two-Factor Authentication</span>
              <button className="text-primary hover:underline text-sm">Manage</button>
            </li>
            <li className="border border-border rounded-lg p-4 flex items-center justify-between">
              <span className="font-semibold">Delete Account</span>
              <button className="text-red-600 hover:underline text-sm">Delete</button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;

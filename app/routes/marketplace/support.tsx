import React from 'react';

const SupportPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl lg:text-4xl font-bold mb-6 text-foreground">Help & Support</h1>
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">How can we help you?</h2>
          <ul className="space-y-3">
            <li className="border border-border rounded-lg p-4">
              <p className="font-semibold">FAQs</p>
              <p className="text-sm text-muted-foreground">Find answers to common questions about using Campex.</p>
            </li>
            <li className="border border-border rounded-lg p-4">
              <p className="font-semibold">Contact Support</p>
              <p className="text-sm text-muted-foreground">Need help? Reach out to our support team for assistance.</p>
            </li>
            <li className="border border-border rounded-lg p-4">
              <p className="font-semibold">Report a Problem</p>
              <p className="text-sm text-muted-foreground">Let us know if you encounter any issues or bugs.</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;

import React from 'react';

const WalletPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl lg:text-4xl font-bold mb-6 text-foreground">Wallet & Payment Methods</h1>
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 mb-8">
          {/* Wallet Balance */}
          <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-lg p-6 mb-8">
            <p className="text-sm opacity-90 mb-2">Wallet Balance</p>
            <h3 className="text-4xl font-bold">₦12,500</h3>
          </div>
          {/* Payment Methods */}
          <h3 className="text-lg font-semibold mb-4">Saved Payment Methods</h3>
          <div className="space-y-3">
            {[1, 2].map((method) => (
              <div key={method} className="border border-border rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-8 bg-gradient-to-r from-blue-500 to-blue-700 rounded flex items-center justify-center text-white text-xs font-bold">
                    CARD
                  </div>
                  <div>
                    <p className="font-semibold">Card {method}</p>
                    <p className="text-sm text-muted-foreground">****  ****  ****  {3456 + method}</p>
                  </div>
                </div>
                <button className="text-red-600 hover:bg-red-50 dark:hover:bg-red-950 px-3 py-2 rounded transition-colors text-sm">
                  Remove
                </button>
              </div>
            ))}
          </div>
          <button className="mt-6 border-2 border-primary text-primary px-6 py-3 rounded-lg hover:bg-primary/10 transition-colors font-medium">
            Add Payment Method
          </button>
        </div>
      </div>
    </div>
  );
};

export default WalletPage;

import React from 'react';

const VouchersPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl lg:text-4xl font-bold mb-6 text-foreground">My Vouchers</h1>
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((voucher) => (
              <div key={voucher} className="border-2 border-primary rounded-lg p-4 bg-primary/5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-foreground">Save ₦{500 * voucher}</p>
                    <p className="text-sm text-muted-foreground">Expires Dec {25 + voucher}, 2026</p>
                  </div>
                  <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors text-sm">
                    Use Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VouchersPage;

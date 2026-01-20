import React from 'react';

const OrdersPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl lg:text-4xl font-bold mb-6 text-foreground">My Orders</h1>
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
          {/* Example orders list */}
          <div className="space-y-4">
            {[1, 2, 3].map((order) => (
              <div key={order} className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-foreground">Order #10000{order}</p>
                    <p className="text-sm text-muted-foreground">Placed on Jan {order}, 2026</p>
                  </div>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium dark:bg-blue-950 dark:text-blue-300">
                    In Transit
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <p className="text-foreground">₦5,500</p>
                  <button className="text-primary hover:underline text-sm">View Details</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;

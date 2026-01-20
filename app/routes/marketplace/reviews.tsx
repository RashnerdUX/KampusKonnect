import React from 'react';

const ReviewsPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl lg:text-4xl font-bold mb-6 text-foreground">My Reviews</h1>
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
          <div className="space-y-4">
            {[1, 2].map((review) => (
              <div key={review} className="border border-border rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <p className="font-semibold">Great product quality!</p>
                  <span className="text-yellow-500">★★★★★</span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">Reviewed on Jan {review}, 2026</p>
                <p className="text-foreground">Product arrived on time and exceeded expectations.</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewsPage;

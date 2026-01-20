import React from 'react';

const NotificationsPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl lg:text-4xl font-bold mb-6 text-foreground">Notifications</h1>
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
          <div className="space-y-4">
            {[1, 2, 3].map((notif) => (
              <div key={notif} className="border border-border rounded-lg p-4 flex items-center gap-4">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <div>
                  <p className="font-semibold text-foreground">Notification Title {notif}</p>
                  <p className="text-sm text-muted-foreground">This is a sample notification message for item {notif}.</p>
                  <p className="text-xs text-muted-foreground mt-1">Jan {notif}, 2026</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;

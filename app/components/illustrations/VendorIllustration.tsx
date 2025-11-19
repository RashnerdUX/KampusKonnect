export const VendorCardIllustration = () => (
  <svg viewBox="0 0 240 160" className="w-full h-40" xmlns="http://www.w3.org/2000/svg">
    {/* Vendor Card */}
    <rect x="40" y="15" width="160" height="130" rx="12" fill="#ffffff" stroke="#e5e7eb" strokeWidth="2"/>
    
    {/* Circle Avatar - centered */}
    <circle cx="120" cy="50" r="22" fill="#dbeafe"/>
    <text x="120" y="57" textAnchor="middle" fill="#3b82f6" fontSize="20" fontWeight="bold">I7</text>
    
    {/* Vendor Name */}
    <text x="120" y="88" textAnchor="middle" fill="#111827" fontSize="16" fontWeight="600">Item7</text>
    
    {/* Verified Badge - rounded pill */}
    <rect x="85" y="95" width="70" height="20" rx="10" fill="#d1fae5" stroke="#10b981" strokeWidth="1.5"/>
    <circle cx="95" cy="105" r="5" fill="#10b981"/>
    <path
      d="M 92.5 105 L 94 106.5 L 97.5 103"
      stroke="white"
      strokeWidth="1.5"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <text x="105" y="109" fill="#059669" fontSize="11" fontWeight="600">Verified</text>
    
    {/* Location with pin icon */}
    <g transform="translate(120, 125)">
      {/* Pin icon */}
      <path
        d="M -3 -5 Q -3 -7 -1.5 -8.5 Q 0 -10 1.5 -8.5 Q 3 -7 3 -5 Q 1.5 -2 0 0 Q -1.5 -2 -3 -5"
        fill="#ef4444"
      />
      <circle cx="0" cy="-6.5" r="1.5" fill="white"/>
      
      {/* Location text */}
      <text x="8" y="-2" fill="#6b7280" fontSize="10" fontWeight="500">University of Ilorin</text>
    </g>
  </svg>
);
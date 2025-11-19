export const CategoryGridIllustration = () => (
  <svg viewBox="0 0 240 160" className="w-full h-40" xmlns="http://www.w3.org/2000/svg">
    {/* Category Cards arranged in a mosaic */}
    
    {/* Food Card */}
    <rect x="20" y="20" width="60" height="60" rx="8" fill="#fee2e2"/>
    <text x="50" y="45" textAnchor="middle" fontSize="24">🍔</text>
    <text x="50" y="65" textAnchor="middle" fill="#991b1b" fontSize="10" fontWeight="600">Food</text>
    
    {/* Fashion Card */}
    <rect x="90" y="20" width="60" height="60" rx="8" fill="#fce7f3"/>
    <text x="120" y="45" textAnchor="middle" fontSize="24">👕</text>
    <text x="120" y="65" textAnchor="middle" fill="#831843" fontSize="10" fontWeight="600">Fashion</text>
    
    {/* Printing Card */}
    <rect x="160" y="20" width="60" height="60" rx="8" fill="#dbeafe"/>
    <text x="190" y="45" textAnchor="middle" fontSize="24">📚</text>
    <text x="190" y="65" textAnchor="middle" fill="#1e3a8a" fontSize="10" fontWeight="600">Printing</text>
    
    {/* Gadgets Card */}
    <rect x="20" y="90" width="60" height="60" rx="8" fill="#e0e7ff"/>
    <text x="50" y="115" textAnchor="middle" fontSize="24">💻</text>
    <text x="50" y="135" textAnchor="middle" fill="#3730a3" fontSize="10" fontWeight="600">Gadgets</text>
    
    {/* Laundry Card */}
    <rect x="90" y="90" width="60" height="60" rx="8" fill="#fef3c7"/>
    <text x="120" y="115" textAnchor="middle" fontSize="24">🧺</text>
    <text x="120" y="135" textAnchor="middle" fill="#78350f" fontSize="10" fontWeight="600">Laundry</text>
    
    {/* Plus More indicator */}
    <rect x="160" y="90" width="60" height="60" rx="8" fill="#f3f4f6" strokeDasharray="4 4" stroke="#9ca3af" strokeWidth="2"/>
    <text x="190" y="120" textAnchor="middle" fill="#6b7280" fontSize="28" fontWeight="bold">+</text>
    <text x="190" y="135" textAnchor="middle" fill="#6b7280" fontSize="9" fontWeight="600">More</text>
  </svg>
);
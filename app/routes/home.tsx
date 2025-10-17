import { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Button,
  AppBar,
  Toolbar,
  IconButton,
  Fab,
  Paper
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import {
  Search,
  School,
  Add,
  FilterList,
  Login,
  ShoppingBasket
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router';
import { VendorCard } from '~/components/VendorCard';
import { UniSelect } from '~/components/UniSelect';
import { ReviewDialog } from '~/components/ReviewDialog';
import { AuthDialog } from '~/components/AuthDialog';
import { AddVendorDialog } from '~/components/AddVendorDialog';
import { getShortUniversityName } from '~/utils/helpers';
import type { Vendor, Category, ReviewFormData, AuthFormData, VendorFormData } from '~/types';

export async function loader() {
  const { getVendors, getUniversities, getCategories } = await import('~/utils/data.server');
  
  const [vendors, universities, categories] = await Promise.all([
    getVendors(),
    getUniversities(),
    getCategories()
  ]);

  return {
    vendors,
    universities,
    categories
  };
}

export async function action({ request }: { request: Request }) {
  const { getVendors, updateVendor } = await import('~/utils/data.server');
  
  const formData = await request.formData();
  const actionType = formData.get('actionType');

  if (actionType === 'review') {
    const vendorId = String(formData.get('vendorId'));
    const reviewData = {
      stars: Number(formData.get('stars')),
      name: String(formData.get('name')),
      text: String(formData.get('text')),
      createdAt: new Date().toISOString()
    };

    const vendors = await getVendors();
    const vendor = vendors.find(v => v.id === vendorId);
    
    if (vendor) {
      await updateVendor(vendorId, {
        reviews: [reviewData, ...vendor.reviews],
        ratings: [reviewData.stars, ...vendor.ratings]
      });
    }
  }

  return { success: true };
}

export function meta() {
  return [
    { title: "UniVendor NG - Campus Marketplace" },
    { name: "description", content: "Find campus vendors you can reach on WhatsApp—fast. Filter by university, category, or item." },
  ];
}

export default function Home({ loaderData }: { loaderData: { vendors: Vendor[]; universities: string[]; categories: Category[] } }) {
  const { vendors, universities, categories } = loaderData;
  
  // Filter states
  const [query, setQuery] = useState('');
  const [uniFilter, setUniFilter] = useState('');
  const [catFilter, setCatFilter] = useState('all');
  
  // Modal states
  const [reviewVendor, setReviewVendor] = useState<Vendor | null>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [addVendorOpen, setAddVendorOpen] = useState(false);
  
  // User state (mock)
  const [user, setUser] = useState<any>(null);

  // Filter vendors
  const filteredVendors = vendors.filter((vendor) => {
    const matchUni = uniFilter ? vendor.university === uniFilter : true;
    const matchCat = catFilter === 'all' ? true : vendor.category === catFilter;
    const matchQuery = query
      ? [vendor.name, vendor.university, vendor.category, ...vendor.items.map(i => i.title)]
          .join(' ')
          .toLowerCase()
          .includes(query.toLowerCase())
      : true;
    return matchUni && matchCat && matchQuery;
  });

  const handleReviewSubmit = (reviewData: ReviewFormData) => {
    if (!reviewVendor) return;
    
    const formData = new FormData();
    formData.append('actionType', 'review');
    formData.append('vendorId', reviewVendor.id);
    Object.entries(reviewData).forEach(([key, value]) => {
      formData.append(key, String(value));
    });

    // Submit review (this would normally use a form submission)
    // For now, we'll just close the dialog
    setReviewVendor(null);
  };

  const handleAuthSubmit = (authData: AuthFormData) => {
    // Mock user creation
    setUser(authData);
    setAuthOpen(false);
  };

  const handleAddVendorSubmit = (vendorData: VendorFormData) => {
    // This would normally redirect to the vendor/new route
    setAddVendorOpen(false);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
      {/* App Bar */}
      <AppBar position="sticky" sx={{ bgcolor: 'grey.900' }}>
        <Toolbar>
          <Box display="flex" alignItems="center" gap={2} flexGrow={1}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                bgcolor: 'success.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <School sx={{ color: 'white' }} />
            </Box>
            <Box>
              <Typography variant="h6" component="div" fontWeight="bold">
                UniVendor NG
              </Typography>
              <Typography variant="caption" sx={{ color: 'grey.300', lineHeight: 1 }}>
                Students ↔ Vendors. Instantly.
              </Typography>
            </Box>
          </Box>
          
          <Button
            color="inherit"
            startIcon={<Login />}
            onClick={() => setAuthOpen(true)}
            sx={{ borderRadius: 2 }}
          >
            {user ? `Hi, ${user.name.split(' ')[0]}` : 'Sign In'}
          </Button>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box 
            display="grid" 
            gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr' }} 
            gap={4} 
            alignItems="center"
          >
            <Box>
              <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
                Find campus vendors you can reach on WhatsApp—fast.
              </Typography>
              <Typography variant="h6" color="text.secondary" paragraph>
                Filter by university, category, or item. Compare prices, read reviews, and connect instantly.
              </Typography>
            </Box>
            
            <Box>
              <Paper sx={{ p: 3, borderRadius: 3 }}>
                <Box display="flex" flexDirection="column" gap={2}>
                  <TextField
                    placeholder="Search items or vendors (e.g., shawarma, printer, cables)"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    fullWidth
                    size="small"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                  
                  <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
                    <UniSelect
                      value={uniFilter}
                      onChange={setUniFilter}
                      universities={universities}
                      label="University"
                    />
                    
                    <FormControl fullWidth size="small">
                      <InputLabel>Category</InputLabel>
                      <Select
                        value={catFilter}
                        label="Category"
                        onChange={(e: SelectChangeEvent) => setCatFilter(e.target.value)}
                      >
                        <MenuItem value="all">All categories</MenuItem>
                        {categories.map((category) => (
                          <MenuItem key={category.key} value={category.key}>
                            {category.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                  
                  <Box display="flex" flexWrap="wrap" gap={1} pt={1}>
                    {categories.map((category) => (
                      <Chip
                        key={category.key}
                        label={category.label}
                        variant={catFilter === category.key ? "filled" : "outlined"}
                        onClick={() => setCatFilter(category.key)}
                        icon={<FilterList />}
                        sx={{ borderRadius: 3 }}
                      />
                    ))}
                  </Box>
                </Box>
              </Paper>
            </Box>
          </Box>
        </motion.div>
      </Container>

      {/* Results Section */}
      <Container maxWidth="lg" sx={{ pb: 10 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
          <Typography variant="h5" fontWeight="bold">
            {filteredVendors.length} vendor{filteredVendors.length !== 1 ? 's' : ''} found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {uniFilter ? `in ${getShortUniversityName(uniFilter)}` : 'across Nigeria'}
          </Typography>
        </Box>

        {filteredVendors.length > 0 ? (
          <Box 
            display="grid" 
            gridTemplateColumns={{ 
              xs: '1fr', 
              sm: 'repeat(2, 1fr)', 
              lg: 'repeat(3, 1fr)' 
            }} 
            gap={3}
          >
            <AnimatePresence mode="popLayout">
              {filteredVendors.map((vendor) => (
                <Box key={vendor.id}>
                  <VendorCard
                    vendor={vendor}
                    onReview={() => setReviewVendor(vendor)}
                  />
                </Box>
              ))}
            </AnimatePresence>
          </Box>
        ) : (
          <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 3, border: '2px dashed', borderColor: 'grey.300' }}>
            <ShoppingBasket sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              No matching vendors yet
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Try another university or category. Vendors can list instantly with their WhatsApp number.
            </Typography>
          </Paper>
        )}
      </Container>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add vendor"
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          borderRadius: 3
        }}
        component={Link}
        to="/vendor/new"
      >
        <Add />
      </Fab>

      {/* Dialogs */}
      <ReviewDialog
        open={!!reviewVendor}
        vendor={reviewVendor}
        onClose={() => setReviewVendor(null)}
        onSubmit={handleReviewSubmit}
      />

      <AuthDialog
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        onSubmit={handleAuthSubmit}
        universities={universities}
      />
    </Box>
  );
}

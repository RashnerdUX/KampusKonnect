import { redirect } from "react-router";
import { 
  Container, 
  Typography, 
  Box, 
  Paper,
  Button
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { AddVendorDialog } from '~/components/AddVendorDialog';
import { generateId, getCurrentTimestamp } from '~/utils/helpers';
import type { VendorFormData } from '~/types';
import { useState } from 'react';
import { Link } from 'react-router';

export async function loader() {
  const { getUniversities, getCategories } = await import('~/utils/data.server');
  
  const [universities, categories] = await Promise.all([
    getUniversities(),
    getCategories()
  ]);

  return {
    universities,
    categories
  };
}

export async function action({ request }: { request: Request }) {
  const { createVendor } = await import('~/utils/data.server');
  
  const formData = await request.formData();
  
  const vendorData: VendorFormData = {
    name: String(formData.get('name') || ''),
    university: String(formData.get('university') || ''),
    category: String(formData.get('category') || ''),
    whatsApp: String(formData.get('whatsApp') || ''),
    cover: String(formData.get('cover') || ''),
    title: String(formData.get('title') || ''),
    price: String(formData.get('price') || '')
  };

  // Validate required fields
  if (!vendorData.name || !vendorData.university || !vendorData.whatsApp || !vendorData.title || !vendorData.price) {
    return { error: 'All required fields must be filled' };
  }

  const newVendor = {
    id: generateId(),
    name: vendorData.name,
    university: vendorData.university,
    category: vendorData.category,
    whatsApp: vendorData.whatsApp,
    cover: vendorData.cover || 'https://images.unsplash.com/photo-1529078155058-5d716f45d604?q=80&w=1600&auto=format&fit=crop',
    items: [{ title: vendorData.title, price: Number(vendorData.price) }],
    ratings: [],
    reviews: [],
    createdAt: getCurrentTimestamp(),
    updatedAt: getCurrentTimestamp()
  };

  await createVendor(newVendor);
  
  return redirect('/');
}

export function meta() {
  return [
    { title: "Add New Vendor - UniVendor NG" },
    { name: "description", content: "Create a new vendor listing on UniVendor NG" },
  ];
}

export default function VendorNew({ loaderData }: { loaderData: { universities: string[]; categories: any[] } }) {
  const { universities, categories } = loaderData;
  const [dialogOpen, setDialogOpen] = useState(true);

  const handleDialogClose = () => {
    setDialogOpen(false);
    // Navigate back to home when dialog is closed
    window.history.back();
  };

  const handleSubmit = (vendorData: VendorFormData) => {
    const formData = new FormData();
    Object.entries(vendorData).forEach(([key, value]) => {
      formData.append(key, String(value));
    });

    // Submit the form
    const form = document.createElement('form');
    form.method = 'POST';
    form.style.display = 'none';
    
    Object.entries(vendorData).forEach(([key, value]) => {
      const input = document.createElement('input');
      input.name = key;
      input.value = String(value);
      form.appendChild(input);
    });
    
    document.body.appendChild(form);
    form.submit();
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Box display="flex" alignItems="center" gap={2} mb={3}>
          <Button
            component={Link}
            to="/"
            startIcon={<ArrowBack />}
            variant="outlined"
            sx={{ borderRadius: 2 }}
          >
            Back to Marketplace
          </Button>
        </Box>

        <Typography variant="h4" component="h1" gutterBottom>
          Add New Vendor Listing
        </Typography>
        
        <Typography variant="body1" color="text.secondary" mb={3}>
          Create your vendor profile and start connecting with students instantly via WhatsApp.
        </Typography>

        <AddVendorDialog
          open={dialogOpen}
          onClose={handleDialogClose}
          onSubmit={handleSubmit}
          universities={universities}
          categories={categories}
        />
      </Paper>
    </Container>
  );
}
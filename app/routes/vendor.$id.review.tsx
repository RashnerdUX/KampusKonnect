import { redirect } from "react-router";
import { 
  Container, 
  Typography, 
  Box, 
  Paper,
  Button
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { Link, useParams } from 'react-router';
import { ReviewDialog } from '~/components/ReviewDialog';
import { getCurrentTimestamp } from '~/utils/helpers';
import type { ReviewFormData } from '~/types';
import { useState } from 'react';

export async function loader({ params }: { params: { id: string } }) {
  const { getVendorById } = await import('~/utils/data.server');
  const vendor = await getVendorById(params.id);
  
  if (!vendor) {
    throw new Response("Vendor not found", { status: 404 });
  }

  return { vendor };
}

export async function action({ request, params }: { request: Request; params: { id: string } }) {
  const { getVendorById, updateVendor } = await import('~/utils/data.server');
  
  const formData = await request.formData();
  
  const reviewData: ReviewFormData = {
    stars: Number(formData.get('stars') || 5),
    name: String(formData.get('name') || ''),
    text: String(formData.get('text') || '')
  };

  // Validate required fields
  if (!reviewData.name || !reviewData.text) {
    return { error: 'Name and review text are required' };
  }

  const vendor = await getVendorById(params.id);
  if (!vendor) {
    throw new Response("Vendor not found", { status: 404 });
  }

  const newReview = {
    ...reviewData,
    createdAt: getCurrentTimestamp()
  };

  // Update vendor with new review and rating
  const updatedVendor = await updateVendor(params.id, {
    reviews: [newReview, ...vendor.reviews],
    ratings: [reviewData.stars, ...vendor.ratings]
  });

  if (!updatedVendor) {
    throw new Response("Failed to update vendor", { status: 500 });
  }
  
  return redirect(`/vendor/${params.id}`);
}

export function meta({ data }: { data: { vendor: any } }) {
  return [
    { title: `Review ${data.vendor.name} - UniVendor NG` },
    { name: "description", content: `Leave a review for ${data.vendor.name}` },
  ];
}

export default function VendorReview({ loaderData }: { loaderData: { vendor: any } }) {
  const { vendor } = loaderData;
  const [dialogOpen, setDialogOpen] = useState(true);

  const handleDialogClose = () => {
    setDialogOpen(false);
    // Navigate back to vendor page when dialog is closed
    window.history.back();
  };

  const handleSubmit = (reviewData: ReviewFormData) => {
    const formData = new FormData();
    Object.entries(reviewData).forEach(([key, value]) => {
      formData.append(key, String(value));
    });

    // Submit the form
    const form = document.createElement('form');
    form.method = 'POST';
    form.style.display = 'none';
    
    Object.entries(reviewData).forEach(([key, value]) => {
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
            to={`/vendor/${vendor.id}`}
            startIcon={<ArrowBack />}
            variant="outlined"
            sx={{ borderRadius: 2 }}
          >
            Back to {vendor.name}
          </Button>
        </Box>

        <Typography variant="h4" component="h1" gutterBottom>
          Review {vendor.name}
        </Typography>
        
        <Typography variant="body1" color="text.secondary" mb={3}>
          Share your experience to help other students make informed decisions.
        </Typography>

        <ReviewDialog
          open={dialogOpen}
          vendor={vendor}
          onClose={handleDialogClose}
          onSubmit={handleSubmit}
        />
      </Paper>
    </Container>
  );
}
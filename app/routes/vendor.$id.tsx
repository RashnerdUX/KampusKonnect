import { 
  Container, 
  Typography, 
  Box, 
  Paper,
  Button,
  Chip,
  Divider
} from '@mui/material';
import { ArrowBack, WhatsApp, LocationOn } from '@mui/icons-material';
import { Link, useParams } from 'react-router';
import { Stars } from '~/components/Stars';
import { average, formatNaira, generateWhatsAppLink, getShortUniversityName } from '~/utils/helpers';

export async function loader({ params }: { params: { id: string } }) {
  const { getVendorById } = await import('~/utils/data.server');
  const vendor = await getVendorById(params.id);
  
  if (!vendor) {
    throw new Response("Vendor not found", { status: 404 });
  }

  return { vendor };
}

export function meta({ data }: { data: { vendor: any } }) {
  return [
    { title: `${data.vendor.name} - UniVendor NG` },
    { name: "description", content: `View ${data.vendor.name}'s listings and contact details` },
  ];
}

export default function VendorDetail({ loaderData }: { loaderData: { vendor: any } }) {
  const { vendor } = loaderData;
  const rating = average(vendor.ratings);
  const chatText = `Hi ${vendor.name}! I found you on UniVendor NG and I'm interested in your items.`;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
        {/* Header Image */}
        <Box
          sx={{
            height: 300,
            backgroundImage: `url(${vendor.cover})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'relative',
            display: 'flex',
            alignItems: 'flex-end',
            p: 3
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)'
            }}
          />
          <Box position="relative" zIndex={1}>
            <Box display="flex" gap={1} mb={2}>
              <Chip
                icon={<LocationOn />}
                label={getShortUniversityName(vendor.university)}
                size="small"
                sx={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)'
                }}
              />
              <Chip
                label={vendor.category}
                size="small"
                sx={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  textTransform: 'capitalize'
                }}
              />
            </Box>
            <Typography variant="h4" component="h1" color="white" fontWeight="bold">
              {vendor.name}
            </Typography>
          </Box>
        </Box>

        <Box p={3}>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
            <Button
              component={Link}
              to="/"
              startIcon={<ArrowBack />}
              variant="outlined"
              sx={{ borderRadius: 2 }}
            >
              Back to Marketplace
            </Button>
            <Stars value={rating} size="medium" />
          </Box>

          {/* Items */}
          <Typography variant="h6" gutterBottom>
            Available Items
          </Typography>
          <Box display="grid" gridTemplateColumns="repeat(auto-fit, minmax(250px, 1fr))" gap={2} mb={3}>
            {vendor.items.map((item: any, idx: number) => (
              <Paper key={idx} variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                <Typography variant="subtitle1" fontWeight="medium">
                  {item.title}
                </Typography>
                <Typography variant="h6" color="primary" fontWeight="bold">
                  {formatNaira(item.price)}
                </Typography>
              </Paper>
            ))}
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Contact */}
          <Box display="flex" gap={2} mb={3}>
            <Button
              variant="contained"
              startIcon={<WhatsApp />}
              href={generateWhatsAppLink(vendor.whatsApp, chatText)}
              target="_blank"
              rel="noopener noreferrer"
              sx={{ 
                borderRadius: 2,
                backgroundColor: '#25D366',
                '&:hover': {
                  backgroundColor: '#128C7E'
                }
              }}
            >
              Contact on WhatsApp
            </Button>
            <Button
              component={Link}
              to={`/vendor/${vendor.id}/review`}
              variant="outlined"
              sx={{ borderRadius: 2 }}
            >
              Leave a Review
            </Button>
          </Box>

          {/* Reviews */}
          <Typography variant="h6" gutterBottom>
            Reviews ({vendor.reviews.length})
          </Typography>
          {vendor.reviews.length > 0 ? (
            <Box display="flex" flexDirection="column" gap={2}>
              {vendor.reviews.map((review: any, idx: number) => (
                <Paper key={idx} variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="subtitle2" fontWeight="medium">
                      {review.name}
                    </Typography>
                    <Stars value={review.stars} size="small" showValue={false} />
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {review.text}
                  </Typography>
                </Paper>
              ))}
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No reviews yet. Be the first to leave a review!
            </Typography>
          )}
        </Box>
      </Paper>
    </Container>
  );
}
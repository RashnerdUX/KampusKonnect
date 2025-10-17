import { 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  Box, 
  Chip, 
  Button,
  Divider
} from '@mui/material';
import { 
  Store, 
  LocationOn, 
  WhatsApp, 
  RateReview 
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Stars } from './Stars';
import { average, formatNaira, generateWhatsAppLink, getShortUniversityName } from '~/utils/helpers';
import type { Vendor } from '~/types';

interface VendorCardProps {
  vendor: Vendor;
  onReview: (vendor: Vendor) => void;
}

export function VendorCard({ vendor, onReview }: VendorCardProps) {
  const rating = average(vendor.ratings);
  const chatText = `Hi ${vendor.name}! I found you on UniVendor NG and I'm interested in your items.`;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Card 
        sx={{ 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column',
          borderRadius: 3,
          overflow: 'hidden'
        }}
      >
        <Box position="relative">
          <CardMedia
            component="img"
            height="200"
            image={vendor.cover}
            alt={vendor.name}
          />
          <Box
            position="absolute"
            bottom={8}
            left={8}
            display="flex"
            gap={1}
          >
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
        </Box>

        <CardContent sx={{ flexGrow: 1, p: 2 }}>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
            <Box>
              <Typography variant="h6" component="h2" fontWeight="bold">
                {vendor.name}
              </Typography>
              <Box display="flex" alignItems="center" gap={0.5} mt={0.5}>
                <Store fontSize="small" color="action" />
                <Typography variant="caption" color="text.secondary">
                  Vendor
                </Typography>
              </Box>
            </Box>
            <Stars value={rating} />
          </Box>

          <Box display="grid" gridTemplateColumns="1fr 1fr" gap={1} mb={2}>
            {vendor.items.slice(0, 4).map((item, idx) => (
              <Box
                key={idx}
                sx={{
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 2,
                  p: 1,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <Typography variant="caption" noWrap sx={{ flex: 1, mr: 1 }}>
                  {item.title}
                </Typography>
                <Typography variant="caption" fontWeight="bold">
                  {formatNaira(item.price)}
                </Typography>
              </Box>
            ))}
          </Box>

          <Box display="flex" gap={1} mb={2}>
            <Button
              variant="contained"
              startIcon={<WhatsApp />}
              size="small"
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
              WhatsApp
            </Button>
            <Button
              variant="outlined"
              startIcon={<RateReview />}
              size="small"
              onClick={() => onReview(vendor)}
              sx={{ borderRadius: 2 }}
            >
              Review
            </Button>
          </Box>

          <Divider sx={{ mb: 1 }} />
          
          <Box>
            <Typography variant="caption" color="text.secondary">
              Recent review:
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.5 }}>
              {vendor.reviews?.[0] ? (
                <>
                  <strong>{vendor.reviews[0].name}</strong>: {vendor.reviews[0].text}
                </>
              ) : (
                <em>No reviews yet</em>
              )}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
}
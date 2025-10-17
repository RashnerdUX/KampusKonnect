import { Box, Typography } from '@mui/material';
import { Star } from '@mui/icons-material';

interface StarsProps {
  value?: number;
  size?: 'small' | 'medium' | 'large';
  showValue?: boolean;
}

export function Stars({ value = 0, size = 'small', showValue = true }: StarsProps) {
  const fullStars = Math.max(0, Math.min(5, Math.round(value)));
  const iconSize = size === 'small' ? 16 : size === 'medium' ? 20 : 24;

  return (
    <Box display="flex" alignItems="center" gap={0.5}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          sx={{
            fontSize: iconSize,
            color: i < fullStars ? 'gold' : 'grey.300',
          }}
        />
      ))}
      {showValue && (
        <Typography variant="caption" color="text.secondary" ml={0.5}>
          {Number(value).toFixed(1)}
        </Typography>
      )}
    </Box>
  );
}
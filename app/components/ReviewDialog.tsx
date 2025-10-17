import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Rating
} from '@mui/material';
import type { Vendor, ReviewFormData } from '~/types';

interface ReviewDialogProps {
  open: boolean;
  vendor: Vendor | null;
  onClose: () => void;
  onSubmit: (reviewData: ReviewFormData) => void;
}

export function ReviewDialog({ open, vendor, onClose, onSubmit }: ReviewDialogProps) {
  const [stars, setStars] = useState<number>(5);
  const [name, setName] = useState('');
  const [text, setText] = useState('');

  const handleSubmit = () => {
    if (!name.trim() || !text.trim()) return;
    
    onSubmit({ stars, name: name.trim(), text: text.trim() });
    
    // Reset form
    setStars(5);
    setName('');
    setText('');
    onClose();
  };

  const handleClose = () => {
    // Reset form when closing
    setStars(5);
    setName('');
    setText('');
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3 }
      }}
    >
      <DialogTitle>
        Review {vendor?.name}
      </DialogTitle>
      
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={3} pt={1}>
          <Box>
            <Typography variant="body2" color="text.secondary" mb={1}>
              Your rating:
            </Typography>
            <Rating
              name="vendor-rating"
              value={stars}
              onChange={(_, newValue) => {
                if (newValue !== null) {
                  setStars(newValue);
                }
              }}
              size="large"
            />
          </Box>

          <TextField
            label="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Amaka"
            fullWidth
            size="small"
          />

          <TextField
            label="Comment"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Quick feedback to help other students"
            multiline
            rows={3}
            fullWidth
            size="small"
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, pt: 0 }}>
        <Button onClick={handleClose} color="inherit">
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit}
          variant="contained"
          disabled={!name.trim() || !text.trim()}
          sx={{ borderRadius: 2 }}
        >
          Submit Review
        </Button>
      </DialogActions>
    </Dialog>
  );
}
import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import { Add } from '@mui/icons-material';
import type { VendorFormData, Category } from '~/types';

interface AddVendorDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (vendorData: VendorFormData) => void;
  universities: string[];
  categories: Category[];
}

export function AddVendorDialog({ 
  open, 
  onClose, 
  onSubmit, 
  universities, 
  categories 
}: AddVendorDialogProps) {
  const [formData, setFormData] = useState<VendorFormData>({
    name: '',
    university: '',
    category: 'food',
    whatsApp: '',
    cover: '',
    title: '',
    price: ''
  });

  const handleChange = (field: keyof VendorFormData) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleSubmit = () => {
    const { name, university, whatsApp, title, price } = formData;
    
    if (!name.trim() || !university || !whatsApp.trim() || !title.trim() || !price.trim()) {
      return;
    }
    
    onSubmit(formData);
    
    // Reset form
    setFormData({
      name: '',
      university: '',
      category: 'food',
      whatsApp: '',
      cover: '',
      title: '',
      price: ''
    });
    
    onClose();
  };

  const handleClose = () => {
    // Reset form when closing
    setFormData({
      name: '',
      university: '',
      category: 'food',
      whatsApp: '',
      cover: '',
      title: '',
      price: ''
    });
    onClose();
  };

  const isFormValid = !!(
    formData.name.trim() && 
    formData.university && 
    formData.whatsApp.trim() && 
    formData.title.trim() && 
    formData.price.trim()
  );

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
        <Box display="flex" alignItems="center" gap={1}>
          <Add />
          Create a new listing
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} pt={1}>
          <TextField
            label="Shop / Vendor name"
            value={formData.name}
            onChange={handleChange('name')}
            placeholder="e.g., Yaba Book Hub"
            fullWidth
            size="small"
            required
          />

          <FormControl fullWidth size="small" required>
            <InputLabel>University</InputLabel>
            <Select
              value={formData.university}
              label="University"
              onChange={handleChange('university')}
            >
              {universities.map((uni) => (
                <MenuItem key={uni} value={uni}>
                  {uni}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth size="small">
            <InputLabel>Category</InputLabel>
            <Select
              value={formData.category}
              label="Category"
              onChange={handleChange('category')}
            >
              {categories.map((category) => (
                <MenuItem key={category.key} value={category.key}>
                  {category.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Main item title"
            value={formData.title}
            onChange={handleChange('title')}
            placeholder="e.g., Discrete Maths Textbook"
            fullWidth
            size="small"
            required
          />

          <TextField
            label="Price (NGN)"
            value={formData.price}
            onChange={handleChange('price')}
            placeholder="e.g., 3500"
            type="number"
            fullWidth
            size="small"
            required
          />

          <TextField
            label="WhatsApp number"
            value={formData.whatsApp}
            onChange={handleChange('whatsApp')}
            placeholder="e.g., +2348012345678"
            fullWidth
            size="small"
            required
          />

          <TextField
            label="Cover image URL (optional)"
            value={formData.cover}
            onChange={handleChange('cover')}
            placeholder="https://..."
            fullWidth
            size="small"
          />

          <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
            💡 Tip: Use your business WhatsApp to receive student DMs instantly.
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, pt: 0 }}>
        <Button onClick={handleClose} color="inherit">
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit}
          variant="contained"
          disabled={!isFormValid}
          sx={{ borderRadius: 2 }}
        >
          Save Listing
        </Button>
      </DialogActions>
    </Dialog>
  );
}
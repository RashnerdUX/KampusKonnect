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
import { Login, Phone } from '@mui/icons-material';
import type { AuthFormData } from '~/types';

interface AuthDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (authData: AuthFormData) => void;
  universities: string[];
}

export function AuthDialog({ 
  open, 
  onClose, 
  onSubmit, 
  universities 
}: AuthDialogProps) {
  const [formData, setFormData] = useState<AuthFormData>({
    name: '',
    university: '',
    role: 'student',
    phone: ''
  });

  const handleChange = (field: keyof AuthFormData) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleSubmit = () => {
    const { name, university, phone } = formData;
    
    if (!name.trim() || !university || !phone.trim()) {
      return;
    }
    
    onSubmit(formData);
    
    // Reset form
    setFormData({
      name: '',
      university: '',
      role: 'student',
      phone: ''
    });
    
    onClose();
  };

  const handleClose = () => {
    // Reset form when closing
    setFormData({
      name: '',
      university: '',
      role: 'student',
      phone: ''
    });
    onClose();
  };

  const isFormValid = !!(
    formData.name.trim() && 
    formData.university && 
    formData.phone.trim()
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
          <Login />
          Create account
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} pt={1}>
          <TextField
            label="Full name"
            value={formData.name}
            onChange={handleChange('name')}
            placeholder="e.g., Adewale Musa"
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
            <InputLabel>Role</InputLabel>
            <Select
              value={formData.role}
              label="Role"
              onChange={handleChange('role')}
            >
              <MenuItem value="student">Student</MenuItem>
              <MenuItem value="vendor">Vendor</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="WhatsApp number"
            value={formData.phone}
            onChange={handleChange('phone')}
            placeholder="e.g., +23480xxxxxxx"
            fullWidth
            size="small"
            required
          />

          <Box display="flex" alignItems="center" gap={1} mt={1}>
            <Phone fontSize="small" color="action" />
            <Typography variant="caption" color="text.secondary">
              We use your number only for WhatsApp connect.
            </Typography>
          </Box>
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
          Continue
        </Button>
      </DialogActions>
    </Dialog>
  );
}
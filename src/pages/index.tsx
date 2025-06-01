// Project: Delete My Data
// Description: A React component for a personal data opt-out tool that opens multiple opt-out sites in new tabs.

import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Paper,
  Snackbar,
  TextField,
  Typography,
} from '@mui/material';
import MuiAlert, { AlertColor } from '@mui/material/Alert';
import DeleteIcon from '@mui/icons-material/Delete';
import { useEffect, useState } from 'react';

const defaultSites = [
  { name: 'Spokeo', url: 'https://www.spokeo.com/opt_out' },
  { name: 'FastPeopleSearch', url: 'https://www.fastpeoplesearch.com/removal' },
  { name: 'BeenVerified', url: 'https://www.beenverified.com/app/optout/search' },
  { name: 'Whitepages', url: 'https://www.whitepages.com/suppression-requests' },
  { name: 'Radaris', url: 'https://radaris.com/control/privacy' },
  { name: 'ZabaSearch', url: 'https://www.zabasearch.com/block_records/' },
  { name: 'ThatsThem', url: 'https://thatsthem.com/optout' },
];

const Alert = MuiAlert as React.ElementType;

export default function Home() {
  const [formData, setFormData] = useState({ name: '', email: '', city: '', state: '' });
  const [customSites, setCustomSites] = useState<{ name: string; url: string }[]>([]);
  const [newSite, setNewSite] = useState({ name: '', url: '' });
  const [results, setResults] = useState<{ site: string; status: string; url?: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastSeverity, setToastSeverity] = useState<AlertColor>('success');
  const [toastMessage, setToastMessage] = useState('');

  // Load custom sites from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('customSites');
    if (stored) {
      setCustomSites(JSON.parse(stored));
    }
  }, []);

  // Save custom sites to localStorage
  useEffect(() => {
    localStorage.setItem('customSites', JSON.stringify(customSites));
  }, [customSites]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleAddSite = () => {
    if (!newSite.name || !newSite.url) return;
    setCustomSites([...customSites, { ...newSite }]);
    setNewSite({ name: '', url: '' });
  };

  const handleRemoveSite = (index: number) => {
    const updated = [...customSites];
    updated.splice(index, 1);
    setCustomSites(updated);
  };

  const handleSubmit = () => {
    setLoading(true);
    setToastMessage('Opening opt-out sites...');
    setToastSeverity('info');
    setToastOpen(true);

    const allSites = [...defaultSites, ...customSites];
    const opened = allSites.map((site, index) => {
      setTimeout(() => {
        window.open(site.url, '_blank');
      }, index * 500);
      return { site: site.name, status: 'manual', url: site.url };
    });

    setTimeout(() => {
      setResults(opened);
      setLoading(false);
    }, allSites.length * 500 + 500);
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* LEFT PANEL */}
      <Box
        sx={{
          flex: 1,
          bgcolor: '#f8f9fb',
          p: 6,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <Box maxWidth="500px">
          <Typography variant="h3" fontWeight={700} gutterBottom>
            Delete My Data.
          </Typography>
          <Typography variant="h6" gutterBottom>
            Remove your personal information from public people search websites all at once.
          </Typography>

          <Box mt={3}>
            <Typography color="text.secondary" sx={{ mb: 1 }}>
              📋 We open opt-out forms for you
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 1 }}>
              🤖 You complete CAPTCHA and submit
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 1 }}>
              🧠 You can add your own opt-out sites
            </Typography>
          </Box>

          <Typography variant="h6" sx={{ mt: 4 }} gutterBottom>
            How to Use:
          </Typography>
          <Typography color="text.secondary">
            1. Fill out the form<br />
            2. Tabs will open automatically<br />
            3. Submit each form manually
          </Typography>

          <Typography variant="h6" sx={{ mt: 4 }} gutterBottom>
            Supported Sites:
          </Typography>
          <ul>
            {defaultSites.map((site) => (
              <li key={site.name}>
                <Typography color="text.secondary">{site.name}</Typography>
              </li>
            ))}
          </ul>
        </Box>
      </Box>

      {/* RIGHT PANEL */}
      <Box
        sx={{
          flex: 1,
          bgcolor: '#fff',
          p: 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box width="100%" maxWidth="500px">
          <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
            <Typography variant="h5" fontWeight={600} gutterBottom>
              Opt-Out Form
            </Typography>

            {/* Form Inputs */}
            <TextField fullWidth label="Full Name" name="name" onChange={handleChange} margin="normal" />
            <TextField fullWidth label="Email" name="email" onChange={handleChange} margin="normal" />
            <TextField fullWidth label="City" name="city" onChange={handleChange} margin="normal" />
            <TextField fullWidth label="State" name="state" onChange={handleChange} margin="normal" />

            {/* Custom Site Inputs */}
            <Box mt={3}>
              <Typography variant="h6">Add Your Own Opt-Out Site</Typography>
              <TextField
                fullWidth
                label="Site Name"
                value={newSite.name}
                onChange={(e) => setNewSite({ ...newSite, name: e.target.value })}
                margin="dense"
              />
              <TextField
                fullWidth
                label="Opt-Out URL"
                value={newSite.url}
                onChange={(e) => setNewSite({ ...newSite, url: e.target.value })}
                margin="dense"
              />
              <Button onClick={handleAddSite} variant="outlined" sx={{ mt: 1 }}>
                ➕ Add Site
              </Button>

              {/* Custom Site List */}
              {customSites.length > 0 && (
                <Box mt={2}>
                  {customSites.map((site, index) => (
                    <Box
                      key={index}
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                      sx={{ bgcolor: '#f1f1f1', px: 2, py: 1, borderRadius: 1, mb: 1 }}
                    >
                      <Typography fontSize="0.9rem">{site.name}</Typography>
                      <IconButton size="small" onClick={() => handleRemoveSite(index)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>

            {/* Submit */}
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 3 }}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? 'Opening Sites...' : 'Submit Opt-Out'}
            </Button>

            {loading && (
              <Box mt={4} textAlign="center">
                <CircularProgress />
                <Typography mt={1} color="text.secondary">
                  Opening sites... Complete CAPTCHAs to finish.
                </Typography>
              </Box>
            )}

            {/* Results */}
            {results.length > 0 && (
              <Box mt={4}>
                <Typography variant="h6">Results</Typography>
                {results.map((r, i) => (
                  <Box key={i} sx={{ bgcolor: '#f5f5f5', p: 2, borderRadius: 2, mt: 1 }}>
                    <Typography><strong>{r.site}</strong></Typography>
                    <Typography color="warning.main">
                      🔗 Visit:{' '}
                      <a href={r.url} target="_blank" rel="noreferrer">
                        {r.url}
                      </a>
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}
          </Paper>
        </Box>
      </Box>

      {/* Toast */}
      <Snackbar
        open={toastOpen}
        autoHideDuration={4000}
        onClose={() => setToastOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setToastOpen(false)} severity={toastSeverity} sx={{ width: '100%' }}>
          {toastMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}


import { Box, Button, CircularProgress, Paper, Snackbar, TextField, Typography } from '@mui/material';
import MuiAlert, { AlertColor } from '@mui/material/Alert';
import { useState } from 'react';

const supportedSites = [
  'Spokeo',
  'FastPeopleSearch',
  'BeenVerified',
  'Whitepages',
  'Radaris',
  'ZabaSearch',
  'ThatsThem',
];

const siteUrls: Record<string, string> = {
  Spokeo: 'https://www.spokeo.com/opt_out',
  FastPeopleSearch: 'https://www.fastpeoplesearch.com/removal',
  BeenVerified: 'https://www.beenverified.com/app/optout/search',
  Whitepages: 'https://www.whitepages.com/suppression-requests',
  Radaris: 'https://radaris.com/control/privacy',
  ZabaSearch: 'https://www.zabasearch.com/block_records/',
  ThatsThem: 'https://thatsthem.com/optout',
};

const siteNotes: Record<string, string> = {
  FastPeopleSearch: '🔗 You’ll need to paste your profile URL from a prior search.',
  BeenVerified: '🔗 Search yourself first, copy the result link, and paste it.',
  Whitepages: '🔗 Find and copy your profile link before submitting the form.',
  ZabaSearch: '🔗 You must verify your identity via email during opt-out.',
  ThatsThem: '🔗 No account required. Search and follow the form.',
};

// Improved search helper link
const getSearchLink = (site: string, name: string, city: string, state: string) => {
  const slugName = name.trim().replace(/\s+/g, '-');
  const slugCity = city.trim().replace(/\s+/g, '-');
  const slugState = state.trim();

  switch (site) {
    case 'FastPeopleSearch':
      return `https://www.fastpeoplesearch.com/name/${slugName}_${slugCity.toLowerCase()}-${slugState.toLowerCase()}`;
    case 'Whitepages':
      return `https://www.whitepages.com/name/${slugState}/${slugCity}/${slugName}`;
    case 'Radaris':
      return `https://radaris.com/p/${slugName}/${slugState}`;
    case 'ZabaSearch':
      return `https://www.zabasearch.com/people/${slugName}/${slugState}`;
    case 'ThatsThem':
      return `https://thatsthem.com/name/${slugName.toLowerCase()}?city=${slugCity.toLowerCase()}&state=${slugState.toLowerCase()}`;
    default:
      return '';
  }
};

const Alert = MuiAlert as React.ElementType;

export default function Home() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    city: '',
    state: '',
  });

  const [results, setResults] = useState<
    { site: string; status: string; message?: string; url?: string }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastSeverity, setToastSeverity] = useState<AlertColor>('success');
  const [toastMessage, setToastMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    setLoading(true);
    setResults([]);
    setToastMessage('Opening opt-out sites... Please complete CAPTCHAs manually.');
    setToastSeverity('info');
    setToastOpen(true);

    const filledSites = supportedSites.map((site, index) => {
      const url = siteUrls[site];
      if (url) {
        setTimeout(() => {
          window.open(url, '_blank');
        }, index * 500);
      }

      return {
        site,
        status: 'manual',
        url,
      };
    });

    setTimeout(() => {
      setResults(filledSites);
      setLoading(false);
    }, supportedSites.length * 500 + 500);
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
              📋 We open the forms for you
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 1 }}>
              🤖 You complete the CAPTCHA and submit
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 1 }}>
              🔒 We don’t store any personal information
            </Typography>
          </Box>

          <Typography variant="h6" sx={{ mt: 4 }} gutterBottom>
            How to Use:
          </Typography>
          <Typography color="text.secondary">
            1. Fill out the form on the right<br />
            2. Tabs will open with opt-out pages<br />
            3. Complete the CAPTCHA and submit for each site
          </Typography>

          <Typography variant="h6" sx={{ mt: 4 }} gutterBottom>
            Supported Sites:
          </Typography>
          <ul>
            {supportedSites.map((site) => (
              <li key={site}>
                <Typography color="text.secondary">{site}</Typography>
              </li>
            ))}
          </ul>
        </Box>
      </Box>

      {/* RIGHT PANEL - FORM */}
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
        <Box width="100%" maxWidth="400px">
          <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
            <Typography variant="h5" fontWeight={600} gutterBottom>
              Opt-Out Form
            </Typography>
            <TextField fullWidth label="Full Name" name="name" onChange={handleChange} margin="normal" />
            <TextField fullWidth label="Email" name="email" onChange={handleChange} margin="normal" />
            <TextField fullWidth label="City" name="city" onChange={handleChange} margin="normal" />
            <TextField fullWidth label="State" name="state" onChange={handleChange} margin="normal" />
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? 'Opening Sites...' : 'Submit Opt-Out'}
            </Button>

            {loading && (
              <Box mt={4} display="flex" flexDirection="column" alignItems="center">
                <CircularProgress thickness={4} size={48} />
                <Typography mt={2} color="text.secondary" textAlign="center">
                  Opening opt-out sites...<br />
                  Please complete CAPTCHAs manually.
                </Typography>
              </Box>
            )}

            {results.length > 0 && (
              <Box mt={4}>
                <Typography variant="h6" gutterBottom>
                  Results
                </Typography>
                {results.map((r, index) => (
                  <Box key={index} sx={{ mb: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
                    <Typography><strong>Site:</strong> {r.site}</Typography>
                    <Typography color="warning.main">
                      ⚠️ Manual opt-out required. Visit:{' '}
                      <a href={r.url} target="_blank" rel="noreferrer">{r.url}</a>
                    </Typography>
                    {siteNotes[r.site] && (
                      <Typography color="text.secondary" sx={{ fontStyle: 'italic', mt: 1 }}>
                        📌 {siteNotes[r.site]}
                      </Typography>
                    )}
                    {/* Search helper button */}
                    {formData.name && formData.city && formData.state && getSearchLink(r.site, formData.name, formData.city, formData.state) && (
                      <>
                        <Button
                          variant="outlined"
                          color="primary"
                          size="small"
                          sx={{ mt: 1 }}
                          href={getSearchLink(r.site, formData.name, formData.city, formData.state)}
                          target="_blank"
                        >
                          🔍 Search Yourself
                        </Button>
                        <Typography color="text.secondary" fontSize="0.8rem" sx={{ mt: 0.5 }}>
                          🏠 You may need to enter your full address once on the site.
                        </Typography>
                      </>
                    )}
                  </Box>
                ))}
              </Box>
            )}
          </Paper>
        </Box>
      </Box>

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

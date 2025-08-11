import React, { useState } from "react";
import {
  Paper, Typography, Box, Button, Grid, TextField, IconButton
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import Log from "../utils/Log";
import { isValidUrl, isPositiveInteger, isValidShortcode } from "../utils/validation";

const defaultForm = { url: "", validity: "", shortcode: "" };

export default function ShortenUrlForm({ onShorten }) {
  const [forms, setForms] = useState([{ ...defaultForm }]);
  const [errors, setErrors] = useState([{}]);
  const maxUrls = 5;

  const handleChange = (idx, field, value) => {
    const updated = [...forms];
    updated[idx][field] = value;
    setForms(updated);

    // Validation on-the-fly
    validateField(idx, field, value, updated);
  };

  const validateField = (idx, field, value, updatedForms = forms) => {
    const newErrors = [...errors];
    let error = "";

    if (field === "url" && value) {
      if (!isValidUrl(value))
        error = "Invalid URL format (must be http[s]/ftp)";
    }
    if (field === "validity" && value) {
      if (!isPositiveInteger(value)) error = "Enter positive integer minutes";
    }
    if (field === "shortcode" && value) {
      if (!isValidShortcode(value)) error = "Alphanumeric, 4-10 chars";
    }

    newErrors[idx] = { ...newErrors[idx], [field]: error };
    setErrors(newErrors);
  };

  const validateAll = () => {
    const newErrors = forms.map((f) => ({
      url: !f.url ? "Required" : !isValidUrl(f.url) ? "Invalid URL" : "",
      validity: f.validity && !isPositiveInteger(f.validity) ? "Positive integer" : "",
      shortcode: f.shortcode && !isValidShortcode(f.shortcode)
        ? "Alphanumeric, 4-10 chars"
        : ""
    }));
    setErrors(newErrors);
    // If any field has an error, we invalidate
    return newErrors.every((e) => !e.url && !e.validity && !e.shortcode);
  };

  const handleAdd = () => {
    setForms([...forms, { ...defaultForm }]);
    setErrors([...errors, {}]);
  };

  const handleRemove = (idx) => {
    setForms(forms.filter((_, i) => i !== idx));
    setErrors(errors.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateAll()) {
      Log("frontend", "error", "ShortenUrlForm", "Client-side validation failed");
      return; // do not submit
    }
    // Prepare data
    const shortRequests = forms.map(({ url, validity, shortcode }) => ({
      url,
      validity: validity ? Number(validity) : undefined,
      shortcode: shortcode ? shortcode : undefined,
    }));
    Log("frontend", "info", "ShortenUrlForm", "Submitting URL shortening request(s)");
    await onShorten(shortRequests);
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h5" mb={2}>Create Short Links</Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {forms.map((form, idx) => (
            <React.Fragment key={idx}>
              <Grid item xs={12} sm={5}>
                <TextField
                  required
                  label="Long URL"
                  value={form.url}
                  fullWidth
                  error={Boolean(errors[idx]?.url)}
                  helperText={errors[idx]?.url}
                  onChange={(e) => handleChange(idx, "url", e.target.value)}
                />
              </Grid>
              <Grid item xs={4} sm={2}>
                <TextField
                  label="Validity (min.)"
                  value={form.validity}
                  fullWidth
                  error={Boolean(errors[idx]?.validity)}
                  helperText={errors[idx]?.validity}
                  onChange={(e) => handleChange(idx, "validity", e.target.value.replace(/[^0-9]/g, ""))}
                  placeholder="(default 30)"
                />
              </Grid>
              <Grid item xs={4} sm={3}>
                <TextField
                  label="Custom Shortcode"
                  value={form.shortcode}
                  fullWidth
                  error={Boolean(errors[idx]?.shortcode)}
                  helperText={errors[idx]?.shortcode}
                  onChange={(e) => handleChange(idx, "shortcode", e.target.value)}
                  placeholder="(optional)"
                  inputProps={{ maxLength: 10 }}
                />
              </Grid>
              <Grid item xs={4} sm={2} sx={{ display: "flex", alignItems: "center" }}>
                <IconButton
                  disabled={forms.length <= 1}
                  color="error"
                  onClick={() => handleRemove(idx)}
                >
                  <RemoveIcon />
                </IconButton>
                <IconButton
                  disabled={forms.length >= maxUrls || idx !== forms.length - 1}
                  color="primary"
                  onClick={handleAdd}
                >
                  <AddIcon />
                </IconButton>
              </Grid>
            </React.Fragment>
          ))}
          <Grid item xs={12}>
            <Box textAlign="right">
              <Button type="submit" variant="contained" color="primary">
                Shorten URL{forms.length > 1 ? "s" : ""}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
}

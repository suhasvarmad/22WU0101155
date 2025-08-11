import React, { useState } from "react";
import {
  Paper, Typography, Box, TextField, Button, Table, TableHead, TableRow,
  TableCell, TableBody, Collapse, IconButton, TableContainer
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import Log from "../utils/Log";

const API_BASE = "http://localhost:3001";

export default function StatisticsPage() {
  const [shortcode, setShortcode] = useState("");
  const [data, setData] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function fetchStats() {
    if (!shortcode) return;
    setLoading(true); setError(""); setData(null);
    try {
      const resp = await fetch(`${API_BASE}/shorturls/${shortcode}`);
      const json = await resp.json();
      if (resp.ok) {
        Log("frontend", "info", "StatisticsPage", `Loaded stats for ${shortcode}`);
        setData(json);
      } else {
        Log("frontend", "warn", "StatisticsPage", `Failed to fetch stats: ${json.error}`);
        setError(json.error || "Unknown error");
      }
    } catch (e) {
      Log("frontend", "error", "StatisticsPage", "Network error: " + e.message);
      setError("Network error: " + e.message);
    } finally {
      setLoading(false);
    }
  }

  const handleExpand = () => setExpanded((v) => !v);

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>Shortlink Statistics</Typography>
      <Box mb={2} component="form"
           onSubmit={(e) => { e.preventDefault(); fetchStats(); }}>
        <TextField
          label="Shortcode"
          value={shortcode}
          onChange={e => setShortcode(e.target.value)}
          size="small"
          sx={{ mr: 2, width: 200 }}
          required
        />
        <Button
          variant="contained"
          color="primary"
          startIcon={<SearchIcon />}
          onClick={fetchStats}
          disabled={loading}
        >
          Find
        </Button>
      </Box>
      {loading && <Typography>Loading...</Typography>}
      {error && <Typography color="error">{error}</Typography>}
      {data &&
        <Box>
          <Typography><b>Original URL:</b> <span style={{ wordBreak: "break-all" }}>{data.originalUrl}</span></Typography>
          <Typography><b>Shortlink:</b> {data.shortlink}</Typography>
          <Typography><b>Created:</b> {new Date(data.creationDate).toLocaleString()}</Typography>
          <Typography><b>Expiry:</b> {new Date(data.expiryDate).toLocaleString()}</Typography>
          <Typography><b>Total Clicks:</b> {data.totalClicks}</Typography>
          <IconButton size="small" onClick={handleExpand}>
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
          <Typography fontWeight={600} component="span">Click Data</Typography>
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <TableContainer sx={{ maxHeight: 350 }}>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Timestamp</TableCell>
                    <TableCell>Source</TableCell>
                    <TableCell>Client Location (IP)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.clickDetails.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={3}><i>No clicks recorded.</i></TableCell>
                    </TableRow>
                  )}
                  {data.clickDetails.map((c, j) => (
                    <TableRow key={j}>
                      <TableCell>{new Date(c.timestamp).toLocaleString()}</TableCell>
                      <TableCell>{c.source}</TableCell>
                      <TableCell>{c.location}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Collapse>
        </Box>
      }
    </Paper>
  );
}

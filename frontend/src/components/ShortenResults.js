import React from "react";
import {
  Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  CircularProgress, Link
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

function copyToClipboard(txt) {
  navigator.clipboard?.writeText(txt);
}

export default function ShortenResults({ results, loadingIndexes }) {
  if (loadingIndexes.length)
    return (
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography>Creating short links...</Typography>
        <CircularProgress />
      </Paper>
    );
  if (!results.length) return null;
  return (
    <TableContainer component={Paper} sx={{ mt: 2, mb: 3 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Long URL</TableCell>
            <TableCell>Shortlink</TableCell>
            <TableCell>Expiry</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {results.map((r, idx) => (
            <TableRow key={idx}>
              <TableCell>
                <Typography variant="body2" sx={{ wordBreak: "break-all" }}>{r.url}</Typography>
              </TableCell>
              <TableCell>
                {r.result ? (
                  <span>
                    <Link href={r.result} target="_blank" rel="noopener">{r.result}</Link>
                    <ContentCopyIcon
                      onClick={() => copyToClipboard(r.result)}
                      sx={{ ml: 1, cursor: "pointer", fontSize: 20 }}
                      titleAccess="Copy"
                    />
                  </span>
                ) : "-"}
              </TableCell>
              <TableCell>
                {r.expiry ? new Date(r.expiry).toLocaleString() : "-"}
              </TableCell>
              <TableCell>
                {r.error ? <Typography color="error">{r.error}</Typography> : "OK"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { Link, useLocation } from "react-router-dom";

export default function NavBar() {
  const location = useLocation();
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flex: 1 }}>
          Corporate URL Shortener
        </Typography>
        <Button
          component={Link}
          to="/"
          color={location.pathname === "/" ? "secondary" : "inherit"}
          variant={location.pathname === "/" ? "contained" : "text"}
        >
          Shortener
        </Button>
        <Button
          component={Link}
          to="/stats"
          color={location.pathname === "/stats" ? "secondary" : "inherit"}
          variant={location.pathname === "/stats" ? "contained" : "text"}
        >
          Statistics
        </Button>
      </Toolbar>
    </AppBar>
  );
}

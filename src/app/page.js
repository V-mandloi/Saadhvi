import { Button, Typography, Container, Box } from "@mui/material";

export default function Home() {
  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
          Material-UI with Geist Font
        </Typography>
        <Typography sx={{ mb: 2 }}>
          This button is a Material-UI component, but it's using the Geist Sans
          font you defined in the layout!
        </Typography>
        <Button variant="contained">Click Me</Button>

        <Typography sx={{ mt: 4, fontFamily: "var(--font-geist-mono)" }}>
          And this line uses the Geist Mono font via its CSS variable.
        </Typography>
      </Box>
    </Container>
  );
}

import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Heading from "../components/heading/heading";

function App() {
  return (
    <>
      <Container sx={{ height: "100vh" }}>
        <Grid
          container
          spacing={2}
          sx={{
            height: "98%",
            width: "100%",
          }}
        >
          <Grid size={12} sx={{ border: "none", height: "10vh" }}>
            <Heading level={"h1"} text={"Main Title"}></Heading>
          </Grid>
          <Grid size={6} sx={{ borderLeft: "none", height: "30vh" }}>
            Lalalala
          </Grid>
          <Grid size={6} sx={{ borderRight: "none", height: "30vh" }}>
            Lalalala
          </Grid>
          <Grid
            size={12}
            sx={{ borderLeft: "none", borderRight: "none", height: "10vh" }}
          >
            Lalalala
          </Grid>
          <Grid
            size={5}
            sx={{ borderLeft: "none", borderBottom: "none", height: "40vh" }}
          >
            Lalalala
          </Grid>
          <Grid size={2} sx={{ borderBottom: "none", height: "40vh" }}>
            Lalalala
          </Grid>
          <Grid
            size={5}
            sx={{ borderBottom: "none", borderRight: "none", height: "40vh" }}
          >
            Lalalala
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

export default App;

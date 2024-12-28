import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
  Link as MuiLink,
  Stack,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { ProjectSetting } from "../../../config/ProjectSetting";

export default function BusinessStateCityList() {
  const [stateCityData, setStateCityData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStateCityData = async () => {
      try {
        const response = await fetch(
          `${ProjectSetting}/Website/getStateCityList`
        );
        const data = await response.json();
        if (data.status === "success") {
          setStateCityData(data.data);
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error("Error fetching state-city data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStateCityData();
  }, []);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        padding: "20px",
        backgroundColor: "#f9f9f9",
        minHeight: "100vh",
      }}
    >
      <Typography
        variant="h6"
        align="center"
        gutterBottom
        sx={{ fontWeight: "bold", marginBottom: 3 }}
      >
        State and City List
      </Typography>
      {stateCityData.map((state) => (
        <Accordion key={state.id} sx={{ marginBottom: 1 }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{ padding: "8px 16px" }}
          >
            <Typography
              variant="body1"
              sx={{ fontWeight: "bold", fontSize: "14px" }}
            >
              {state.state_name}
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ padding: "8px 16px" }}>
            <Stack
              direction="row"
              spacing={1}
              flexWrap="wrap"
              sx={{ gap: "10px", marginTop: "8px" }}
            >
              {state.cities.map((city) => (
                <MuiLink
                  key={city.id}
                  href={`/cities/${city.city_slug}`}
                  underline="hover"
                  sx={{
                    fontSize: "12px",
                    color: "primary.main",
                    padding: "4px 8px",
                    border: "1px solid",
                    borderColor: "primary.main",
                    borderRadius: "16px",
                    textDecoration: "none",
                    "&:hover": {
                      backgroundColor: "primary.main",
                      color: "#fff",
                    },
                  }}
                >
                  {city.city_name}
                </MuiLink>
              ))}
            </Stack>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
}

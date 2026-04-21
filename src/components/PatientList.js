import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography
} from "@mui/material";
import { useEffect, useState } from "react";
import { connectSocket, subscribeTopic } from "../services/socket";
import Vitals from "./Vitals";

export default function PatientList() {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);

  useEffect(() => {

    // 🔥 connect once
    connectSocket((client) => {

      // subscribe to patient updates
      subscribeTopic("/topic/patients", (data) => {
        setPatients(data);
      });

    });

  }, []);

  return (
    <Grid container sx={{ height: "100%" }}>

      {/* LEFT PANEL */}
      <Grid item xs={12} md={4}>
        <Box
          sx={{
            height: "100%",
            overflowY: "scroll",
            maxHeight: "100%",
            p: 2,

            "&::-webkit-scrollbar": { display: "none" },
            scrollbarWidth: "none"
          }}
        >
          <Typography variant="h6" mb={2}>
            Patients
          </Typography>

          {patients.map((p) => {
            const isSelected = selectedPatient?.id === p.id;

            return (
              <Card
                key={p.id}
                onClick={() => setSelectedPatient(p)}
                sx={{
                  mb: 2,
                  cursor: "pointer",
                  borderRadius: "16px",
                  transition: "all 0.3s ease",
                  backdropFilter: "blur(10px)",
                  background: isSelected
                    ? "linear-gradient(135deg, #1976d2, #42a5f5)"
                    : "rgba(255,255,255,0.6)",
                  color: isSelected ? "#fff" : "#000",
                  boxShadow: isSelected
                    ? "0 10px 25px rgba(25,118,210,0.4)"
                    : "0 4px 15px rgba(0,0,0,0.05)",

                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
                  }
                }}
              >
                <CardContent>
                  <Typography variant="subtitle1" fontWeight="bold">
                    👤 {p.name}
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{ opacity: isSelected ? 0.9 : 0.6 }}
                  >
                    {p.disease}
                  </Typography>
                </CardContent>
              </Card>
            );
          })}
        </Box>
      </Grid>

      {/* RIGHT PANEL */}
      <Grid item xs={12} md={8}>
        <Box
          sx={{
            height: "100%",
            p: 3,
            overflowY: "scroll",
            maxHeight: "100%",

            "&::-webkit-scrollbar": { display: "none" },
            scrollbarWidth: "none"
          }}
        >
          <Vitals patient={selectedPatient} />
        </Box>
      </Grid>

    </Grid>
  );
}
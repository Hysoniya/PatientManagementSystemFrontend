import { Box, List, ListItem, ListItemText, Typography } from "@mui/material";
import { useState } from "react";
import AddPatient from "./components/AddPatient";
import CriticalPatients from "./components/CriticalPatients";
import PatientList from "./components/PatientList";

function App() {
  const [view, setView] = useState("patients");

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        background: "linear-gradient(135deg, #eef2f3, #dfe9f3)"
      }}
    >
      {/* SIDEBAR */}
      <Box
        sx={{
          width: "250px",
          background: "rgba(255,255,255,0.6)",
          backdropFilter: "blur(10px)",
          borderRight: "1px solid rgba(255,255,255,0.3)",
          p: 2
        }}
      >
        <Typography variant="h6" mb={2}>
          🏥 Dashboard
        </Typography>

        <List>
          <ListItem
            button
            onClick={() => setView("patients")}
            sx={{
              borderRadius: "10px",
              mb: 1,
              background:
                view === "patients"
                  ? "linear-gradient(135deg, #1976d2, #42a5f5)"
                  : "transparent",
              color: view === "patients" ? "#fff" : "#000"
            }}
          >
            <ListItemText primary="Patients" />
          </ListItem>

          <ListItem
            button
            onClick={() => setView("critical")}
            sx={{
              borderRadius: "10px",
              mb: 1,
              background:
                view === "critical"
                  ? "linear-gradient(135deg, #ff4d4f, #ff7875)"
                  : "transparent",
              color: view === "critical" ? "#fff" : "#000"
            }}
          >
            <ListItemText primary="Critical Alerts" />
          </ListItem>
        </List>
      </Box>

      {/* MAIN CONTENT */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column"
        }}
      >
        {/* HEADER */}
        <Box
          sx={{
            height: "60px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(255,255,255,0.6)",
            backdropFilter: "blur(10px)",
            fontWeight: "bold"
          }}
        >
          {view === "patients"
            ? "Patient Monitoring"
            : "Critical Alerts Dashboard"}
        </Box>

        {/* CONTENT */}
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            p: 2,

            "&::-webkit-scrollbar": { display: "none" },
            scrollbarWidth: "none"
          }}
        >
          {view === "patients" && (
            <>
              <Box sx={{ mb: 2 }}>
                <AddPatient />
              </Box>
              <PatientList />
            </>
          )}

          {view === "critical" && <CriticalPatients />}
        </Box>
      </Box>
    </Box>
  );
}

export default App;
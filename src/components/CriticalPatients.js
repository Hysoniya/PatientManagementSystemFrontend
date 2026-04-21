import { Box, Card, CardContent, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { connectSocket, subscribeTopic } from "../services/socket";

export default function CriticalPatients() {
  const [critical, setCritical] = useState([]);
  const [patientsMap, setPatientsMap] = useState({});

  useEffect(() => {

    connectSocket(() => {

      // 🔥 receive patient list
      subscribeTopic("/topic/patients", (patients) => {
        const map = {};
        patients.forEach((p) => {
          map[p.id] = p.name;
        });
        setPatientsMap(map);
      });

      // 🔥 receive critical alerts
      subscribeTopic("/topic/critical", (data) => {
        setCritical(data);
      });

    });

  }, []);

  // 🎨 severity color
  const getSeverityColor = (v) => {
    if (v.heartRate > 140 || v.temperature > 104) return "#ff1a1a";
    if (v.heartRate > 120 || v.temperature > 102) return "#ff4d4f";
    return "#faad14";
  };

  return (
    <Box
      sx={{
        height: "300px",
        overflowY: "auto",
        "&::-webkit-scrollbar": { display: "none" },
        scrollbarWidth: "none"
      }}
    >
      <Typography variant="h6" mb={2} color="error">
        🚨 Critical Alerts
      </Typography>

      {critical.length === 0 && (
        <Typography sx={{ opacity: 0.6 }}>
          No critical patients
        </Typography>
      )}

      {critical.map((c) => {
        const color = getSeverityColor(c);

        return (
          <Card
            key={c.id}
            sx={{
              mb: 2,
              borderRadius: "14px",
              backdropFilter: "blur(10px)",
              background: "rgba(255,255,255,0.6)",
              borderLeft: `6px solid ${color}`,
              boxShadow: `0 6px 20px ${color}30`,
              transition: "0.3s",

              "&:hover": {
                transform: "translateY(-3px)",
                boxShadow: `0 10px 30px ${color}50`
              }
            }}
          >
            <CardContent>
              <Typography fontWeight="bold">
                👤 {patientsMap[c.patientId] || "Unknown"} (ID: {c.patientId})
              </Typography>

              <Typography variant="body2" sx={{ mt: 1 }}>
                ❤️ HR: {c.heartRate} &nbsp; | &nbsp;
                🌡 Temp: {c.temperature.toFixed(2)}
              </Typography>

              <Typography
                variant="caption"
                sx={{ color: color, fontWeight: "bold" }}
              >
                {color === "#ff1a1a"
                  ? "Severe"
                  : color === "#ff4d4f"
                  ? "Critical"
                  : "Warning"}
              </Typography>
            </CardContent>
          </Card>
        );
      })}
    </Box>
  );
}
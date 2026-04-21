import {
    Box,
    Card,
    CardContent,
    Grid,
    Typography
} from "@mui/material";
import { useEffect, useState } from "react";
import {
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from "recharts";
import { connectSocket, subscribeTopic } from "../services/socket";

export default function Vitals({ patient }) {
  const [vitals, setVitals] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (!patient) return;

    connectSocket(() => {

      subscribeTopic("/topic/vitals", (data) => {

        // only update selected patient
        if (data.patientId !== patient.id) return;

        setVitals(data);

        setHistory((prev) => {
          const updated = [
            ...prev,
            {
              time: new Date().toLocaleTimeString(),
              hr: data.heartRate,
              temp: data.temperature
            }
          ];
          return updated.slice(-12);
        });

      });

    });

  }, [patient]);

  if (!patient) {
    return (
      <Box
        sx={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: 0.6
        }}
      >
        <Typography>Select a patient to view vitals</Typography>
      </Box>
    );
  }

  if (!vitals) {
    return <Typography>Waiting for live data...</Typography>;
  }

  // 🎨 Color logic
  const getColor = (value, type) => {
    if (type === "hr") {
      if (value > 120) return "#ff4d4f";
      if (value > 90) return "#faad14";
      return "#52c41a";
    }
    if (type === "temp") {
      if (value > 102) return "#ff4d4f";
      if (value > 99) return "#faad14";
      return "#52c41a";
    }
    return "#52c41a";
  };

  const isCritical =
    vitals.heartRate > 120 || vitals.temperature > 102;

  return (
    <Box sx={{ height: "100%" }}>
      {/* HEADER */}
      <Typography variant="h5" mb={2}>
        {patient.name}'s Vitals
      </Typography>

      {/* VITAL CARDS */}
      <Grid container spacing={2}>

        <Grid item xs={12} sm={4}>
          <Card
            sx={{
              borderRadius: "16px",
              backdropFilter: "blur(10px)",
              background: "rgba(255,255,255,0.6)",
              borderTop: `4px solid ${getColor(vitals.heartRate, "hr")}`,
              boxShadow: "0 8px 25px rgba(0,0,0,0.08)"
            }}
          >
            <CardContent>
              <Typography variant="body2">Heart Rate</Typography>
              <Typography variant="h4">
                ❤️ {vitals.heartRate}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card
            sx={{
              borderRadius: "16px",
              backdropFilter: "blur(10px)",
              background: "rgba(255,255,255,0.6)",
              borderTop: `4px solid ${getColor(vitals.temperature, "temp")}`,
              boxShadow: "0 8px 25px rgba(0,0,0,0.08)"
            }}
          >
            <CardContent>
              <Typography variant="body2">Temperature</Typography>
              <Typography variant="h4">
                🌡 {vitals.temperature.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card
            sx={{
              borderRadius: "16px",
              backdropFilter: "blur(10px)",
              background: "rgba(255,255,255,0.6)",
              borderTop: "4px solid #1890ff",
              boxShadow: "0 8px 25px rgba(0,0,0,0.08)"
            }}
          >
            <CardContent>
              <Typography variant="body2">Blood Pressure</Typography>
              <Typography variant="h4">
                🩸 {vitals.bloodPressure}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* 📊 CHART */}
      <Box
        sx={{
          mt: 3,
          p: 2,
          borderRadius: "16px",
          backdropFilter: "blur(10px)",
          background: "rgba(255,255,255,0.6)",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)"
        }}
      >
        <Typography mb={1}>Live Trend</Typography>

        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={history}>
            <XAxis dataKey="time" hide />
            <YAxis />
            <Tooltip />

            <Line
              type="monotone"
              dataKey="hr"
              stroke="#ff4d4f"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="temp"
              stroke="#1890ff"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>

      {/* 🚨 ALERT */}
      {isCritical && (
        <Box
          sx={{
            mt: 2,
            p: 2,
            borderRadius: "12px",
            background: "rgba(255,77,79,0.1)",
            color: "#ff4d4f",
            fontWeight: "bold",
            textAlign: "center"
          }}
        >
          🚨 Critical Condition - Immediate Attention Required
        </Box>
      )}
    </Box>
  );
}
import React, { useState } from "react";
import API from "../services/api";

export default function AddPatient() {
  const [data, setData] = useState({ name: "", age: "", disease: "" });

  const submit = async () => {
    await API.post("/patients", data);
    alert("Patient Added");
  };

  return (
    <div>
      <input placeholder="Name" onChange={e => setData({...data, name: e.target.value})}/>
      <input placeholder="Age" onChange={e => setData({...data, age: e.target.value})}/>
      <input placeholder="Disease" onChange={e => setData({...data, disease: e.target.value})}/>
      <button onClick={submit}>Add</button>
    </div>
  );
}
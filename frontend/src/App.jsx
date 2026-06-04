import { useEffect, useState } from "react";
const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const [clientName, setClientName] = useState("");
  const [barberName, setBarberName] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [message, setMessage] = useState("");

  const [appointments, setAppointments] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);

  async function loadAppointments() {
    const response = await fetch("${API_URL}/appointments");
    const data = await response.json();

    setAppointments(data);
  }

  async function loadAvailableTimes() {
    if (!barberName || !appointmentDate) {
      setAvailableTimes([]);
      return;
    }

    const response = await fetch(
      `${API_URL}/appointments/available-times?barber_name=${barberName}&appointment_date=${appointmentDate}`,
    );

    const data = await response.json();

    setAvailableTimes(data.available_times);
  }

  useEffect(() => {
    loadAppointments();
  }, []);

  useEffect(() => {
    loadAvailableTimes();
  }, [barberName, appointmentDate]);

  async function handleSubmit(event) {
    event.preventDefault();

    const response = await fetch("${API_URL}/appointments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_name: clientName,
        barber_name: barberName,
        appointment_date: appointmentDate,
        appointment_time: appointmentTime,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      setMessage("Agendamento criado com sucesso!");

      setClientName("");
      setAppointmentTime("");

      loadAppointments();
      loadAvailableTimes();
    } else {
      setMessage(data.message);
    }
  }

  async function handleCancel(id) {
    const response = await fetch(`${API_URL}/appointments/${id}/cancel`, {
      method: "PATCH",
    });

    const data = await response.json();

    if (response.ok) {
      setMessage("Agendamento cancelado com sucesso!");

      loadAppointments();
      loadAvailableTimes();
    } else {
      setMessage(data.message);
    }
  }

  return (
    <div>
      <h1>Gerenciador de Agendamentos da Barbearia</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Nome do cliente</label>
          <input
            type="text"
            placeholder="Ex: João"
            value={clientName}
            onChange={(event) => setClientName(event.target.value)}
          />
        </div>

        <div>
          <label>Nome do barbeiro</label>
          <input
            type="text"
            placeholder="Ex: Carlos"
            value={barberName}
            onChange={(event) => setBarberName(event.target.value)}
          />
        </div>

        <div>
          <label>Data</label>
          <input
            type="date"
            value={appointmentDate}
            onChange={(event) => setAppointmentDate(event.target.value)}
          />
        </div>

        <div>
          <label>Horário</label>
          <select
            value={appointmentTime}
            onChange={(event) => setAppointmentTime(event.target.value)}
          >
            <option value="">Selecione um horário</option>

            {availableTimes.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
        </div>

        <button type="submit">Agendar</button>
      </form>

      {message && <p>{message}</p>}

      <h2>Agendamentos</h2>

      <table border="1">
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Barbeiro</th>
            <th>Data</th>
            <th>Horário</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>

        <tbody>
          {appointments.map((appointment) => (
            <tr key={appointment.id}>
              <td>{appointment.client_name}</td>
              <td>{appointment.barber_name}</td>
              <td>{appointment.appointment_date.slice(0, 10)}</td>
              <td>{appointment.appointment_time}</td>
              <td>{appointment.status}</td>
              <td>
                {appointment.status === "scheduled" && (
                  <button
                    type="button"
                    onClick={() => handleCancel(appointment.id)}
                  >
                    Cancelar
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;

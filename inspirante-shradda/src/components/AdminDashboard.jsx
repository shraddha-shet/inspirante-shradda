import React, { useState, useEffect } from "react";

const AdminDashboard = ({ token }) => {
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [registeredStudents, setRegisteredStudents] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [newEvent, setNewEvent] = useState({
    name: "",
    date: "",
    venue: "",
    capacity: "",
  });

  const formatDate = (isoString) => {
    const d = new Date(isoString);
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const fetchEvents = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/events", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setEvents(data);
      } else {
        setErrorMsg(data.error || "Failed to fetch events");
      }
    } catch (error) {
      setErrorMsg("Network error. Could not load events.");
    }
  };

  const fetchRegistrations = async (eventId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/events/${eventId}/registrations`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        setRegisteredStudents(data);
        setSelectedEventId(eventId);
      } else {
        setErrorMsg(data.error || "Failed to fetch registrations");
      }
    } catch (error) {
      setErrorMsg("Network error. Could not load registrations.");
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    try {
      const response = await fetch("http://localhost:3000/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newEvent),
      });
      const data = await response.json();
      if (response.ok) {
        setNewEvent({ name: "", date: "", venue: "", capacity: "" });
        fetchEvents();
      } else {
        setErrorMsg(data.error || "Failed to create event");
      }
    } catch (error) {
      setErrorMsg("Network error. Could not create event.");
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const getCapacityColorClass = (count, capacity) => {
    const percent = (count / capacity) * 100;
    if (percent < 50) return "capacity-green";
    if (percent < 80) return "capacity-amber";
    return "capacity-red";
  };

  return (
    <div className="dashboard-container">
      {errorMsg && <div className="alert alert-error">{errorMsg}</div>}

      <div className="card">
        <h2>Create New Event</h2>
        <form onSubmit={handleCreateEvent} className="horizontal-form">
          <input
            type="text"
            placeholder="Event Name"
            value={newEvent.name}
            onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
            required
          />
          <input
            type="date"
            value={newEvent.date}
            onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Venue"
            value={newEvent.venue}
            onChange={(e) =>
              setNewEvent({ ...newEvent, venue: e.target.value })
            }
            required
          />
          <input
            type="number"
            placeholder="Capacity"
            value={newEvent.capacity}
            onChange={(e) =>
              setNewEvent({ ...newEvent, capacity: e.target.value })
            }
            required
          />
          <button type="submit" className="btn-primary">
            Create Event
          </button>
        </form>
      </div>

      <div className="grid-2col">
        <div className="card">
          <h2>All Events</h2>
          {events.length === 0 ? (
            <p>No events found.</p>
          ) : (
            <ul className="event-list">
              {events.map((event) => (
                <li
                  key={event._id}
                  className={`event-item ${selectedEventId === event._id ? "event-item-selected" : ""}`}
                  onClick={() => fetchRegistrations(event._id)}
                >
                  <div className="event-details">
                    <strong>{event.name}</strong>
                    <span className="event-meta">
                      {formatDate(event.date)} &mdash; {event.venue}
                    </span>
                  </div>
                  <div
                    className={`event-capacity ${getCapacityColorClass(event.registrationsCount, event.capacity)}`}
                  >
                    {event.registrationsCount} / {event.capacity}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {selectedEventId && (
          <div className="card">
            <h2>Registered Students</h2>
            {registeredStudents.length === 0 ? (
              <p>No students registered for this event yet.</p>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Username</th>
                  </tr>
                </thead>
                <tbody>
                  {registeredStudents.map((reg) => (
                    <tr key={reg._id}>
                      <td>{reg.user.name}</td>
                      <td>{reg.user.username}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

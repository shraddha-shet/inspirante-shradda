import React, { useState, useEffect } from "react";

const StudentDashboard = ({ token }) => {
  const [events, setEvents] = useState([]);
  const [myRegistrations, setMyRegistrations] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

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
        setErrorMsg(data.error || "Failed to load events");
      }
    } catch (error) {
      setErrorMsg("Network error. Could not load events.");
    }
  };

  const fetchMyRegistrations = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/registrations/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setMyRegistrations(data);
      } else {
        setErrorMsg(data.error || "Failed to load your registrations");
      }
    } catch (error) {
      setErrorMsg("Network error. Could not load your registrations.");
    }
  };

  useEffect(() => {
    fetchEvents();
    fetchMyRegistrations();
  }, []);

  const handleRegister = async (eventId) => {
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const response = await fetch("http://localhost:3000/api/registrations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ eventId }),
      });
      const data = await response.json();
      if (response.ok) {
        setSuccessMsg("Successfully registered for the event!");
        fetchEvents();
        fetchMyRegistrations();
      } else {
        setErrorMsg(data.error || "Registration failed");
      }
    } catch (error) {
      setErrorMsg("Network error. Could not complete registration.");
    }
  };

  const registeredEventIds = new Set(
    myRegistrations.map((reg) => reg.event._id)
  );

  return (
    <div className="dashboard-container">
      {errorMsg && <div className="alert alert-error">{errorMsg}</div>}
      {successMsg && <div className="alert alert-success">{successMsg}</div>}

      <div className="grid-2col">
        <div className="card">
          <h2>Upcoming Events</h2>
          {events.length === 0 ? (
            <p>No events available.</p>
          ) : (
            <ul className="event-list">
              {events.map((event) => {
                const isFull = event.registrationsCount >= event.capacity;
                const alreadyRegistered = registeredEventIds.has(event._id);
                return (
                  <li key={event._id} className="event-item student-event-item">
                    <div className="event-details">
                      <strong>
                        {event.name}{" "}
                        {isFull && <span className="tag-full">Full</span>}
                      </strong>
                      <span className="event-meta">
                        {formatDate(event.date)} &mdash; {event.venue}
                      </span>
                      <span className="event-meta">
                        {event.registrationsCount} / {event.capacity} registered
                      </span>
                    </div>
                    <button
                      onClick={() => handleRegister(event._id)}
                      disabled={isFull || alreadyRegistered}
                      className={
                        isFull || alreadyRegistered ? "btn-disabled" : "btn-primary"
                      }
                    >
                      {alreadyRegistered ? "Registered" : "Register"}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="card">
          <h2>My Registrations</h2>
          {myRegistrations.length === 0 ? (
            <p>You have not registered for any events yet.</p>
          ) : (
            <ul className="event-list">
              {myRegistrations.map((reg) => (
                <li key={reg._id} className="event-item">
                  <div className="event-details">
                    <strong>{reg.event.name}</strong>
                    <span className="event-meta">
                      {formatDate(reg.event.date)} &mdash; {reg.event.venue}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;

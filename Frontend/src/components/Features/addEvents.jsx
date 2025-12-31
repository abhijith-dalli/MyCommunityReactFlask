import { useState } from "react";

export default function AddEvent() {
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "Monthly Association Meeting",
      organizer: "Association Committee",
      date: "2025-02-10",
      time: "18:00",
      location: "Club House",
      description:
        "Monthly discussion with residents regarding maintenance and upcoming activities."
    },
    {
      id: 2,
      title: "Festival Celebration",
      organizer: "Cultural Team",
      date: "2025-03-05",
      time: "19:00",
      location: "Main Lawn",
      description:
        "Community celebration with music, food, and cultural performances."
    }
  ]);

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fileName, setFileName] = useState("No file selected");

  const openEditDialog = (event) => {
    setSelectedEvent({ ...event });
    setIsModalOpen(true);
  };

  const closeEditDialog = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setSelectedEvent((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const saveEditedEvent = () => {
    setEvents((prev) =>
      prev.map((ev) => (ev.id === selectedEvent.id ? selectedEvent : ev))
    );
    closeEditDialog();
  };

  return (
    <div className="layoutRoot">
      {/* LEFT VISUAL PANEL */}
        <aside className="visualPane">
        <div className="visualScrollArea">
            <div className="visualSticky">
            <h1>Events</h1>
            <i>Create and manage events for your community, all in one place. Add new events, see everything you’ve posted, and make quick edits whenever plans change.</i>
            </div>
        </div>
        </aside>



        {/* RIGHT CONTENT */}
        <main className="formPane">
        {/* CREATE FORM */}
        <form className="eventForm">
            <header className="formHeader">
            <h1>Create Event</h1>
            <span>Provide event details below</span>
            </header>

            <div className="field">
            <label>Event Title</label>
            <input placeholder="Event name" />
            </div>

            <div className="field">
            <label>Cover Image</label>

            <div className="imageUpload">
                <input
                type="file"
                id="eventImage"
                accept="image/*"
                onChange={(e) =>
                    setFileName(e.target.files[0]?.name || "")
                }
                />

                <label htmlFor="eventImage" className="imageUploadBox">
                <div className="imageUploadText">
                    {fileName ? (
                    <>
                        <strong>{fileName}</strong>
                        <span>Click to replace image</span>
                    </>
                    ) : (
                    <>
                        <strong>Upload event image</strong>
                        <span>PNG or JPG up to 5MB</span>
                    </>
                    )}
                </div>
                </label>
            </div>
            </div>

            <div className="field">
                <label>Organizer</label>
                <input placeholder="Organizer name" />
            </div>

            <div className="twoCol">
            <div className="field">
                <label>Date</label>
                <input type="date" />
            </div>
            <div className="field">
                <label>Time</label>
                <input type="time" />
            </div>
            </div>

            <div className="field">
            <label>Location</label>
            <input placeholder="Location" />
            </div>

            <div className="field">
            <label>Description</label>
            <textarea rows="4" placeholder="Event description" />
            </div>

            <button type="button" className="submitAction">
            Publish Event
            </button>
        </form>

        {/* EDIT EVENTS */}
        <section className="editSection">
          <h2>Edit Existing Events</h2>

          {events.map((event) => (
            <div
              key={event.id}
              className="editRow"
              onClick={() => openEditDialog(event)}
            >
              <div>
                <strong>{event.title}</strong>
                <div className="editMeta">{event.location}</div>
              </div>
              <span>{event.date}</span>
            </div>
          ))}
        </section>
      </main>

      {/* MODAL */}
      {isModalOpen && selectedEvent && (
        <div className="modalOverlay" onClick={closeEditDialog}>
          <div
            className="modalBox"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Edit Event</h3>

            <input
              name="title"
              value={selectedEvent.title}
              onChange={handleEditChange}
              placeholder="Event Title"
            />
            <input
              name="organizer"
              value={selectedEvent.organizer}
              onChange={handleEditChange}
              placeholder="Organizer"
            />
            <input
              type="date"
              name="date"
              value={selectedEvent.date}
              onChange={handleEditChange}
            />
            <input
              type="time"
              name="time"
              value={selectedEvent.time}
              onChange={handleEditChange}
            />
            <input
              name="location"
              value={selectedEvent.location}
              onChange={handleEditChange}
              placeholder="Location"
            />
            <textarea
              name="description"
              rows="4"
              value={selectedEvent.description}
              onChange={handleEditChange}
              placeholder="Description"
            />

            <div className="modalActions">
              <button className="ghostBtn" onClick={closeEditDialog}>
                Cancel
              </button>
              <button className="primaryBtn" onClick={saveEditedEvent}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

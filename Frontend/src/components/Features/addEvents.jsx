import { useState,useEffect } from "react";

export default function AddEvent() {

  const [events, setEvents] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fileName, setFileName] = useState("");

  useEffect(() => {
    fetch("http://localhost:4000/Event?user_id="+localStorage.user_id,{
        method: "GET",
    })
    .then(res=> res.json())
    .then(data=>{
      setEvents(data)
    })
  }, []);


  function openEditDialog(event) {
    setSelectedEvent({ ...event });
    setIsModalOpen(true);
  };

  function closeEditDialog() {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  function handleEditChange(e){
    const { name, value } = e.target;
    setSelectedEvent((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  function saveEditedEvent() {
    setEvents((prev) =>
      prev.map((ev) => (ev.id === selectedEvent.id ? selectedEvent : ev))
    );
    closeEditDialog();
  };

  const [newEvent, setnewEvent] = useState({
    eName:'',
    organizer:'',
    date:'',
    time:'',
    location:'',
    desc:''
  })

  function eventChange(e) {
    const { ename, evalue } = e.target;
    setnewEvent((prev) => ({
      ...prev,
      [ename]: evalue
    }));
  };

  function handleEventsubmit(e) {
    e.preventDefault();
    const formJSON = new FormData(e.target)
    fetch("http://localhost:4000/Event",{
        method: "POST",
        body: formJSON
    })
  }

  function handleFileUplaod(e){
    const file = e.target.files[0];
    if (file) {
      const file_data = new FormData()
      file_data.append("file", file);
      fetch("http://localhost:4000/upload", {
        method: "POST",
        body: file_data
      })
      .then(res=>res.json())
      .then(data => {
        if(data && data.message == 'Success'){
          setFileName(data.filename)
        }
      })
      .catch(error => {
        console.error(error);
      })
    }
    else{
      // If the user chooses to cancel the upload!
      setFileName('')
    }
    
  }
  return (
    <div>
      <div className="layoutRoot">
          <aside className="visualPane">
          <div className="visualScrollArea">
              <div className="visualSticky">
              <h1>Events</h1>
              <i>Create and manage events for your community, all in one place. Add new events, see everything you’ve posted, and make quick edits whenever plans change.</i>
              </div>
          </div>
          </aside>

          <main className="formPane">
          <form className="eventForm" onSubmit={handleEventsubmit} method="POST">
              <header className="formHeader">
                <h1>Create Event</h1>
                <span>Provide event details below ⬇️</span>
              </header>

              <input name="user_id" type="hidden" id="user_id" value={localStorage.user_id}/> 
              <div className="field">
              <label>Event Title</label>
              <input placeholder="Event name" name="eName" id="eName" value={newEvent.eName} onChange={setnewEvent}/>
              </div>

              <div className="field">
              <label>Cover Image</label>

              <div className="imageUpload">
                  <input
                  type="file"
                  id='image_upload'
                  accept="image/*"
                  onChange={handleFileUplaod}/>
                <input name="eventImage" type="hidden" id="eventImage" value={fileName}/>
                  <label htmlFor="image_upload" className="imageUploadBox">
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
                  <input placeholder="Organizer name" name="organizer" id="organizer" value={newEvent.organizer} onChange={setnewEvent}/>
              </div>

              <div className="twoCol">
              <div className="field">
                  <label>Date</label>
                  <input type="date" name="date" id="date" value={newEvent.date} onChange={setnewEvent}/>
              </div>
              <div className="field">
                  <label>Time</label>
                  <input type="time" name="time" id="time" value={newEvent.time} onChange={setnewEvent}/>
              </div>
              </div>

              <div className="field">
              <label>Location</label>
              <input placeholder="Location" name="location" id="location" value={newEvent.location} onChange={setnewEvent}/>
              </div>

              <div className="field">
              <label>Description</label>
              <textarea rows="4" placeholder="Event description" name="desc" id="desc" value={newEvent.desc} onChange={setnewEvent}/>
              </div>

              <button type="submit" className="submitAction">
              Publish Event
              </button>
          </form>

          {events != '' ? 
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
          </section> : ''}
        </main>

        {/* MODALBOX */}
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
    </div>
  );
}

import { useState,useEffect } from "react";
import { useNavigate,Link } from "react-router-dom";

function ErrorAck(props){
  return (<small id={props.id} className="text-danger">{props.message}</small>);
}

export default function AddEvent() {

  const [events, setEvents] = useState('');
  const [showRequired, setshowRequired] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showReq , setshowReq] = useState('');
  const [updated, setUpdated] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fileName, setFileName] = useState("");
  const [newEvent, setnewEvent] = useState({
    eName:'',
    organizer:'',
    date:'',
    time:'',
    location:'',
    desc:''
  })
  
  useEffect(() => {
    fetch("http://localhost:4000/Event?user_id="+localStorage.user_id,{
        method: "GET",
    })
    .then(res=> res.json())
    .then(data=>{
      setEvents(data)
    })
  }, []);

  function handleDelete(event_id){
    fetch("http://localhost:4000/Event/"+event_id+"/"+localStorage.user_id,{
        method: "DELETE",
    })
    .then(res=> res.json())
    .then(data=>{
      setEvents(data)
    })
  }

  function openEditDialog(event) {
    setSelectedEvent({ ...event });
    setIsModalOpen(true);
  };

  function closeEditDialog() {
    setIsModalOpen(false);
    setSelectedEvent(null);
    setUpdated(false);
  };

  function handleEditChange(e){
    setUpdated(true)
    const { name, value } = e.target;
    setSelectedEvent((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  function saveEditedEvent(e) {
    e.preventDefault()
    const editformJSON = new FormData(e.target)
    if(selectedEvent.description != '' || selectedEvent.location != '' || selectedEvent.time != '' || selectedEvent.date != '' || 
      selectedEvent.organizer != '' || selectedEvent.title != ''){
      fetch("http://localhost:4000/Event",{
          method: "PATCH",
          body: editformJSON,
      })
      .then(res=> res.json())
      .then(data=>{
        setEvents(data)
        closeEditDialog();
      })
      .catch(error => {
        console.error(error);
        alert("Something went wrong!!")
        closeEditDialog();
      })
      setUpdated(false)
      setshowReq('false')
    }
    else{
      setshowReq('true')
    }
  };

  function setnewEventChange(e) {
    const name = e.target.name;
    const value = e.target.value;
    setnewEvent(values => ({...values, [name]: value}))
  }

  function handleEventsubmit(e) {
    console.log('hitting',newEvent.eName)
    e.preventDefault();
    if(newEvent.eName == '' || newEvent.organizer == '' || newEvent.date == '' || newEvent.time == '' || 
      newEvent.location == ''  || newEvent.desc == '' || fileName == '') {
      setshowRequired('yes')
    }
    else{
      setshowRequired('no')
      const formJSON = new FormData(e.target)
      fetch("http://localhost:4000/Event",{
          method: "POST",
          body: formJSON
      })
      .then(res=> res.json())
      .then(data=>{
        window.location.reload();
      })
      .catch(error => {
        console.error(error);
        alert("Something went wrong!!")
      })
    }
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
                 <div className="backbtn">
                  <Link to={-1} className="backBtnSmall">
                    <span className="text">← Go back</span>
                  </Link>
                </div>
              </div>
          </div>
          </aside>

          <main className="formPane">
          <form className="eventForm" onSubmit={handleEventsubmit} method="POST">
              <header className="formHeader">
                <h1>Create Event</h1>
                <span>Provide event details below ⬇️</span>
              </header>

              <input name="user_id" type="hidden" value={localStorage.user_id}/> 
              <div className="field">
              <label>Event Title</label>
              <input placeholder="Event name" name="eName" id="eName" value={newEvent.eName} onChange={setnewEventChange}/>
              {showRequired === 'yes' && newEvent.eName === '' && <ErrorAck id='eNameError' message='This field is required.'/> }
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
                <input placeholder="Organizer name" name="organizer" id="organizer" value={newEvent.organizer} onChange={setnewEventChange}/>
                {showRequired === 'yes' && newEvent.organizer === '' && <ErrorAck id='organizerError' message='This field is required.'/> }
              </div>

              <div className="twoCol">
              <div className="field">
                  <label>Date</label>
                  <input type="date" name="date" id="date" value={newEvent.date} onChange={setnewEventChange}/>
                  {showRequired === 'yes' && newEvent.date === '' && <ErrorAck id='dateError' message='This field is required.'/> }
              </div>
              <div className="field">
                  <label>Time</label>
                  <input type="time" name="time" id="time" value={newEvent.time} onChange={setnewEventChange}/>
                  {showRequired === 'yes' && newEvent.time === '' && <ErrorAck id='timeError' message='This field is required.'/> }
              </div>
              </div>

              <div className="field">
                <label>Location</label>
                <input placeholder="Location" name="location" id="location" value={newEvent.location} onChange={setnewEventChange}/>
                {showRequired === 'yes' && newEvent.location === '' && <ErrorAck id='locationError' message='This field is required.'/> }
              </div>

              <div className="field">
              <label>Description</label>
              <textarea rows="4" placeholder="Event description" name="desc" id="desc" value={newEvent.desc} onChange={setnewEventChange}/>
              {showRequired === 'yes' && newEvent.desc === '' && <ErrorAck id='descError' message='This field is required.'/> }
              </div>

              <button type="submit" className="submitAction">
              Publish Event
              </button>
          </form>

          {events != '' ? 
          <section className="editSection">
            <h2>Edit Existing Events</h2>

            {events.map((event) => (
              <div key={event.id}
                className="editRow"
                onClick={() => openEditDialog(event)} >
                <div className="editInfo">
                  <strong>{event.title}</strong>
                  <div className="editMeta">{event.location}</div>
                </div>

                <div className="editRight">
                  <span className="eventDate">{event.date}</span>
                  <i
                    className="fa fa-trash deleteIcon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(event.id);
                    }}
                    title="Delete event"
                  />
                </div>
              </div>
            ))}
          </section> : ''}
        </main>

        {/* MODALBOX */}
        {isModalOpen && selectedEvent && (
          <form onSubmit={saveEditedEvent}>
            <div className="modalOverlay" onClick={closeEditDialog}>
              <div className="modalBox" onClick={(e) => e.stopPropagation()} >
                <h3>Edit Event</h3>
                <input type="hidden" name="user_id" value={localStorage.user_id}/>
                <input type="hidden" name="event_id" value={selectedEvent.id}/>
                <input type="text" name="title" value={selectedEvent.title} onChange={handleEditChange} placeholder="Event Title"/>
                {showReq === 'yes' && selectedEvent.title === '' && <ErrorAck id='titleError' message='This field is required.'/> }
                <input type="text" name="organizer" value={selectedEvent.organizer} onChange={handleEditChange} placeholder="Organizer"/>
                {showReq === 'yes' && selectedEvent.organizer === '' && <ErrorAck id='organizerError' message='This field is required.'/> }
                <input type="date" name="date" value={selectedEvent.date} onChange={handleEditChange}/>
                {showReq === 'yes' && selectedEvent.date === '' && <ErrorAck id='dateError' message='This field is required.'/> }
                <input type="time" name="time" value={selectedEvent.time} onChange={handleEditChange}/>
                {showReq === 'yes' && selectedEvent.time === '' && <ErrorAck id='timeError' message='This field is required.'/> }
                <input type="text" name="location" value={selectedEvent.location} onChange={handleEditChange} placeholder="Location" />
                {showReq === 'yes' && selectedEvent.location === '' && <ErrorAck id='locationError' message='This field is required.'/> }
                <textarea name="description" rows="4" value={selectedEvent.description} onChange={handleEditChange} placeholder="Description" />
                {showReq === 'yes' && selectedEvent.description === '' && <ErrorAck id='descriptionError' message='This field is required.'/> }
                <div className="modalActions">
                  <button className="ghostBtn" onClick={closeEditDialog}>Cancel</button>
                  { updated ? 
                  <button type="submit" className="primaryBtn" >Save Changes</button>
                  :
                  <button type="submit" className="primaryBtn" disabled='True'>Save Changes</button>
                  }
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

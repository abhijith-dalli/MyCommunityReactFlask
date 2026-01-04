import NavBar from "../Navbar";
import {useEffect,useState} from "react"

function EventCard({details}){
  return(
          <div className="card event-card w-100 overflow-hidden">
            <div className="event-image position-relative">
                <img src={"http://localhost:4000/uploads/" + details.image} alt={details.image} />
              <span className="badge bg-purple position-absolute top-0 end-0 m-3">
                {details.due}
              </span>
            </div>

            <div className="card-body text-center">
              <h5 className="fw-bold text-purple">{details.title}</h5>
              <p className="text-muted">
                {details.description}
              </p>

              <ul className="list-unstyled small mt-3">
                <li><i className="fa fa-calendar text-purple"></i> {details.date} · {details.time}</li>
                <li><i className="fa fa-user text-purple"></i> Organized by {details.organizer}</li>
                <li><i className="fa fa-location-dot text-purple"></i> {details.location}</li>
              </ul>
            </div>
          </div>
        )
  }

  
function Home() {

  const [events,setEvents] = useState('')
  useEffect(() => {
    fetch("http://localhost:4000/Event?user_id=0",{
        method: "GET",
    })
    .then(res=> res.json())
    .then(data=>{
      setEvents(data)
    })
  }, []);
  
  return (
    <>
      <NavBar />
      <div className="container mt-5">
          <h2 className="section-title">Upcoming Events</h2>
          <div className="container">
            <div className="row justify-content-center g-4">
              {events.length > 0 ? (
                events.map((event) => (
                  <div key={event.id} className="col-md-4 col-sm-6 d-flex justify-content-center">
                    <EventCard details={event}/> 
                  </div>
                ))
              ) : (
                <p className="text-center text-muted">No events found</p>
              )}
            </div>
          </div>   
      </div>

      {/* REVIEWS */}
      <div className="container mt-5">
        <h2 className="section-title">Service Reviews</h2>

        <div className="row justify-content-center" id="insertService">
          <div className="col-md-6 d-flex justify-content-center">
            <div className="testimonial-box">

              {/* HEADER */}
              <div className="testimonial-header">
                <div>
                  <h6 className="review-title">Electrician Service</h6>
                  <span className="review-user">@Owner (Flat 203)</span>
                </div>

                <span className="rating-badge">
                  ⭐ 4.5 / 5
                </span>
              </div>

              {/* BODY */}
              <div className="testimonial-body">
                <p>
                  Very professional and quick service. Issue was resolved on the same day.
                  Highly recommended!
                </p>
              </div>

              {/* FOOTER */}
              <div className="testimonial-footer">
                <span><i className="fa fa-phone"></i> 9876543210</span>
                <span><i className="fa fa-calendar"></i> 18 Sep 2025</span>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* REPORT */}
      <div className="container mt-5 mb-5">
        <h2 className="section-title">Report an Issue</h2>

        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="report-card p-4 p-md-5">
              <p className="lead text-center">Help us improve by reporting issues.</p>
              <form>
                <div className="row g-3">
                  <div className="col-md-6"><input className="form-control" placeholder="First Name"/></div>
                  <div className="col-md-6"><input className="form-control" placeholder="Last Name"/></div>
                  <div className="col-12"><input className="form-control" placeholder="Email"/></div>
                  <div className="col-12"><textarea className="form-control" rows="4" placeholder="Your message"></textarea></div>
                  <div className="col-12 text-center">
                    <button className="btn btn-light px-5 fw-bold">
                      <i className="fa fa-paper-plane"></i> Send
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;

import { useNavigate } from "react-router-dom";
import NavBar from "./Navbar";

function Home() {

  return (
    <>
      <NavBar />
      {/* EVENTS */}
      <div className="container mt-5">
          <h2 className="section-title">Upcoming Events</h2>
          <div className="row justify-content-center">
          <div className="col-md-4 d-flex justify-content-center">
              <div className="card event-card w-100 overflow-hidden">
                  <div className="event-image">
                  <img 
                      src="../media/event-placeholder.jpg" 
                      alt="Community Event"
                      className="img-fluid w-100"
                  />
                  <span className="badge bg-purple position-absolute top-0 end-0 m-3">
                      Upcoming
                  </span>
                  </div>

                  {/* CONTENT */}
                  <div className="card-body text-center">
                  <h5 className="fw-bold text-purple">Community Meetup</h5>
                  <p className="text-muted">
                      Join your neighbours for a friendly community gathering.
                  </p>

                  <ul className="list-unstyled small mt-3">
                      <li><i className="fa fa-calendar text-purple"></i> 20 Sep · 6:00 PM</li>
                      <li><i className="fa fa-user text-purple"></i> Organized by Admin</li>
                      <li><i className="fa fa-location-dot text-purple"></i> Club House</li>
                  </ul>
                  </div>

              </div>
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

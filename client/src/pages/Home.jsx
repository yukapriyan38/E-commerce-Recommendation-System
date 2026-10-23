import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Recommendations from "../components/Recommendations";

function Home() {
  const { user } = useAuth();

  return (
    <main className="home-page">
      <section className="home-hero">
        <div className="home-hero-copy">
          <p className="home-eyebrow">A better way to find your favorites</p>
          <h1>
            Good things,
            <br />
            <span>just a click away.</span>
          </h1>
          <p className="home-hero-description">
            Explore thoughtful picks across the things you love, all in one
            place.
          </p>
          <div className="home-hero-actions">
            <Link className="home-primary-link" to="/products">
              Explore products <span aria-hidden="true">→</span>
            </Link>
            {!user && (
              <Link className="home-secondary-link" to="/login">
                Sign in for your picks
              </Link>
            )}
          </div>
        </div>

        <div className="home-hero-art" aria-hidden="true">
          <div className="home-art-orbit home-art-orbit-one" />
          <div className="home-art-orbit home-art-orbit-two" />
          <div className="home-art-card">
            <span className="home-art-sparkle">✳</span>
            <span className="home-art-label">A little inspiration</span>
            <div className="home-art-shape">
              <span />
            </div>
            <div className="home-art-card-footer">
              <span>Find something you love</span>
              <span className="home-art-arrow">↗</span>
            </div>
          </div>
          <span className="home-art-note home-art-note-top">Made for browsing</span>
          <span className="home-art-note home-art-note-bottom">Discover more</span>
        </div>
      </section>

      <section className="home-benefits" aria-label="Shopping features">
        <div className="home-benefit">
          <span className="home-benefit-icon" aria-hidden="true">01</span>
          <div>
            <h2>Easy discovery</h2>
            <p>Browse a range of products in one place.</p>
          </div>
        </div>
        <div className="home-benefit">
          <span className="home-benefit-icon" aria-hidden="true">02</span>
          <div>
            <h2>Picked for you</h2>
            <p>Sign in to see personalized recommendations.</p>
          </div>
        </div>
        <div className="home-benefit">
          <span className="home-benefit-icon" aria-hidden="true">03</span>
          <div>
            <h2>Simple checkout</h2>
            <p>Your cart and orders, together in one account.</p>
          </div>
        </div>
      </section>

      {user ? (
        <div className="home-recommendations">
          <Recommendations />
        </div>
      ) : (
        <section className="home-discover">
          <div>
            <p className="home-eyebrow">Your next find is waiting</p>
            <h2>Take a look around.</h2>
          </div>
          <Link className="home-discover-link" to="/products">
            Browse all products <span aria-hidden="true">→</span>
          </Link>
        </section>
      )}
    </main>
  );
}

export default Home;
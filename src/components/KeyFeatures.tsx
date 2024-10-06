import Image from 'next/image';

export default function KeyFeatures() {
  return (
    <section className="key-features">
      <h2>Key Features</h2>
      <div className="feature">
        <div className="feature-content">
          <div className="feature-text">
            <div className="title">
              <h3>
                <span>Real-Time Tracking</span>
                <br />
                <span>of Asteroids and Comets</span>
              </h3>
            </div>
            <p><strong>Description:</strong> Provide users with real-time data on the location, speed, and trajectory of various celestial objects such as asteroids, comets, and Near-Earth Objects (NEOs). Users can watch the live movement of these objects across the sky with precise information.</p>
            <p><strong>Why It&apos;s Important:</strong> Keeping track of potentially hazardous asteroids or simply observing distant comets as they approach Earth can be exciting for space enthusiasts and professionals alike. Real-time tracking ensures users are always informed of current space events.</p>
            <p><strong>Additional Feature:</strong> You can add filters so users can track specific objects based on size, distance, or proximity to Earth.</p>
          </div>
          <div className="feature-image">
            <Image src="/images/asteroid.png" alt="Asteroid" width={400} height={400} className="asteroid-image" />
            <div className="top-right-star">
              <Image src="/images/svgs/grnstarshadow.svg" alt="Top Right Star" width={480} height={480} />
            </div>
            <div className="bottom-left-star">
              <Image src="/images/svgs/starshadow.svg" alt="Bottom Left Star" width={288} height={288} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
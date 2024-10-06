import Image from 'next/image';

export default function Welcome() {
  return (
    <section className="welcome">
      <div className="star-container">
        <div className="star purple-star"></div>
        <div className="star green-star"></div>
      </div>
      <div className="welcome-content d-flex">
        <div className="welcome-image">
          <Image src="/images/beautiful-milky-way-night-sky.jpg" alt="Astrolab" width={800} height={600} />
          <div className="top-left-star">
            <Image src="/images/svgs/grnstarshadow.svg" alt="Top Left Star" width={288} height={288} />
          </div>
          <div className="bottom-right-star">
            <Image src="/images/svgs/starshadow.svg" alt="Bottom Right Star" width={288} height={288} />
          </div>
        </div>
        <div className="welcome-text">
          <p>Welcome to Astrolab, your real-time observatory for tracking and exploring asteroids, comets, and Near-Earth Objects (NEOs). Whether you&apos;re an astronomer, space enthusiast, or simply curious about the universe, Astrolab offers a seamless way to stay connected with the dynamic movements of celestial bodies.
With live data at your fingertips, you can track objects in real time, view their trajectories, and uncover insights into the ever-changing landscape of our solar system. Explore the mysteries of space, stay informed on potential close approaches, and join a community passionate about discovering the wonders beyond our world.</p>
        </div>
      </div>
    </section>
  );
}
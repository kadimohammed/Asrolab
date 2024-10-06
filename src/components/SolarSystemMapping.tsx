import Image from 'next/image';

export default function SolarSystemMapping() {
  return (
    <section className="solar-system-mapping">
      <h2>Solar System Mapping</h2>
      <div className="solar-system-content">
        <div className="solar-system-image">
          <Image src="/images/solarsystem.png" alt="Solar System Map" width={1280} height={720} />
        </div>
        <div className="solar-text">
          <div className="star star-tp-left">
            <Image src="/images/svgs/grnstarshadow.svg" alt="Top Left Star" width={352} height={352} />
          </div>
          <div className="star star-bt-right">
            <Image src="/images/svgs/starshadow.svg" alt="Bottom Right Star" width={240} height={240} />
          </div>
          <p>Experience our interactive solar system map, where you can explore planets, asteroids, and comets in real time. Track the orbits of celestial bodies and uncover insights into their positions and movements as they travel through space</p>
        </div>
        <button className="venture-btn">Venture</button>
      </div>
    </section>
  );
}
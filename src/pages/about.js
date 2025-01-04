/* eslint-disable react/no-unescaped-entities */
import Head from "next/head";
import styles from "../styles/About.module.css";

export default function About() {
  return (
    <div className={styles.container}>
      <Head>
        <title>About - MiddZillow</title>
      </Head>
      <main className={styles.main}>
        <h1 className={styles.title}>About MiddZillow</h1>
        <p className={styles.description}>
          MiddZillow is an independent project developed for the CS 312 Software
          Development course at Middlebury College. It serves as a platform for
          users to explore and review campus buildings, providing ratings and
          insights into various aspects such as noise, location, cleanliness,
          accessibility, and more.
        </p>
        <section className={styles.section}>
          <h2>Features</h2>
          <ul className={styles.featureList}>
            <li>Browse detailed reviews for campus buildings.</li>
            <li>Submit your own ratings and reviews.</li>
            <li>
              Filter buildings by categories like accessibility or location.
            </li>
            <li>Interactive and user-friendly design.</li>
          </ul>
        </section>
        <section className={styles.section}>
          <h2>Our Team</h2>
          <p>
            MiddZillow was developed by students in the CS 312 Software
            Development course, combining creativity and programming expertise
            to deliver a valuable tool for the Middlebury community.
          </p>
        </section>
        <section className={styles.section}>
          <h2>Disclaimer</h2>
          <p>
            MiddZillow is not affiliated with Middlebury College or ZillowGroup
            Inc. The name "MiddZillow" is used solely for educational purposes
            as part of a software development project and does not imply
            endorsement or partnership with these entities.
          </p>
        </section>
      </main>
    </div>
  );
}

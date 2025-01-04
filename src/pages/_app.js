/* eslint-disable react/jsx-props-no-spreading, no-console, @next/next/no-img-element, react/prop-types,no-unused-vars */
import { SessionProvider } from "next-auth/react";
import PropTypes from "prop-types";
import Link from "next/link";
import "../styles/globals.css";
import "../styles/ReviewBar.css";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import "../styles/Home.module.css";
import LoginWidget from "@/components/LoginWidget";

export default function MainApp({
  Component,
  pageProps: { session, ...pageProps },
}) {
  const router = useRouter();
  const { id } = router.query;
  const normalizedId = +id;
  const [currentBuilding, setCurrentBuilding] = useState();
  const [userID, setUserID] = useState();

  useEffect(() => {
    const fetchBuildings = async () => {
      try {
        const response = await fetch(`/api/buildings/${normalizedId}`);
        if (response.ok) {
          const data = await response.json();
          setCurrentBuilding(data);
        } else {
          throw new Error("Error loading building");
        }
      } catch (error) {
        console.error("Error loading buildings", error);
      }
    };
    if (normalizedId) {
      if (!currentBuilding || normalizedId !== currentBuilding.id) {
        setCurrentBuilding(null);
        fetchBuildings();
      }
    } else {
      setCurrentBuilding(null);
    }
  }, [currentBuilding, normalizedId]);

  const newSetCurrentBuilding = (building) => {
    if (building) {
      setCurrentBuilding(null);
      router.push(`/buildings/${building.id}`);
    } else {
      router.push("/buildings");
    }
  };

  const props = {
    ...pageProps,
    currentBuilding,
    setCurrentBuilding: newSetCurrentBuilding,
    userID,
  };

  return (
    <div className="container">
      <Head>
        <title>MiddZillow</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="main">
        <header className="header">
          <h1 className="title">
            <Link href="/">
              <img src="/MiddZillow.svg" alt="MiddZillow" className="logo" />
            </Link>
          </h1>
        </header>
        <div className="content">
          <SessionProvider session={pageProps.session}>
            <LoginWidget setUserID={setUserID} />
          </SessionProvider>
          <SessionProvider session={session}>
            <Component {...props} />
          </SessionProvider>
        </div>
      </main>
      <footer className="footer">CS 312 MiddZillow Project</footer>
    </div>
  );
}

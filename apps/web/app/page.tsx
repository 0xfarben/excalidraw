"use client";
// client component

import { useState } from "react";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";

export default function Home() {
  const [slug, setSlug ] = useState("");
  const router = useRouter();

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      width: "100vw"
    }}>
      {/* 
        users can join to the room, by providing the RoomId, 
        not slug, because slug is only used to use in the url navigation bar.
      */}
      <input type="text" 
             value={slug} 
             onChange={ (e) => {
              setSlug(e.target.value);
             }}
             placeholder="Enter Room Name"
             style={{
              padding: "10px"
             }}
      ></input>

      <button onClick={ () => {
                router.push(`/room/${slug}`);
              }} 
              style={{
              padding: "10px"
             }}
      >
        Join Room
      </button>
    </div>
  );
}

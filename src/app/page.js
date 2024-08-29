"use client"
import ServantSelection from "@/components/servant_selection";
import { useState } from 'react';
import { GenerateFullTitle } from "@/utilities/generators";

const styles = require("./page.module.css");
export default function Home() {
    const [servant, setServant] = useState('')
    const handleSelect = event => setServant(GenerateFullTitle(event.target.value))

  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <ServantSelection handleSelect={ handleSelect } />
      </div>
      <h3>{ servant }</h3>
    </main>
  );
}

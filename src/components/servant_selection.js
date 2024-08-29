"use client";

import { GenerateName } from "@/utilities/generators";

export default function ServantSelection({ handleSelect }) {
    const servants = require("../dictionaries/servants.json");

    return (
            <select name="servants" onChange={ handleSelect }>
                {servants.map(el => (
                    <option key={el.id} value={el.id}>{ GenerateName(el.id, 'nominative') }</option>
                ))}
            </select>
        )
}
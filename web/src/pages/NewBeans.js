import { useState } from "react";
import api from "../utils/api";

export default function NewBeans() {
  // Name, roaster, origin, flavor notes
  const [name, setName] = useState("");
  const [roaster, setRoaster] = useState("");
  const [origin, setOrigin] = useState("");
  const [flavorNoteInput, setFlavorNoteInput] = useState("");
  const [flavorNotes, setFlavorNotes] = useState([]);

  const postBeans = async () => {
    const body = {
      bean: {
        name,
        roaster,
        origin,
        flavor_notes: flavorNotes.join("|"),
      },
    };
    const { data } = await api.post("/beans", body);
  };

  return (
    <div className='d-flex justify-content-center'>
      <div>
        <div className='form-group m-3'>
          <label>Name</label>
          <input
            className='form-control'
            type='text'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className='form-group m-3'>
          <label>Roaster</label>
          <input
            className='form-control'
            type='text'
            value={roaster}
            onChange={(e) => setRoaster(e.target.value)}
          />
        </div>
        <div className='form-group m-3'>
          <label>Origin</label>
          <input
            className='form-control'
            type='text'
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
          />
        </div>
        <div className='form-group m-3'>
          <label>Flavor Notes</label>
          <div className='input-group'>
            <input
              className='form-control'
              type='text'
              value={flavorNoteInput}
              onChange={(e) => setFlavorNoteInput(e.target.value)}
            />
            <div className='input-group-append'>
              <button
                className='btn btn-outline-secondary'
                onClick={() => {
                  let fn = [...flavorNotes];
                  fn.push(flavorNoteInput);
                  setFlavorNotes(fn);
                }}
              >
                Add
              </button>
            </div>
          </div>
        </div>
        <ul className='list-group m-3'>
          {flavorNotes.map((note, idx) => (
            <li key={idx} className='list-group-item'>
              {note}
            </li>
          ))}
        </ul>
        <div className='m-3 d-flex justify-content-center'>
          <button className='btn btn-primary' onClick={postBeans}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

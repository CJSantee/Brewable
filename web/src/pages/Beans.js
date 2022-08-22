import axios from "axios";
import { useEffect, useState } from "react";
import { api } from "../utils/api";

export default function Beans() {
  const [beans, setBeans] = useState([]);

  useEffect(() => {
    async function getBeans() {
      const { data } = await api.get("/beans");
      setBeans(data);
    }
    getBeans();
  }, []);

  return (
    <div className='d-flex justify-content-center'>
      {beans.map((bean) => (
        <BeanCard key={bean.id} bean={bean} />
      ))}
    </div>
  );
}

const BeanCard = ({ bean }) => {
  return (
    <div className='card m-3'>
      <div className='card-body'>
        <div className='d-flex'>
          <img
            className='mh-300px'
            src={bean.image?.sourceUrl}
            // src={`data:${bean.image?.content_type};base64,${bean.image?.data}`}
            alt={`${bean.name}-${bean.id}-icon`}
          />
          <div className='d-flex flex-column justify-content-center'>
            <p className='h3'>{bean.roaster}</p>
            <p className='h4 text-muted'>{bean.name}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

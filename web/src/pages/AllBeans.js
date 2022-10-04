import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../utils/api";

export default function AllBeans() {
  const [beans, setBeans] = useState([]);

  useEffect(() => {
    async function getBeans() {
      const { data } = await api.get("/beans");
      setBeans(data);
    }
    getBeans();
  }, []);

  return (
    <div className='container-fluid'>
      <h3 className='m-0 mt-3 ms-3 font-title'>Popular</h3>
      <div className='d-flex flex-row flex-nowrap overflow-auto mt-0'>
        {beans.map((bean) => (
          <BeanCard key={bean.id} bean={bean} />
        ))}
      </div>
    </div>
  );
}

const BeanCard = ({ bean }) => {
  const navigate = useNavigate();

  return (
    <div
      className='card card-block m-3 cursor-pointer beans-card p-2'
      onClick={() => navigate(`/beans/${bean.beans_uuid}`)}
    >
      {bean.image && (
        <img
          className='mh-300px'
          src={bean.image?.sourceUrl}
          alt={`${bean.name}-${bean.id}-icon`}
        />
      )}
      <div className='d-flex flex-column justify-content-center'>
        <p className='h3'>{bean.roaster}</p>
        <p></p>
        <p className='h4 text-muted'>{bean.name}</p>
      </div>
    </div>
  );
};

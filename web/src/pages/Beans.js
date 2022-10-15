import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../utils/api";

export default function Beans() {
  const params = useParams();

  const [beans, setBeans] = useState();

  useEffect(() => {
    const fetchBeans = async () => {
      const { data } = await api.get(`/beans/${params.beansId}`);
      setBeans(data);
    };
    fetchBeans();
  }, [params.beansId]);

  return (
    <div className='container'>
      <h3>{JSON.stringify(beans)}</h3>
    </div>
  );
}

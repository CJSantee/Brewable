import { useNavigate } from "react-router-dom";

export default function New() {
  const navigate = useNavigate();

  return (
    <div className='container d-flex flex-column justify-content-center align-items-center h-100'>
      <button
        className='btn btn-lg btn-outline-primary mb-2'
        onClick={() => navigate("/new/beans")}
      >
        New Beans
      </button>
      <button className='btn btn-lg btn-outline-primary'>New Brew</button>
    </div>
  );
}

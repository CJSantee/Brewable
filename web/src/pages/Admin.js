// Components
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faShieldHalved, faUsers } from "@fortawesome/free-solid-svg-icons";

export default function Admin() {
  return (
    <div className='row m-0 p-0'>
      <div className='col-12 col-md-4 col-lg-3 p-2 border-end'>
        <div className='bg-hover-light rounded p-2 fs-5'>
          <FontAwesomeIcon icon={faShieldHalved} />
          <span className='ms-2'>Roles / Permissions</span>
        </div>
        <div className='bg-hover-light rounded p-2 fs-5'>
          <FontAwesomeIcon icon={faUsers} />
          <span className='ms-2'>All Users</span>
        </div>
      </div>
      <div className='col-12 col-md-8 col-lg-9'></div>
    </div>
  );
}

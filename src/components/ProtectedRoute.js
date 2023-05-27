// import React from 'react';
// import { Navigate } from "react-router-dom";

// // этот компонент принимает другой компонент в качестве пропса
// // он также может взять неограниченное число пропсов и передать их новому компоненту
// const ProtectedRouteElement = ({ element: Component, ...props  }) => {
//   return (
    
//     props.loggedIn ? <Component {...props} /> : <Navigate to="/login" replace/>
// )}

// export default ProtectedRouteElement;

import React from "react";
import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRouteElement({ component: Component, ...props }) {
  const { pathname } = useLocation()
  return (
    props.isLoggedIn ? (
      Component ? <Component {...props} /> : null
    ) : (
      <Navigate to="/sign-in" state={{ backUrl: pathname }} />
    )
  )
}


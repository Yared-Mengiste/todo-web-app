import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "../features/auth/authSlice";
import Login from "../features/auth/Login";

function App() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    if (token) {
      dispatch(getUser());
    }
  }, [token, dispatch]);

  return (<><Login /> </>
    // your routes here
  );
}

export default App;

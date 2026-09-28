import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  getCurrentUser,
  refreshAccessToken,
} from "../../services/auth.service.js";
import {
  clearCredentials,
  setCredentials,
} from "../../store/slices/authSlice.js";

let authenticationCheckPromise;

export default function AuthBootstrap({ children }) {
  const dispatch = useDispatch();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    let isActive = true;

    if (!authenticationCheckPromise) {
      authenticationCheckPromise = (async () => {
        try {
          const refreshResponse = await refreshAccessToken();
          const accessToken = refreshResponse.data?.data?.accessToken;

          if (!accessToken) {
            throw new Error(
              "The refresh response did not include an access token.",
            );
          }

          const userResponse = await getCurrentUser(accessToken);
          const user = userResponse.data?.data;

          if (!user) {
            throw new Error(
              "The current-user response did not include a user.",
            );
          }

          dispatch(setCredentials({ user, accessToken }));
        } catch {
          dispatch(clearCredentials());
        }
      })();
    }

    authenticationCheckPromise.then(() => {
      if (isActive) {
        setIsInitializing(false);
      }
    });

    return () => {
      isActive = false;
    };
  }, [dispatch]);

  if (isInitializing) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white">
        <div className="flex flex-col items-center gap-4" role="status">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-slate-700 border-t-orange-500" />
          <p className="text-sm text-slate-300">Restoring your session...</p>
        </div>
      </main>
    );
  }

  return children;
}

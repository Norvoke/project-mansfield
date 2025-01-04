/* Implementing a user key which each username will hold individually

  We will see how we can pesent such as a prop or some other includable
  and passable data
*/

import { useEffect } from "react";
import { useRouter } from "next/router";
import { signIn, signOut, useSession } from "next-auth/react";
import PropTypes from "prop-types";

export default function LoginWidget({ setUserID }) {
  const { data: session } = useSession();
  const router = useRouter();

  const buttonStyle = {
    padding: "20px 20px",
    fontSize: "20px",
    fontWeight: "bold",
    color: "#fff",
    backgroundColor: "#4287f5",
    border: "2px solid light grey",
    borderRadius: "10px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  };

  const buttonHoverStyle = {
    backgroundColor: "#45a049",
  };

  const handleMouseOver = (e) => {
    Object.assign(e.target.style, buttonHoverStyle);
  };

  const handleMouseOut = (e) => {
    Object.assign(e.target.style, { backgroundColor: "#4287f5" });
  };

  useEffect(() => {
    if (session) {
      setUserID(session.user.email);
    }
  });

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      {session ? (
        <div>
          <p>
            <button
              type="button"
              style={buttonStyle}
              onMouseOver={handleMouseOver}
              onMouseOut={handleMouseOut}
              onClick={() => router.push("/building/userPage")}
              data-testid="user-button"
            >
              {session.user.name}&nbsp;
            </button>
            <button
              type="button"
              style={buttonStyle}
              onMouseOver={handleMouseOver}
              onMouseOut={handleMouseOut}
              onClick={() => router.push("/about")}
            >
              About&nbsp;
            </button>
            <button
              type="button"
              onClick={signOut}
              style={buttonStyle}
              onMouseOver={handleMouseOver}
              onMouseOut={handleMouseOut}
            >
              Sign out
            </button>
          </p>
        </div>
      ) : (
        <p>
          <button
            type="button"
            style={buttonStyle}
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
            onClick={() => router.push("/about")}
          >
            About&nbsp;
          </button>
          <button
            type="button"
            onClick={() => signIn("google")}
            style={buttonStyle}
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
          >
            Sign in
          </button>
        </p>
      )}
    </div>
  );
}

LoginWidget.propTypes = {
  setUserID: PropTypes.func,
};

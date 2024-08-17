import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import success from "../assets/images/success.png";
import { Fragment } from "react";

const VerifyEmail = () => {
  const [validUrl, setValidUrl] = useState(true);
  const { id, token } = useParams(); // Destructure parameters directly
  const isMounted = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmailUrl = async () => {
      try {
        const url = `http://localhost:5500/api/user/${id}/verify/${token}`;
        const { data } = await axios.get(url);
        console.log(data);
        if (isMounted.current) {
          setValidUrl(true);
          // Redirect after a short delay to allow state update
          setTimeout(() => navigate("/login"), 2000);
        }
      } catch (error) {
        console.error("Verification failed:", error);
        if (isMounted.current) {
          setValidUrl(false);
        }
      }
    };

    verifyEmailUrl();

    // Cleanup function to avoid setting state on an unmounted component
    return () => {
      isMounted.current = false;
    };
  }, [id, token, navigate]);

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#f0f4f7',
    textAlign: 'center',
  };

  const imageStyle = {
    width: '100px',
    height: '100px',
  };

  const headingStyle = {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#333',
  };

  return (
    <Fragment>
      {validUrl ? (
        <div style={containerStyle}>
          <img src={success} alt="Success" style={imageStyle} />
          <h1 style={headingStyle}>Email verified successfully</h1>
          {/* Removed Link button, as redirection is handled programmatically */}
        </div>
      ) : (
        <div style={containerStyle}>
          <h1 style={headingStyle}>404 Not Found</h1>
          <p>The link may be invalid or expired. Please check your email for a valid verification link.</p>
        </div>
      )}
    </Fragment>
  );
};

export default VerifyEmail;

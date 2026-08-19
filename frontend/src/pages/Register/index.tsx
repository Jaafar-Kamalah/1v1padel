import "./index.css";

function Register() {
  return (
    <>
      <div className="card">
        <h1>Enter Your Email and a Password</h1>
        <div className="input-group">
          <input type="email" placeholder="Email"/>
        </div>
        <div className="input-group">
          <input type="password" placeholder="Password" />
        </div>
        <button>Continue</button>
      </div>
    </>
  );
}

export default Register;


import SignIn from "./SignIn";
import SignUp from "./SignUp";

const LoginSignupModal = () => {
  return (
    
    <div className="modal-content bg-zinc-800 p-2 scrollbar-hide" id="loginmodal">
      {/* <div className="modal-header" style={{ justifyContent: "center",marginBottom:"10px"}}>
        <h5 className="modal-title" id="exampleModalToggleLabel"
          style={{
            flex: "1",
            textAlign: "center",
            marginBottom:"10px"
          }}
        >
          Welcome to Zero Brokerage.ae
        </h5>
        <button
          type="button"
          className="btn-closed"
          data-bs-dismiss="modal"
          aria-label="Close"
          style={{
            marginBottom:"10px"
          }}
        />
      </div> */}
      {/* End header */}

      <div className="modal-body px-2" >
        <div className="log-reg-form">
          <div className="navtab-style2">
            <nav>
              <div className="nav nav-tabs mb20" id="nav-tab" role="tablist">
                <h3
                className="w-full text-center p-2"
                >
                  Sign In
                </h3>
                {/* <button
                  className="nav-link fw600"
                  id="nav-profile-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#nav-profile"
                  type="button"
                  role="tab"
                  aria-controls="nav-profile"
                  aria-selected="false"
                >
                  New Account
                </button> */}
              </div>
            </nav>
            {/* End nav tab items */}

            <div className="tab-content" id="nav-tabContent2">
              <div
                className="tab-pane fade show active fz15"
                id="nav-home"
                role="tabpanel"
                aria-labelledby="nav-home-tab"
              >
                <SignIn />
              </div>
              {/* End signin content */}

              {/* <div
                className="tab-pane fade fz15"
                id="nav-profile"
                role="tabpanel"
                aria-labelledby="nav-profile-tab"
              >
                <SignUp />
              </div> */}
              {/* End signup content */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginSignupModal;

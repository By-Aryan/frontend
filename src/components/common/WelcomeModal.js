"use client";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import dynamic from 'next/dynamic';

const Select = dynamic(() => import('react-select'), { ssr: false });

const WelcomeModal = ({ showModal, setShowModal }) => {
  const router = useRouter();
  const modalRef = useRef(null);
  const backdropRef = useRef([]);
  
  useEffect(() => {
    if (typeof window !== "undefined" && showModal && modalRef.current) {
      import("bootstrap/dist/js/bootstrap.bundle.min")
        .then((bootstrap) => {
          const modal = new bootstrap.Modal(modalRef.current);
          modal.show();

          modalRef.current.addEventListener("hidden.bs.modal", () => {
            // Remove all modal backdrops
            backdropRef.current.forEach((backdrop) => backdrop.remove());
            backdropRef.current = []; // Clear the ref array after removing backdrops
          });
        })
        .catch((error) => console.error("Bootstrap Modal Error:", error));
    }
  }, [showModal]);

  const handleCreateAccount = () => {
    router.push("/register"); // Redirect to signup page
  };

  const handleContinueAs = (role) => {
   localStorage.setItem("role", role)
   localStorage.setItem("firstVisit" , "true")
    
  }


  return (
    <div className="modal fade" id="welcomeModal" ref={modalRef} tabIndex={-1} aria-hidden="true"  data-bs-backdrop="static" >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">

          <div className="modal-body ">
            <h4 className="text-center mb-5">Continue as</h4>
            <div className="d-flex justify-content-center gap-3">
              {/* <button className="ud-btn btn-white" data-bs-dismiss="modal" onClick={handleCreateAccount}>
                Create an Account
              </button> */}

              <button
                className="ud-btn btn-white"
                data-bs-dismiss="modal"
                onClick={()=>{handleContinueAs("seller"); handleCreateAccount()}}
              >
                Seller                                                                  
              </button>
              <button
                className="ud-btn btn-white"
                data-bs-dismiss="modal"
                onClick={()=>{handleContinueAs("buyer"); handleCreateAccount()}}
              >
                Buyer
              </button>
              <button
                className="ud-btn btn-white"
                data-bs-dismiss="modal"
                onClick={()=>{handleContinueAs("guest")}}
              >
                Guest                                                                                                                                                                                                                                                     
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeModal;

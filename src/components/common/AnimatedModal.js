"use client"
import { forwardRef, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import styles from "../../../public/css/AnimatedModal.module.css"
import Link from "next/link";

const AnimatedModal = forwardRef(({ show, handleClose }, ref) => {
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedInterestedIn, setSelectedInterestedIn] = useState(null);
  const [showAccountOptionModal, setShowAccountOptionModal] = useState(false);

  const handleSelection = (role) => {
    setSelectedRole(role);
    if(role){
      localStorage.setItem("role", role)
    }
  };

  const handleInterestedIn = (interestedIn) => {
    setSelectedInterestedIn(interestedIn);
    if(interestedIn){
      localStorage.setItem("interestedIn", interestedIn);
      if(selectedRole === "seller"){
        setShowAccountOptionModal(true); // Show the account option modal
        return
      }
      handleClose();
    }
  }

  const handleAccountOption = (option) => {
    // Store the selected account creation option
    localStorage.setItem("accountCreationOption", option);
    handleClose(); // Close all modals
    setShowAccountOptionModal(false);
    
    // You can add additional logic here based on the selected option
    console.log({
      role: selectedRole,
      interest: selectedInterestedIn,
      accountOption: option
    });
  }

  return (
    <>
      {/* First Modal - Role Selection */}
      <Modal ref={ref} show={show} centered>
        <Modal.Body className={styles.modalBody}>
          <h4 className="text-center mb-4">
            {!selectedRole ? "Continue as" : `Continue as ${selectedRole}`}
          </h4>

          <div className={styles.buttonContainer}>
            {!selectedRole ? (
              <>
                <button className="ud-btn btn-white text-nowrap" onClick={() => handleSelection("seller")}>
                  Seller
                </button>
                <button className="ud-btn btn-white text-nowrap" onClick={() => handleSelection("buyer")}>
                  Buyer
                </button>
              </>
            ) : (
              <>
                {selectedRole === "seller" ? (
                  <>
                    <button className="ud-btn btn-white text-nowrap" onClick={() => handleInterestedIn("List a property for sell")}>
                      List a Property for Sale
                    </button>
                    <button className="ud-btn btn-white text-nowrap" onClick={() => handleInterestedIn("List a property for Rent")}>
                      List a Property for Rent
                    </button>
                  </>
                ) : (
                  <>
                    <button className="ud-btn btn-white text-nowrap" onClick={() => handleInterestedIn("purchase a property")}>
                      Purchase a Property
                    </button>
                    <button className="ud-btn btn-white text-nowrap" onClick={() => handleInterestedIn("rent a property")}>
                      Rent a Property
                    </button>
                  </>
                )}
              </>
            )}
          </div>
        </Modal.Body>
      </Modal>

    {/* Second Modal - Account Creation Option */}
      {selectedRole === "seller"&&<Modal show={showAccountOptionModal} onHide={() => setShowAccountOptionModal(false)} centered>
        <Modal.Body className={styles.modalBody}>
          <h4 className="text-center mb-4">How would you like to proceed?</h4>
          <div className={styles.buttonContainer}>
            <button 
              className="ud-btn btn-white text-nowrap"
              onClick={() => handleAccountOption("createAccount")}
            >
              Create Account
            </button>
            <Link
            href={"/submit-details"} 
              className="ud-btn btn-white text-nowrap px-2" 
              style={{width : ""}}
              onClick={() => handleAccountOption("agentCreateAccount")}
            >
              Let Agent Create Account
            </Link>
          </div>
        </Modal.Body>
      </Modal>}
    </>
  );
});

export default AnimatedModal;
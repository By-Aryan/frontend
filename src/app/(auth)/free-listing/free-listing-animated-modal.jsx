"use client";
import { forwardRef, useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import styles from "../../../../public/css/AnimatedModal.module.css";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const FreeListingAnimatedModal = forwardRef(({ show, handleClose }, ref) => {
  const pathname = usePathname();
  const router = useRouter;
  const [selectedInterestedIn, setSelectedInterestedIn] = useState(null);
  const [showAccountOptionModal, setShowAccountOptionModal] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const selectedRole = "seller"; // Hardcoded role

  useEffect(() => {
    // Only show modal if on the right path
    if (pathname === "/free-listing") {
      setShowModal(true);
      localStorage.setItem("role", selectedRole);
    }
  }, [pathname]);

  const handleInterestedIn = (interestedIn) => {
    setSelectedInterestedIn(interestedIn);
    if (interestedIn) {
      localStorage.setItem("interestedIn", interestedIn);
      setShowAccountOptionModal(true);
    }
  };

  const handleCloseAllModals = () => {
    setShowModal(false);
    setShowAccountOptionModal(false);
    handleClose?.(); // optional chaining in case it's undefined
  };

  const handleAccountOption = (option) => {
    localStorage.setItem("accountCreationOption", option);
    handleCloseAllModals();
    console.log({
      role: selectedRole,
      interest: selectedInterestedIn,
      accountOption: option,
    });
  };

  return (
    <>
      {/* Seller Options Modal */}
      <Modal ref={ref} show={showModal && !showAccountOptionModal} centered>
        <Modal.Body className={styles.modalBody}>
          <h4 className="text-center mb-4">What would you like to do?</h4>
          <div className={styles.buttonContainer}>
            <button
              className="ud-btn btn-white text-nowrap"
              onClick={() => handleInterestedIn("List a property for sell")}
            >
              List a Property for Sale
            </button>
            <button
              className="ud-btn btn-white text-nowrap"
              onClick={() => handleInterestedIn("List a property for Rent")}
            >
              List a Property for Rent
            </button>
          </div>
        </Modal.Body>
      </Modal>

      {/* Account Option Modal */}
      <Modal
        show={showAccountOptionModal}
        onHide={handleCloseAllModals}
        centered
      >
        <Modal.Body className={styles.modalBody}>
          <h4 className="text-center mb-4">How would you like to proceed?</h4>
          <div className={styles.buttonContainer}>
            <button
              className="ud-btn btn-white text-nowrap"
              onClick={handleCloseAllModals}
            >
              List Property
            </button>
            <Link
              href={"/agent-listing"}
              className="ud-btn btn-white text-nowrap px-2"
            >
              Let Agent List Property
            </Link>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
});

export default FreeListingAnimatedModal;

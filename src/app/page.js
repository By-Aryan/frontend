// "use client";
// import dynamic from "next/dynamic";
// import Link from "next/link";

// // Dynamically import components from the correct paths
// const Hero = dynamic(() => import("@/components/home/home-v1/hero"), { ssr: false });
// const ApartmentType = dynamic(() => import("@/components/home/home-v1/ApartmentType"), { ssr: false });
// const PropertiesByCities = dynamic(() => import("@/components/home/home-v1/PropertiesByCities"), { ssr: false });
// const Testimonial = dynamic(() => import("@/components/home/home-v1/Testimonial"), { ssr: false });
// const Partner = dynamic(() => import("@/components/common/Partner"), { ssr: false });
// const DefaultHeader = dynamic(() => import("@/components/common/DefaultHeader"), { ssr: false });
// const MobileMenu = dynamic(() => import("@/components/common/mobile-menu"), { ssr: false });
// const Footer = dynamic(() => import("@/components/common/default-footer"), { ssr: false });

// export default function Home() {
//   return (
//     <>
//       {/* Main Header Nav */}
//       <DefaultHeader />
//       {/* End Main Header Nav */}

//       {/* Mobile Nav */}
//       <MobileMenu />
//       {/* End Mobile Nav */}

//       {/* Hero Section */}
//       <section className="hero-section p0 mt0">
//         <div className="container-fluid p0">
//           <div className="row">
//             <div className="col-xxl-11 col-xl-12 mx-auto">
//               <Hero />
//             </div>
//           </div>
//         </div>
//       </section>
//       {/* End Hero Section */}

//       {/* Property Cities Section */}
//       <section className="pt40 pb-0">
//         <div className="container">
//           <PropertiesByCities />
//         </div>
//       </section>
//       {/* End Property Cities Section */}

//       {/* Apartment Types Section */}
//       <section className="why-chose-us bgc-f7 pt-0">
//         <div className="container">
//           <div className="row">
//             <div className="col-lg-12">
//               <div className="main-title text-center">
//                 <h2>Browse By Property Type</h2>
//                 <p className="text">
//                   Find your perfect property from our diverse selection.
//                 </p>
//               </div>
//             </div>
//           </div>
//           <div className="row">
//             <ApartmentType />
//           </div>
//         </div>
//       </section>
//       {/* End Apartment Types Section */}

//       {/* Our Testimonials */}
//       <section className="our-testimonials bgc-f7">
//         <div className="container">
//           <div className="row">
//             <div className="col-lg-12">
//               <div className="main-title text-center mb20">
//                 <h2>Testimonials</h2>
//                 <p className="text">
//                   See what our clients say about us.
//                 </p>
//               </div>
//             </div>
//           </div>
//           <div className="row">
//             <div className="col-lg-12">
//               <div className="testimonial-slider">
//                 <Testimonial />
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
//       {/* End Our Testimonials */}

//       {/* Our Partners */}
//       <section className="our-partners bgc-f7">
//         <div className="container">
//           <div className="row">
//             <div className="col-lg-12">
//               <div className="main-title text-center">
//                 <h2>Trusted By</h2>
//                 <p className="text">
//                   We partner with leading real estate developers and agencies.
//                 </p>
//               </div>
//             </div>
//           </div>
//           <div className="row">
//             <Partner />
//           </div>
//         </div>
//       </section>
//       {/* End Our Partners */}

//       {/* Start Our Footer */}
//       <section className="footer-style1 pt60 pb-0">
//         <Footer />
//       </section>
//       {/* End Our Footer */}
//     </>
//   );
// }

"use client";

import HomePage from "@/components/home/HomePage";

export default function Home() {
  return <HomePage />;
}
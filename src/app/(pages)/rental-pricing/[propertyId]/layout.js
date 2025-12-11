import DefaultHeader from "@/components/common/DefaultHeader";
import Footer from "@/components/common/default-footer";
import MobileMenu from "@/components/common/mobile-menu";

export const metadata = {
  title: "Rental Boost Plans - Zero Brokerage",
  description: "Boost your rental property to reach more tenants and get faster bookings with our rental-specific plans.",
};

export default function RentalPricingLayout({ children }) {
  return (
    <>
      {/* Main Header Nav */}
      <DefaultHeader />
      {/* Mobile Nav  */}
      <MobileMenu />

      {children}

      {/* Our Footer */}
      <Footer />
    </>
  );
}
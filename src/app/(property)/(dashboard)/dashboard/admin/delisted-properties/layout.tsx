import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Delisted Properties - Admin Dashboard",
  description: "Manage all delisted properties in the system",
};

export default function DelistedPropertiesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

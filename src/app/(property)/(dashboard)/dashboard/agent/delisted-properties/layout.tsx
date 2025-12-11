import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Delisted Properties - Agent Dashboard",
  description: "View your properties that have been delisted by admin",
};

export default function AgentDelistedPropertiesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

import Wrapper from "@/components/layout/Wrapper";

export const metadata = {
  title: "New Projects by Country - Zero Brokerage",
  description: "Discover new property development projects filtered by country",
};

export default function ProjectsByCountryLayout({ children }) {
  return <Wrapper>{children}</Wrapper>;
}
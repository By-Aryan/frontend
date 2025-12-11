export default function EditPropertyLayout({ children }) {
  return (
    <div className="dashboard-layout">
      <div className="dashboard-container">
        {children}
      </div>
    </div>
  );
}
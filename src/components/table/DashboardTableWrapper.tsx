function DashboardTableWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="row mt-3">
      <div className="col-xl-12">
        <div className="ps-widget bgc-white bdrs12 default-box-shadow6 mb30 overflow-hidden position-relative">
          {children}
        </div>
      </div>
    </div>
  )
}

export default DashboardTableWrapper
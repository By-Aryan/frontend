import React from 'react'

function DashboardContentWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="dashboard__main pl0-md">
      <div className="dashboard__content bgc-f7">
        {children}
      </div>
    </div>
  )
}

export default DashboardContentWrapper
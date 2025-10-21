'use client'

import { NavBreadcrumb } from '../NavBreadcrumb'

export default function AppDashboardNav({ params: { id } }: { params: { id: string } }) {
  return (
    <div className="flex justify-between items-center">
      <NavBreadcrumb id={id} leaf={'Api Key'}></NavBreadcrumb>
    </div>
  )
}

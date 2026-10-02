import React from 'react'
import './brand.scss'

/** Lambang perusahaan pada sudut kiri atas panel admin. */
export const Icon = () => (
  <svg
    aria-hidden="true"
    className="sbk-brand__mark sbk-brand__mark--small"
    focusable="false"
    viewBox="0 0 64 64"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="sbk-icon-gradient" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0%" stopColor="var(--sbk-brand-light)" />
        <stop offset="100%" stopColor="var(--sbk-brand)" />
      </linearGradient>
    </defs>
    <rect fill="url(#sbk-icon-gradient)" height="64" rx="12" width="64" />
    <path d="M14 46V22l18-10 18 10v24H38V32H26v14z" />
  </svg>
)

export default Icon

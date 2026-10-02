import React from 'react'
import './brand.scss'

/**
 * Lockup merek pada halaman login dan pemulihan kata sandi.
 *
 * Nama perusahaan sengaja ditulis tetap, bukan diambil dari Pengaturan Situs:
 * halaman login harus tetap tampil utuh pada pemasangan baru yang globalnya
 * belum terisi, dan tanpa kueri basis data di halaman publik ini.
 */
export const Logo = () => (
  <div className="sbk-brand">
    <svg
      aria-hidden="true"
      className="sbk-brand__mark"
      focusable="false"
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Id gradasi diberi awalan agar tidak bentrok dengan lambang di
          navigasi, yang memakai berkas gaya yang sama. */}
      <defs>
        <linearGradient id="sbk-logo-gradient" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="var(--sbk-brand-light)" />
          <stop offset="100%" stopColor="var(--sbk-brand)" />
        </linearGradient>
      </defs>
      <rect fill="url(#sbk-logo-gradient)" height="64" rx="12" width="64" />
      <path d="M14 46V22l18-10 18 10v24H38V32H26v14z" />
    </svg>
    <span className="sbk-brand__text">
      <span className="sbk-brand__name">Sabhumi Karya Barito</span>
      <span className="sbk-brand__tagline">Panel Administrasi</span>
    </span>
  </div>
)

export default Logo

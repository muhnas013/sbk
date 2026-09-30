import Link from 'next/link'
import type { ServerProps } from 'payload'
import './dashboard-stats.scss'

/**
 * Ringkasan singkat di bagian atas dashboard panel admin:
 * jumlah konten, pekerjaan yang menunggu tindakan, dan peringatan sertifikasi
 * yang mendekati masa kedaluwarsa.
 */
export const DashboardStats = async ({ payload, user }: ServerProps) => {
  if (!payload || !user) return null

  const ninetyDaysAhead = new Date()
  ninetyDaysAhead.setDate(ninetyDaysAhead.getDate() + 90)

  const [projects, posts, unreadMessages, newApplications, expiringCerts] = await Promise.all([
    payload.count({ collection: 'projects', overrideAccess: true }),
    payload.count({ collection: 'posts', overrideAccess: true }),
    payload.count({
      collection: 'contact-submissions',
      overrideAccess: true,
      where: { isRead: { equals: false } },
    }),
    payload.count({
      collection: 'job-applications',
      overrideAccess: true,
      where: { status: { equals: 'new' } },
    }),
    payload.find({
      collection: 'certifications',
      overrideAccess: true,
      limit: 5,
      depth: 0,
      where: {
        and: [
          { validUntil: { less_than: ninetyDaysAhead.toISOString() } },
          { validUntil: { exists: true } },
        ],
      },
    }),
  ])

  const cards = [
    { label: 'Proyek', value: projects.totalDocs, href: '/admin/collections/projects' },
    { label: 'Berita', value: posts.totalDocs, href: '/admin/collections/posts' },
    {
      label: 'Pesan Belum Dibaca',
      value: unreadMessages.totalDocs,
      href: '/admin/collections/contact-submissions',
      highlight: unreadMessages.totalDocs > 0,
    },
    {
      label: 'Lamaran Baru',
      value: newApplications.totalDocs,
      href: '/admin/collections/job-applications',
      highlight: newApplications.totalDocs > 0,
    },
  ]

  return (
    <div className="sbk-dashboard">
      <div className="sbk-dashboard__grid">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className={`sbk-dashboard__card${card.highlight ? ' sbk-dashboard__card--alert' : ''}`}
          >
            <span className="sbk-dashboard__value">{card.value}</span>
            <span className="sbk-dashboard__label">{card.label}</span>
          </Link>
        ))}
      </div>

      {expiringCerts.totalDocs > 0 && (
        <div className="sbk-dashboard__notice">
          <strong>Perhatian:</strong> {expiringCerts.totalDocs} dokumen legalitas akan kedaluwarsa
          dalam 90 hari ke depan — {expiringCerts.docs.map((doc) => doc.name).join(', ')}.{' '}
          <Link href="/admin/collections/certifications">Periksa sekarang</Link>
        </div>
      )}
    </div>
  )
}

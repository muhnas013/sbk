/**
 * Daftar foto demo: sumber, pemotret, dan lisensinya.
 *
 * Semuanya diambil dari Wikimedia Commons dengan lisensi yang mengizinkan
 * pemakaian ulang selama pemotretnya disebutkan. Berkas hasil unduhan ada di
 * `src/scripts/demo-photos/` dan ikut tersimpan di repositori supaya seeding
 * tidak bergantung pada jaringan. Jalankan `npm run photos` untuk mengunduh
 * ulang — lihat `src/scripts/fetch-demo-photos.ts`.
 *
 * FOTO INI BUKAN DOKUMENTASI PEKERJAAN PERUSAHAAN. Isinya dipilih agar konteks
 * dan warnanya mendekati hasil akhir, lalu diganti foto asli sebelum peluncuran.
 * Daftar atribusi yang siap ditempel ada di `src/scripts/demo-photos/KREDIT.md`.
 */

export type DemoPhoto = {
  /** Nama berkas di Wikimedia Commons. */
  file: string
  /** Pemegang hak cipta seperti tercatat di Commons. */
  author: string
  /** Lisensi — seluruhnya menuntut atribusi, sebagian juga berbagi serupa. */
  license: string
  /** Halaman berkas di Commons, rujukan atribusi. */
  page: string
  /** Foto melebar (hero); sisanya disimpan dengan sisi panjang 1600 px. */
  wide?: boolean
}

export const DEMO_PHOTOS = {
  'beranda-hero': {
    file: 'Sunset on the rising city, Addis Ababa - Flickr - jeanotr.jpg',
    author: 'Jean Rebiffé from Addis Ababa, Ethiopia',
    license: 'CC BY 2.0',
    page: 'https://commons.wikimedia.org/wiki/File:Sunset_on_the_rising_city,_Addis_Ababa_-_Flickr_-_jeanotr.jpg',
    wide: true,
  },
  'tentang-hero': {
    file: 'Jembatan Sei Alalak, Banjarmasin.jpg',
    author: 'Ilham Mufti Laksono',
    license: 'CC BY-SA 4.0',
    page: 'https://commons.wikimedia.org/wiki/File:Jembatan_Sei_Alalak,_Banjarmasin.jpg',
    wide: true,
  },
  'tentang-kami': {
    file: 'District-Nabawan Sabah Land-Surveyors-01.jpg',
    author: 'CEphoto, Uwe Aranas',
    license: 'CC BY-SA 3.0',
    page: 'https://commons.wikimedia.org/wiki/File:District-Nabawan_Sabah_Land-Surveyors-01.jpg',
  },
  'divisi-konstruksi': {
    file: 'Construction workers in Iran 04.jpg',
    author: 'Mostafameraji',
    license: 'CC0',
    page: 'https://commons.wikimedia.org/wiki/File:Construction_workers_in_Iran_04.jpg',
  },
  'divisi-konsultansi': {
    file: 'Baustelle-Hölzla-Rebar-6228085.jpg',
    author: 'Ermell',
    license: 'CC BY-SA 4.0',
    page: 'https://commons.wikimedia.org/wiki/File:Baustelle-H%C3%B6lzla-Rebar-6228085.jpg',
  },
  'divisi-pengadaan': {
    file: 'Container cranes at the MPET- MSC PSA European Terminal in Port of Antwerp (Kieldrecht, Belgium) during the sunset civil twilight (DSCF3919).jpg',
    author: 'Trougnouf',
    license: 'CC BY 4.0',
    page: 'https://commons.wikimedia.org/wiki/File:Container_cranes_at_the_MPET-_MSC_PSA_European_Terminal_in_Port_of_Antwerp_(Kieldrecht,_Belgium)_during_the_sunset_civil_twilight_(DSCF3919).jpg',
  },
  'divisi-jasa-lainnya': {
    file: 'Cape Town (ZA), Waterfront, Kran -- 2024 -- 2907.jpg',
    author: 'Dietmar Rabich',
    license: 'CC BY-SA 4.0',
    page: 'https://commons.wikimedia.org/wiki/File:Cape_Town_(ZA),_Waterfront,_Kran_--_2024_--_2907.jpg',
  },
  'layanan-gedung': {
    file: 'Sunset over Almaty with Construction Crane (AP4M2837 1) (21001847923).jpg',
    author: 'Alexandru Panoiu from Bucharest, Romania',
    license: 'CC BY 2.0',
    page: 'https://commons.wikimedia.org/wiki/File:Sunset_over_Almaty_with_Construction_Crane_(AP4M2837_1)_(21001847923).jpg',
  },
  'layanan-jalan-jembatan': {
    file: 'Taipei Taiwan Taipei-Bridge-01.jpg',
    author: 'CEphoto, Uwe Aranas',
    license: 'CC BY-SA 3.0',
    page: 'https://commons.wikimedia.org/wiki/File:Taipei_Taiwan_Taipei-Bridge-01.jpg',
  },
  'layanan-air': {
    file: 'Sumber Irigasi Sawah.jpg',
    author: 'Rizqi ainur',
    license: 'CC BY-SA 4.0',
    page: 'https://commons.wikimedia.org/wiki/File:Sumber_Irigasi_Sawah.jpg',
  },
  'layanan-perencanaan': {
    file: 'Highway Calumpit railway station construction sites 01.jpg',
    author: 'FBenjr123',
    license: 'CC BY-SA 4.0',
    page: 'https://commons.wikimedia.org/wiki/File:Highway_Calumpit_railway_station_construction_sites_01.jpg',
  },
  'layanan-pengawasan': {
    file: 'Highway Calumpit railway station construction sites 06.jpg',
    author: 'FBenjr123',
    license: 'CC BY-SA 4.0',
    page: 'https://commons.wikimedia.org/wiki/File:Highway_Calumpit_railway_station_construction_sites_06.jpg',
  },
  'layanan-studi-kelayakan': {
    file: '20220810 St. Nikolaikirche Potsdam 19.jpg',
    author: 'Flocci Nivis',
    license: 'CC BY 4.0',
    page: 'https://commons.wikimedia.org/wiki/File:20220810_St._Nikolaikirche_Potsdam_19.jpg',
  },
  'layanan-material': {
    file: 'Amatafari ahiye.jpg',
    author: 'MBERABAHIZI',
    license: 'CC0',
    page: 'https://commons.wikimedia.org/wiki/File:Amatafari_ahiye.jpg',
  },
  'layanan-alat-berat': {
    file: 'Grue (1).jpg',
    author: 'Gzen92',
    license: 'CC BY-SA 4.0',
    page: 'https://commons.wikimedia.org/wiki/File:Grue_(1).jpg',
  },
  'proyek-kantor': {
    file: '2023 (challenge No. 3 - old unpublished pics ) - Day 138 - Scaffoldiing at dusk, Nairobi, Knya 2014 - Flickr - ambabheg.jpg',
    author: 'Forbes Johnston from Winchester, UK',
    license: 'CC BY 2.0',
    page: 'https://commons.wikimedia.org/wiki/File:2023_(challenge_No._3_-_old_unpublished_pics_)_-_Day_138_-_Scaffoldiing_at_dusk,_Nairobi,_Knya_2014_-_Flickr_-_ambabheg.jpg',
  },
  'proyek-jalan': {
    file: 'Hutan Lipur Ulu Bendul.jpg',
    author: 'Wenny Gan',
    license: 'CC BY-SA 4.0',
    page: 'https://commons.wikimedia.org/wiki/File:Hutan_Lipur_Ulu_Bendul.jpg',
  },
  'proyek-irigasi': {
    file: 'Sawah UIN Bukittinggi - HP20.jpg',
    author: 'Librarypio',
    license: 'CC BY-SA 4.0',
    page: 'https://commons.wikimedia.org/wiki/File:Sawah_UIN_Bukittinggi_-_HP20.jpg',
  },
  'proyek-jembatan': {
    file: 'Jembatan Pasar Lama saat malam hari.jpg',
    author: 'Ilham Mufti Laksono',
    license: 'CC BY-SA 4.0',
    page: 'https://commons.wikimedia.org/wiki/File:Jembatan_Pasar_Lama_saat_malam_hari.jpg',
  },
  'proyek-puskesmas': {
    file: 'Grue Potain, Mussidan (nuit).jpg',
    author: 'Cjp24',
    license: 'CC BY-SA 4.0',
    page: 'https://commons.wikimedia.org/wiki/File:Grue_Potain,_Mussidan_(nuit).jpg',
  },
  'proyek-sekolah': {
    file: 'Lyon 3e - Cours Lafayette, chantier Emergence de nuit.jpg',
    author: 'Romainbehar',
    license: 'CC0',
    page: 'https://commons.wikimedia.org/wiki/File:Lyon_3e_-_Cours_Lafayette,_chantier_Emergence_de_nuit.jpg',
  },
  'proyek-material': {
    file: 'Cement bags in Douma.jpg',
    author: 'Alex.Simon89',
    license: 'CC BY 4.0',
    page: 'https://commons.wikimedia.org/wiki/File:Cement_bags_in_Douma.jpg',
  },
  'proyek-drainase': {
    file: 'Senja di Tanahku.jpg',
    author: 'Martinusdeni',
    license: 'CC BY-SA 4.0',
    page: 'https://commons.wikimedia.org/wiki/File:Senja_di_Tanahku.jpg',
  },
  'proyek-pasar': {
    file: '2020-08-02-Neubaugebiet Efferen West-0025.jpg',
    author: 'Superbass',
    license: 'CC BY-SA 4.0',
    page: 'https://commons.wikimedia.org/wiki/File:2020-08-02-Neubaugebiet_Efferen_West-0025.jpg',
  },
  'kerja-gedung-1': {
    file: 'Buger Brücke Neubau Schalung-20240218-RM-102143.jpg',
    author: 'Reinhold Möller Ermell',
    license: 'CC BY-SA 4.0',
    page: 'https://commons.wikimedia.org/wiki/File:Buger_Br%C3%BCcke_Neubau_Schalung-20240218-RM-102143.jpg',
  },
  'kerja-gedung-2': {
    file: '20221029 St. Georg Freising 09.jpg',
    author: 'Flocci Nivis',
    license: 'CC BY 4.0',
    page: 'https://commons.wikimedia.org/wiki/File:20221029_St._Georg_Freising_09.jpg',
  },
  'kerja-gedung-3': {
    file: 'München Freiham - Baustelle Bildungscampus.jpg',
    author: 'Patrick Oberdörfer',
    license: 'CC BY-SA 4.0',
    page: 'https://commons.wikimedia.org/wiki/File:M%C3%BCnchen_Freiham_-_Baustelle_Bildungscampus.jpg',
  },
  'kerja-gedung-4': {
    file: 'Drammen havn illuminated crane (1).jpg',
    author: 'Peulle',
    license: 'CC BY-SA 4.0',
    page: 'https://commons.wikimedia.org/wiki/File:Drammen_havn_illuminated_crane_(1).jpg',
  },
  'kerja-gedung-5': {
    file: 'MiQua Köln - Luftaufnahme-0294.jpg',
    author: 'Raimond Spekking',
    license: 'CC BY-SA 4.0',
    page: 'https://commons.wikimedia.org/wiki/File:MiQua_K%C3%B6ln_-_Luftaufnahme-0294.jpg',
  },
  'kerja-gedung-6': {
    file: 'Drammen havn blue cranes (2).jpg',
    author: 'Peulle',
    license: 'CC BY-SA 4.0',
    page: 'https://commons.wikimedia.org/wiki/File:Drammen_havn_blue_cranes_(2).jpg',
  },
  'kerja-gedung-7': {
    file: 'Grue Potain, Mussidan (nuit).jpg',
    author: 'Cjp24',
    license: 'CC BY-SA 4.0',
    page: 'https://commons.wikimedia.org/wiki/File:Grue_Potain,_Mussidan_(nuit).jpg',
  },
  'kerja-gedung-8': {
    file: 'A building at the corner of Colombo and Salisbury Street, Christchurch, New Zealand 08.jpg',
    author: 'Michal Klajban',
    license: 'CC BY-SA 4.0',
    page: 'https://commons.wikimedia.org/wiki/File:A_building_at_the_corner_of_Colombo_and_Salisbury_Street,_Christchurch,_New_Zealand_08.jpg',
  },
  'kerja-jalan-1': {
    file: 'Buttenheim Brücke Aerial view-20230407-RM-172412.jpg',
    author: 'Ermell',
    license: 'CC BY-SA 4.0',
    page: 'https://commons.wikimedia.org/wiki/File:Buttenheim_Br%C3%BCcke_Aerial_view-20230407-RM-172412.jpg',
  },
  'kerja-jalan-2': {
    file: 'Buttenheim Brücke Aerial view-20230625-RM-152025.jpg',
    author: 'Ermell',
    license: 'CC BY-SA 4.0',
    page: 'https://commons.wikimedia.org/wiki/File:Buttenheim_Br%C3%BCcke_Aerial_view-20230625-RM-152025.jpg',
  },
  'kerja-jalan-3': {
    file: 'Lansing (Black Hawk Bridge) construction and closure.jpg',
    author: 'Wikideas1',
    license: 'CC0',
    page: 'https://commons.wikimedia.org/wiki/File:Lansing_(Black_Hawk_Bridge)_construction_and_closure.jpg',
  },
  'kerja-jalan-4': {
    file: 'Construction on the road at night.jpg',
    author: 'Matthew Henry',
    license: 'CC0',
    page: 'https://commons.wikimedia.org/wiki/File:Construction_on_the_road_at_night.jpg',
  },
  'kerja-jalan-5': {
    file: 'Buttenheim Brücke Aerial view-20230625-RM-151636.jpg',
    author: 'Ermell',
    license: 'CC BY-SA 4.0',
    page: 'https://commons.wikimedia.org/wiki/File:Buttenheim_Br%C3%BCcke_Aerial_view-20230625-RM-151636.jpg',
  },
  'kerja-air-1': {
    file: 'Pohon Pengantin Salatiga (4).jpg',
    author: 'Mas Ulf',
    license: 'CC BY-SA 4.0',
    page: 'https://commons.wikimedia.org/wiki/File:Pohon_Pengantin_Salatiga_(4).jpg',
  },
  'kerja-air-2': {
    file: 'Sunset dengan sawah hijau.jpg',
    author: 'Civiaaurel',
    license: 'CC BY-SA 4.0',
    page: 'https://commons.wikimedia.org/wiki/File:Sunset_dengan_sawah_hijau.jpg',
  },
  'kerja-air-3': {
    file: 'Gunung Sawah & Senja.jpg',
    author: 'Munaqo',
    license: 'CC BY-SA 4.0',
    page: 'https://commons.wikimedia.org/wiki/File:Gunung_Sawah_%26_Senja.jpg',
  },
  'kerja-air-4': {
    file: 'Ташкент, канал Салар у Мироншаха.jpg',
    author: 'Nikolai Bulykin',
    license: 'CC BY-SA 4.0',
    page: 'https://commons.wikimedia.org/wiki/File:%D0%A2%D0%B0%D1%88%D0%BA%D0%B5%D0%BD%D1%82,_%D0%BA%D0%B0%D0%BD%D0%B0%D0%BB_%D0%A1%D0%B0%D0%BB%D0%B0%D1%80_%D1%83_%D0%9C%D0%B8%D1%80%D0%BE%D0%BD%D1%88%D0%B0%D1%85%D0%B0.jpg',
  },
  'kerja-air-5': {
    file: 'Pekerja Yg Sedang Memperbaiki Saluran Irigasi Di Prembun Kebumen.jpg',
    author: 'DARMAS BS 9',
    license: 'CC BY-SA 4.0',
    page: 'https://commons.wikimedia.org/wiki/File:Pekerja_Yg_Sedang_Memperbaiki_Saluran_Irigasi_Di_Prembun_Kebumen.jpg',
  },
  'kerja-material-1': {
    file: 'Stockage de ciments.JPG',
    author: 'Oussama zrafi',
    license: 'CC BY-SA 3.0',
    page: 'https://commons.wikimedia.org/wiki/File:Stockage_de_ciments.JPG',
  },
  'kerja-material-2': {
    file: 'Mina de Chuquicamata, Calama, Chile, 2016-02-01, DD 125.JPG',
    author: 'Diego Delso',
    license: 'CC BY-SA 4.0',
    page: 'https://commons.wikimedia.org/wiki/File:Mina_de_Chuquicamata,_Calama,_Chile,_2016-02-01,_DD_125.JPG',
  },
  'kerja-material-3': {
    file: 'Komatsu HM300.jpg',
    author: 'JoachimKohler-HB',
    license: 'CC BY-SA 4.0',
    page: 'https://commons.wikimedia.org/wiki/File:Komatsu_HM300.jpg',
  },
  'bangunan-1': {
    file: 'Gedung F-Syariah UIN IB.jpg',
    author: 'AIP2000',
    license: 'CC BY-SA 4.0',
    page: 'https://commons.wikimedia.org/wiki/File:Gedung_F-Syariah_UIN_IB.jpg',
  },
  'bangunan-2': {
    file: 'Gedung Pascasarjana UIN IB.jpg',
    author: 'AIP2000',
    license: 'CC BY-SA 4.0',
    page: 'https://commons.wikimedia.org/wiki/File:Gedung_Pascasarjana_UIN_IB.jpg',
  },
  'bangunan-3': {
    file: 'Puskesmas Pegambiran 2.jpg',
    author: 'Ahsanuz Zikri',
    license: 'CC BY-SA 4.0',
    page: 'https://commons.wikimedia.org/wiki/File:Puskesmas_Pegambiran_2.jpg',
  },
  'bangunan-4': {
    file: 'Puskesmas Buluspesantren I Kab.Kebumen Jateng Indonesia.jpg',
    author: 'SATELIT BM',
    license: 'CC BY-SA 4.0',
    page: 'https://commons.wikimedia.org/wiki/File:Puskesmas_Buluspesantren_I_Kab.Kebumen_Jateng_Indonesia.jpg',
  },
  'bangunan-5': {
    file: 'Gedung DPRD Kota Banjarmasin.jpg',
    author: 'Ilham Mufti Laksono',
    license: 'CC BY 4.0',
    page: 'https://commons.wikimedia.org/wiki/File:Gedung_DPRD_Kota_Banjarmasin.jpg',
  },
  'bangunan-6': {
    file: 'Pasar Tapandang Berseri 002.jpg',
    author: 'Ilham Mufti Laksono',
    license: 'CC BY-SA 4.0',
    page: 'https://commons.wikimedia.org/wiki/File:Pasar_Tapandang_Berseri_002.jpg',
  },
  'berita-1': {
    file: 'MiQua Köln - Luftaufnahme-0294.jpg',
    author: 'Raimond Spekking',
    license: 'CC BY-SA 4.0',
    page: 'https://commons.wikimedia.org/wiki/File:MiQua_K%C3%B6ln_-_Luftaufnahme-0294.jpg',
  },
  'berita-2': {
    file: 'Road Construction at night.jpg',
    author: 'Deo photographer',
    license: 'CC BY-SA 4.0',
    page: 'https://commons.wikimedia.org/wiki/File:Road_Construction_at_night.jpg',
  },
  'berita-3': {
    file: 'Buttenheim Brücke Aerial view-20230407-RM-172716.jpg',
    author: 'Ermell',
    license: 'CC BY-SA 4.0',
    page: 'https://commons.wikimedia.org/wiki/File:Buttenheim_Br%C3%BCcke_Aerial_view-20230407-RM-172716.jpg',
  },
  'berita-4': {
    file: 'Pekerjaan Menurunkan Batu Bata Dari Mobil Pengangkut.jpg',
    author: 'SATELIT BM',
    license: 'CC BY-SA 4.0',
    page: 'https://commons.wikimedia.org/wiki/File:Pekerjaan_Menurunkan_Batu_Bata_Dari_Mobil_Pengangkut.jpg',
  },
  'berita-5': {
    file: 'Aerial view at construction site at Chenab Bridge.jpg',
    author: 'Ojhayogesh',
    license: 'CC BY-SA 4.0',
    page: 'https://commons.wikimedia.org/wiki/File:Aerial_view_at_construction_site_at_Chenab_Bridge.jpg',
  },
} as const satisfies Record<string, DemoPhoto>

export type DemoPhotoKey = keyof typeof DEMO_PHOTOS

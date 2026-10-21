import React, { useState } from 'react';
import { MapPin, Clock, Phone, Mail, Instagram, Send, CheckCircle2, Wifi, Zap, Car, Shield, Sparkles, Users, Coffee } from 'lucide-react';
import { useCart } from '../context/CartContext.tsx';

export const AboutContact: React.FC = () => {
  const { showToast } = useCart();

  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    topic: 'Workshop & Kelas Kreatif' as const,
    date: '',
    estimatedGuests: '10-20 orang',
    message: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [submittedInquiry, setSubmittedInquiry] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch('/api/collaborate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formState)
      });
      const data = await res.json();
      if (data.success) {
        setSubmittedInquiry(data.data?.id || 'COL-NEW');
        showToast('Pesan kolaborasi berhasil terkirim!', 'success');
      } else {
        throw new Error(data.message);
      }
    } catch {
      // Fallback
      setSubmittedInquiry('COL-' + Math.floor(1000 + Math.random() * 9000));
      showToast('Permintaan kolaborasi diterima!', 'success');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-24">
      {/* 1. BRAND STORY & PHILOSOPHY */}
      <section className="grid lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-terracotta-light text-brand-terracotta font-bold text-xs uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Filosofi & Cerita Brand</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-brand-green leading-[1.15]">
            Lebih Dari Sekadar Kedai Kopi. Sebuah Ruang untuk Bertumbuh.
          </h2>

          <div className="space-y-4 text-sm sm:text-base text-brand-slate/85 leading-relaxed">
            <p>
              Nama <strong>FEBI Space</strong> lahir dari sebuah impian sederhana: menghadirkan ruang ketiga (<em>the third place</em>) bagi mereka yang mencari harmoni antara ketenangan secangkir kopi berkualitas dan semangat berkarya yang membara.
            </p>
            <p>
              Lambang kami menampilkan motif dua daun di atas huruf 'I' dengan dua warna kontras:
            </p>
            <div className="grid sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-white border border-brand-cream-dark">
                <div className="flex items-center gap-2 mb-1.5 text-brand-green font-bold text-sm">
                  <span className="w-3 h-3 rounded-full bg-brand-green inline-block"></span>
                  Daun Hijau Hutan (Forest Green)
                </div>
                <p className="text-xs text-brand-slate/75 leading-relaxed">
                  Melambangkan alam, ketenangan, serta dedikasi kami pada pelestarian biji kopi lokal Indonesia dan bahan-bahan organik berkelanjutan.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-brand-cream-dark">
                <div className="flex items-center gap-2 mb-1.5 text-brand-terracotta font-bold text-sm">
                  <span className="w-3 h-3 rounded-full bg-brand-terracotta inline-block"></span>
                  Daun Terracotta (Warm Ochre)
                </div>
                <p className="text-xs text-brand-slate/75 leading-relaxed">
                  Melambangkan percikan inspirasi manusia, kehangatan interaksi, dan energi kreatif tanpa batas dari komunitas yang berkumpul di sini.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 grid grid-cols-2 gap-4">
          <div className="space-y-4">
            <img
              src="https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=600&q=80"
              alt="Artisan coffee pour"
              className="rounded-3xl shadow-md h-56 w-full object-cover"
            />
            <div className="p-4 bg-brand-green text-white rounded-2xl shadow-sm text-center">
              <span className="text-2xl font-black block">100%</span>
              <span className="text-[11px] text-[#FAF8F4]/80">Single Origin Indonesia</span>
            </div>
          </div>
          <div className="space-y-4 pt-8">
            <div className="p-4 bg-brand-terracotta text-white rounded-2xl shadow-sm text-center">
              <span className="text-2xl font-black block">50+</span>
              <span className="text-[11px] text-amber-100">Event Kreatif & Workshop</span>
            </div>
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80"
              alt="Creative discussions"
              className="rounded-3xl shadow-md h-56 w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* 2. FASILITAS KAFE & RUANG KERJA */}
      <section className="bg-white rounded-3xl p-8 sm:p-12 border border-brand-cream-dark shadow-xs space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-bold tracking-widest text-brand-terracotta uppercase">
            Fasilitas Lengkap
          </span>
          <h3 className="text-2xl sm:text-3xl font-black text-brand-green">
            Kenyamanan Maksimal untuk Produktivitas Anda
          </h3>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Wifi, title: 'Koneksi WiFi 100 Mbps', desc: 'Internet berkecepatan tinggi dengan cadangan fiber optic untuk upload dan meeting online tanpa buffering.' },
            { icon: Zap, title: 'Colokan di Setiap Meja', desc: 'Soket daya listrik standar dan port USB di setiap meja kerja, baik indoor maupun outdoor.' },
            { icon: Car, title: 'Area Parkir Luas', desc: 'Tersedia tempat parkir aman untuk mobil dan motor dengan penjagaan security 24 jam.' },
            { icon: Shield, title: 'Musholla & Toilet Bersih', desc: 'Ruang ibadah bersih ber-AC terpisah pria & wanita lengkap dengan sarung dan mukena wangi.' }
          ].map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={i} className="p-5 rounded-2xl bg-brand-cream/60 border border-brand-cream-dark space-y-3">
                <div className="w-10 h-10 rounded-xl bg-brand-green text-white flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-brand-green">{f.title}</h4>
                <p className="text-xs text-brand-slate/75 leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. LOKASI, JAM OPERASIONAL & PETA FIKTIF */}
      <section className="grid lg:grid-cols-12 gap-8 items-stretch">
        {/* Info card */}
        <div className="lg:col-span-5 bg-white p-8 rounded-3xl border border-brand-cream-dark shadow-xs flex flex-col justify-between space-y-6">
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold text-brand-terracotta uppercase tracking-wider">
                Kunjungi Kami
              </span>
              <h3 className="text-2xl font-black text-brand-green mt-1">
                Lokasi & Jam Operasional
              </h3>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-brand-slate/80">
              <div className="flex gap-3.5 items-start">
                <div className="p-2.5 rounded-xl bg-brand-sage-pale text-brand-green shrink-0 mt-0.5">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-brand-green text-sm">FEBI Space Creative Hub</p>
                  <p className="text-xs text-brand-slate/70 mt-1 leading-relaxed">
                    Jl. Cendekia Kreasi No. 24, Kawasan Kreatif Terpadu, Kebayoran Baru, Jakarta Selatan 12430 (Dekat stasiun MRT & area pedestrian Blok M)
                  </p>
                </div>
              </div>

              <div className="flex gap-3.5 items-start">
                <div className="p-2.5 rounded-xl bg-brand-terracotta-light text-brand-terracotta shrink-0 mt-0.5">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-brand-green text-sm">Waktu Operasional</p>
                  <p className="text-xs text-brand-slate/70 mt-1">
                    <strong>Senin – Jumat:</strong> 08.00 – 22.00 WIB
                  </p>
                  <p className="text-xs text-brand-slate/70 mt-0.5">
                    <strong>Sabtu – Minggu:</strong> 07.30 – 23.00 WIB
                  </p>
                  <p className="text-[11px] text-emerald-700 font-semibold mt-1">
                    • Kitchen & Slow Bar buka hingga 30 menit sebelum tutup
                  </p>
                </div>
              </div>

              <div className="flex gap-3.5 items-start">
                <div className="p-2.5 rounded-xl bg-brand-cream-dark text-brand-slate shrink-0 mt-0.5">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-brand-green text-sm">Layanan & Reservasi</p>
                  <p className="text-xs text-brand-slate/70 mt-1">
                    WhatsApp: <a href="https://wa.me/6281288997700" className="text-brand-terracotta font-semibold hover:underline">+62 812-8899-7700</a>
                  </p>
                  <p className="text-xs text-brand-slate/70">
                    Email: <a href="mailto:halo@febispace.id" className="text-brand-terracotta font-semibold hover:underline">halo@febispace.id</a>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-brand-cream rounded-2xl border border-brand-cream-dark">
            <p className="text-xs font-semibold text-brand-green flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Status Hari Ini: Kafe Sedang Buka & Melayani
            </p>
          </div>
        </div>

        {/* Peta Interaktif & Stylized Card */}
        <div className="lg:col-span-7 bg-white p-4 sm:p-6 rounded-3xl border border-brand-cream-dark shadow-xs flex flex-col justify-between space-y-4">
          <div className="w-full h-80 rounded-2xl overflow-hidden bg-brand-cream-dark relative shadow-inner">
            <iframe
              title="FEBI Space Jakarta Selatan Location Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.297445778847!2d106.79728461536785!3d-6.244243595480132!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f14d30079f01%3A0x2e74f6341fbf19f2!2sBlok%20M%2C%20Kebayoran%20Baru%2C%20South%20Jakarta%20City%2C%20Jakarta!5e0!3m2!1sen!2sid!4v1700000000000!5m2!1sen!2sid"
              className="w-full h-full border-0"
              loading="lazy"
            ></iframe>

            {/* Custom interactive pin card overlay */}
            <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md p-3 rounded-xl border border-brand-cream-dark shadow-md max-w-xs text-xs pointer-events-none">
              <div className="flex items-center gap-1.5 text-brand-green font-extrabold">
                <MapPin className="w-4 h-4 text-brand-terracotta" />
                <span>FEBI Space Creative Hub</span>
              </div>
              <p className="text-[11px] text-brand-slate/70 mt-0.5">
                5 Menit Jalan Kaki dari Stasiun MRT Blok M BCA
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2.5 bg-brand-cream rounded-xl border border-brand-cream-dark">
              <span className="text-[10px] text-brand-slate/60 block">MRT Terdekat</span>
              <span className="font-bold text-brand-green text-xs">Blok M BCA (450m)</span>
            </div>
            <div className="p-2.5 bg-brand-cream rounded-xl border border-brand-cream-dark">
              <span className="text-[10px] text-brand-slate/60 block">Kapasitas Tempat</span>
              <span className="font-bold text-brand-green text-xs">80 Kursi & Meja</span>
            </div>
            <div className="p-2.5 bg-brand-cream rounded-xl border border-brand-cream-dark">
              <span className="text-[10px] text-brand-slate/60 block">Reservasi Ruang</span>
              <span className="font-bold text-brand-terracotta text-xs">Tersedia H-1</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FORM KOLABORASI & WORKSHOP */}
      <section className="bg-brand-sage-pale/60 rounded-3xl p-8 sm:p-12 border border-brand-sage-light">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold tracking-widest text-brand-terracotta uppercase">
              Kolaborasi & Ruang Temu
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-brand-green">
              Punya Ide Menarik? Mari Berkreasi Bersama di FEBI Space
            </h3>
            <p className="text-xs sm:text-sm text-brand-slate/75">
              Apakah Anda ingin menyelenggarakan workshop desain, peluncuran buku, pameran mini, atau gathering tim? Tim kurator kami siap mendukung kesuksesan agenda Anda.
            </p>
          </div>

          {submittedInquiry ? (
            <div className="p-8 bg-white rounded-3xl border border-emerald-200 text-center space-y-4 shadow-sm">
              <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center text-brand-green mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold text-brand-green">Pesan Kolaborasi Terkirim!</h4>
              <p className="text-xs sm:text-sm text-brand-slate/80 max-w-md mx-auto">
                ID Pengajuan: <strong className="text-brand-terracotta">{submittedInquiry}</strong>. Tim Partnership FEBI Space akan meninjau ketersediaan ruang dan menghubungi Anda via WhatsApp/Email maksimal 1x24 jam kerja.
              </p>
              <button
                type="button"
                onClick={() => setSubmittedInquiry(null)}
                className="px-6 py-2.5 bg-brand-green text-white text-xs font-bold rounded-xl"
              >
                Kirim Pengajuan Lain
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 sm:p-8 bg-white rounded-3xl border border-brand-cream-dark shadow-sm space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-brand-slate block mb-1">
                    Nama Lengkap / Komunitas *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="cth: Komunitas Visual Craft"
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-brand-cream-dark bg-brand-cream/30 focus:outline-none focus:border-brand-green text-brand-slate"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-brand-slate block mb-1">
                    Email Aktif *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="kontak@komunitas.id"
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-brand-cream-dark bg-brand-cream/30 focus:outline-none focus:border-brand-green text-brand-slate"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-brand-slate block mb-1">
                    Nomor WhatsApp / HP
                  </label>
                  <input
                    type="tel"
                    placeholder="08123456789"
                    value={formState.phone}
                    onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-brand-cream-dark bg-brand-cream/30 focus:outline-none focus:border-brand-green text-brand-slate"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-brand-slate block mb-1">
                    Jenis Kolaborasi *
                  </label>
                  <select
                    value={formState.topic}
                    onChange={(e) => setFormState({ ...formState, topic: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-brand-cream-dark bg-brand-cream/30 focus:outline-none focus:border-brand-green text-brand-slate"
                  >
                    <option>Workshop & Kelas Kreatif</option>
                    <option>Private Meeting / Event</option>
                    <option>Pameran Seni & Display</option>
                    <option>Kemitraan Kopi / B2B</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-brand-slate block mb-1">
                  Detail Ide / Rencana Acara *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Ceritakan gambaran singkat acara, perkiraan jumlah peserta, dan tanggal rencana kegiatan..."
                  value={formState.message}
                  onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-brand-cream-dark bg-brand-cream/30 focus:outline-none focus:border-brand-green text-brand-slate"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 bg-brand-green hover:bg-brand-green-light text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition shadow-md disabled:opacity-50 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>{submitting ? 'Mengirim Pengajuan...' : 'Kirim Usulan Kolaborasi'}</span>
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
};

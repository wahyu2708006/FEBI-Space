import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { INITIAL_MENU_ITEMS, INITIAL_TESTIMONIALS } from './src/data/mockData.ts';
import { MenuItem, Order, CollaborationInquiry, OrderStatus } from './src/types/index.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In-memory persistent database collections
let menuList: MenuItem[] = [...INITIAL_MENU_ITEMS];
let ordersList: Order[] = [
  {
    id: 'FEB-782194',
    customerName: 'Sarah Adelia',
    phone: '081288991234',
    email: 'sarah.adelia@gmail.com',
    serviceType: 'Dine In',
    tableOrAddress: 'Meja 04 (Area Dalam/Indoor)',
    items: [
      {
        cartItemId: 'menu-1-iced-regular',
        menuItem: INITIAL_MENU_ITEMS[0],
        quantity: 2,
        customization: {
          temperature: 'Iced',
          sweetness: 'Less Sugar (50%)',
          milk: 'Regular Milk',
          specialInstructions: 'Es batu sedikit saja'
        },
        itemPrice: 28000,
        totalPrice: 56000
      },
      {
        cartItemId: 'menu-4-hot',
        menuItem: INITIAL_MENU_ITEMS[3],
        quantity: 1,
        customization: {
          temperature: 'Hot',
          specialInstructions: 'Sourdough dipanggang agak garing'
        },
        itemPrice: 38000,
        totalPrice: 38000
      }
    ],
    subtotal: 94000,
    deliveryFee: 0,
    serviceFee: 2000,
    total: 96000,
    notes: 'Mohon diantarkan bersamaan ya.',
    paymentMethod: 'QRIS',
    status: 'Sedang Diseduh',
    createdAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    estimatedMinutes: 8
  }
];

let collaborationsList: CollaborationInquiry[] = [
  {
    id: 'COL-001',
    name: 'Komunitas TypoIndo',
    email: 'halo@typoindo.org',
    phone: '081399887766',
    topic: 'Workshop & Kelas Kreatif',
    estimatedGuests: '20 orang',
    message: 'Tertarik mengadakan workshop hand-lettering & coffee tasting di area outdoor FEBI Space.',
    createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString()
  }
];

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // === API ROUTES ===

  // 1. Get all menu items with category & search filtering
  app.get('/api/menu', (req: Request, res: Response) => {
    const { category, search, featured } = req.query;
    let result = [...menuList];

    if (category && typeof category === 'string' && category !== 'All') {
      result = result.filter(item => item.category.toLowerCase() === category.toLowerCase());
    }

    if (search && typeof search === 'string' && search.trim() !== '') {
      const q = search.toLowerCase().trim();
      result = result.filter(item =>
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        (item.tags && item.tags.some(tag => tag.toLowerCase().includes(q)))
      );
    }

    if (featured === 'true') {
      result = result.filter(item => item.featured);
    }

    res.json({
      success: true,
      count: result.length,
      data: result
    });
  });

  // 2. Get single menu item by ID
  app.get('/api/menu/:id', (req: Request, res: Response) => {
    const item = menuList.find(m => m.id === req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item menu tidak ditemukan' });
    }
    res.json({ success: true, data: item });
  });

  // 3. Create a new order
  app.post('/api/orders', (req: Request, res: Response) => {
    const { customerName, phone, email, serviceType, tableOrAddress, items, notes, paymentMethod, subtotal, deliveryFee, serviceFee, total } = req.body;

    if (!customerName || !phone || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Mohon lengkapi nama pemesan, nomor kontak, dan minimal 1 item pesanan.'
      });
    }

    const orderRandomNum = Math.floor(100000 + Math.random() * 900000);
    const newOrder: Order = {
      id: `FEB-${orderRandomNum}`,
      customerName: String(customerName).trim(),
      phone: String(phone).trim(),
      email: email ? String(email).trim() : undefined,
      serviceType: serviceType || 'Dine In',
      tableOrAddress: tableOrAddress ? String(tableOrAddress).trim() : 'Meja Kasir',
      items,
      subtotal: Number(subtotal) || 0,
      deliveryFee: Number(deliveryFee) || 0,
      serviceFee: Number(serviceFee) || 2000,
      total: Number(total) || 0,
      notes: notes ? String(notes).trim() : '',
      paymentMethod: paymentMethod || 'QRIS',
      status: 'Diterima',
      createdAt: new Date().toISOString(),
      estimatedMinutes: serviceType === 'Delivery' ? 30 : 15
    };

    ordersList.unshift(newOrder);

    // Auto-advance simulated status after 20 seconds for demo realism
    setTimeout(() => {
      const found = ordersList.find(o => o.id === newOrder.id);
      if (found && found.status === 'Diterima') {
        found.status = 'Sedang Diseduh';
      }
    }, 20000);

    console.log(`[FEBI Space] Pesanan Baru Diterima: ${newOrder.id} - Rp ${newOrder.total.toLocaleString('id-ID')} (${newOrder.customerName})`);

    res.status(201).json({
      success: true,
      message: 'Pesanan berhasil dikirim ke barista FEBI Space!',
      orderId: newOrder.id,
      data: newOrder
    });
  });

  // 4. Get all orders (for history & barista tracker)
  app.get('/api/orders', (_req: Request, res: Response) => {
    res.json({
      success: true,
      count: ordersList.length,
      data: ordersList
    });
  });

  // 5. Get order by ID for live order tracking
  app.get('/api/orders/:id', (req: Request, res: Response) => {
    const order = ordersList.find(o => o.id.toUpperCase() === req.params.id.toUpperCase());
    if (!order) {
      return res.status(404).json({ success: false, message: 'Pesanan dengan ID tersebut tidak ditemukan.' });
    }
    res.json({ success: true, data: order });
  });

  // 6. Update order status
  app.patch('/api/orders/:id/status', (req: Request, res: Response) => {
    const { status } = req.body;
    const validStatuses: OrderStatus[] = ['Diterima', 'Sedang Diseduh', 'Siap Disajikan', 'Selesai'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Status tidak valid' });
    }

    const order = ordersList.find(o => o.id.toUpperCase() === req.params.id.toUpperCase());
    if (!order) {
      return res.status(404).json({ success: false, message: 'Pesanan tidak ditemukan' });
    }

    order.status = status;
    res.json({ success: true, message: `Status pesanan diubah ke ${status}`, data: order });
  });

  // 7. Collaboration / Workshop Inquiries
  app.post('/api/collaborate', (req: Request, res: Response) => {
    const { name, email, phone, topic, date, estimatedGuests, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Mohon isi nama, email, dan detail pesan kolaborasi.' });
    }

    const inquiry: CollaborationInquiry = {
      id: `COL-${Date.now().toString().slice(-4)}`,
      name: String(name).trim(),
      email: String(email).trim(),
      phone: String(phone || '').trim(),
      topic: topic || 'Workshop & Kelas Kreatif',
      date: date || undefined,
      estimatedGuests: estimatedGuests || undefined,
      message: String(message).trim(),
      createdAt: new Date().toISOString()
    };

    collaborationsList.unshift(inquiry);
    console.log(`[FEBI Space] Permintaan Kolaborasi Baru dari ${inquiry.name} (${inquiry.topic})`);

    res.status(201).json({
      success: true,
      message: 'Terima kasih! Pesan kolaborasi Anda telah kami terima. Tim kurator FEBI Space akan menghubungi Anda melalui email/WhatsApp.',
      data: inquiry
    });
  });

  // 8. Testimonials list
  app.get('/api/testimonials', (_req: Request, res: Response) => {
    res.json({ success: true, data: INITIAL_TESTIMONIALS });
  });

  // === VITE / STATIC SERVING ===
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`☕ FEBI Space Server siap dan melayani di port ${PORT}`);
  });
}

startServer();

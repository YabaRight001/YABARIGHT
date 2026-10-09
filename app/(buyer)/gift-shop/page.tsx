'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAdminStore, GiftItemPricing, initialGiftPricings } from '@/store/adminStore';
import { useCartStore } from '@/store/cartStore';
import { useToastStore } from '@/store/toastStore';
import {
  Gift,
  Sparkles,
  ShoppingBag,
  FileText,
  Printer,
  Share2,
  CheckCircle2,
  ArrowRight,
  Clock,
  ShieldCheck,
  Truck,
  Heart,
  Palette,
  Edit3,
  Copy,
  ChevronRight,
  ExternalLink,
  MessageCircle,
  X
} from 'lucide-react';
import { Product } from '@/types';

export default function GiftShopPage() {
  const storedGiftPricings = useAdminStore((s) => s.giftPricings);
  const addItemToCart = useCartStore((s) => s.addItem);
  const { showToast } = useToastStore();

  const [mounted, setMounted] = useState(false);
  const invoiceRef = useRef<HTMLDivElement>(null);

  // Available items from PM store (fallback to initial if empty)
  const items: GiftItemPricing[] =
    mounted && storedGiftPricings && storedGiftPricings.length > 0
      ? storedGiftPricings.filter((i) => i.isAvailable)
      : initialGiftPricings;

  // Selected Item State
  const [selectedItemId, setSelectedItemId] = useState<string>('jerzy');

  // Form State
  const [customText, setCustomText] = useState('ADEBAYO 10');
  const [selectedColor, setSelectedColor] = useState('Classic White');
  const [placementNote, setPlacementNote] = useState('Center Back Print');
  const [giftOccasion, setGiftOccasion] = useState('Birthday Gift');
  const [recipientNote, setRecipientNote] = useState('');
  const [quantity, setQuantity] = useState(1);

  // Customer Contact Info (For Invoice)
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryCity, setDeliveryCity] = useState('Lagos');

  // Invoice State
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [invoiceDate, setInvoiceDate] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  const selectedItem: GiftItemPricing =
    items.find((i) => i.id === selectedItemId) || items[0] || initialGiftPricings[0];

  // Whenever selected item changes, update default text & color
  const handleSelectItem = (item: GiftItemPricing) => {
    setSelectedItemId(item.id);
    if (item.defaultText) setCustomText(item.defaultText);
    if (item.colorOptions && item.colorOptions.length > 0) {
      setSelectedColor(item.colorOptions[0]);
    }
  };

  // Price Calculations (using live PM rates)
  const unitBasePrice = selectedItem.basePrice;
  const unitCustomFee = selectedItem.customizationFee;
  const unitTotal = unitBasePrice + unitCustomFee;
  const subtotal = unitTotal * quantity;
  const deliveryFee = quantity >= 5 ? 0 : 2500;
  const grandTotal = subtotal + deliveryFee;

  // Generate Proforma Invoice
  const handleGenerateInvoice = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) {
      showToast('Please enter your Name and Phone Number to generate the invoice', 'error');
      return;
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const invCode = `INV-YB-${new Date().getFullYear()}-${randomSuffix}`;
    const today = new Date().toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    setInvoiceNumber(invCode);
    setInvoiceDate(today);
    setShowInvoiceModal(true);
    showToast('Proforma Invoice generated successfully!', 'success');
  };

  // Direct Add to Cart
  const handleAddToCart = () => {
    const textToPrint = customText.trim() || selectedItem.defaultText || 'Personalized Gift';
    const customizedProduct: Product = {
      id: `${selectedItem.id}-cust-${Date.now()}`,
      sellerId: 'admin-official',
      name: `${selectedItem.name} (Custom: "${textToPrint}")`,
      description: `Custom text: "${textToPrint}". Color: ${selectedColor}. Placement: ${placementNote}. Recipient Note: ${recipientNote || 'None'}.`,
      category: 'Gift Items',
      price: unitTotal,
      originalPrice: unitTotal + 4000,
      images: [selectedItem.image],
      condition: 'NEW' as any,
      quantity: 50,
      sold: 12,
      rating: 4.9,
      trending: true,
      published: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    addItemToCart(customizedProduct, quantity);
    showToast(`Added ${quantity} customized ${selectedItem.type} to your bag!`);
  };

  // Trigger Print / PDF
  const handlePrintInvoice = () => {
    window.print();
  };

  // Share via WhatsApp
  const handleWhatsAppInvoice = () => {
    const message = `*YABARIGHT PROFORMA INVOICE - ${invoiceNumber}*
Date: ${invoiceDate}
Customer: ${customerName} (${customerPhone})
Delivery Address: ${deliveryAddress}, ${deliveryCity}

*ITEM DETAILS:*
• Item: ${selectedItem.name} (${selectedItem.type})
• Inscription Text: "${customText}"
• Color/Specs: ${selectedColor} (${placementNote})
• Occasion: ${giftOccasion}
• Unit Price: ₦${unitTotal.toLocaleString()}
• Quantity: ${quantity}
• Subtotal: ₦${subtotal.toLocaleString()}
• Delivery: ₦${deliveryFee.toLocaleString()}
*TOTAL DUE: ₦${grandTotal.toLocaleString()}*

Please confirm production and dispatch details.`;

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/2348000000000?text=${encoded}`, '_blank');
  };

  return (
    <div className="w-full">
      {/* ================= 1. PROMOTIONAL FLYER HERO BANNER ================= */}
        <section className="relative overflow-hidden bg-[#0a0a0a] text-white py-12 sm:py-16 lg:py-20 border-b border-[#FFD700]/30 shadow-2xl">
          {/* Subtle Ambient Background Light */}
          <div className="pointer-events-none absolute -left-24 top-0 h-96 w-96 rounded-full bg-[#FFD700]/15 blur-3xl" />
          <div className="pointer-events-none absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-[#e8941f]/15 blur-3xl" />

          <div className="container-custom relative z-10">
            {/* The Promotional Flyer Card Display */}
            <div className="relative overflow-hidden rounded-3xl border-2 border-[#FFD700]/50 bg-gradient-to-r from-[#171717] via-[#111111] to-[#0a0a0a] p-6 sm:p-10 lg:p-12 shadow-2xl">
              
              {/* Flyer Top Gold Header Banner */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#FFD700]/25 pb-4 mb-6 sm:mb-8">
                <div className="flex items-center gap-2">
                  <span className="flex h-3 w-3 rounded-full bg-[#FFD700] animate-ping" />
                  <span className="text-xs font-black uppercase tracking-[0.25em] text-[#FFD700]">
                    Official Custom Gift Shop Studio
                  </span>
                </div>
                <div className="rounded-full bg-[#FFD700]/15 border border-[#FFD700]/40 px-3.5 py-1 text-[11px] font-black uppercase tracking-wider text-[#FFD700]">
                  Instant Downloadable Invoices • Nationwide Delivery
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                
                {/* Flyer Text Proposition (7 cols) */}
                <div className="lg:col-span-7">
                  <div className="inline-flex items-center gap-2 rounded-full bg-black/60 border border-white/10 px-3.5 py-1.5 text-xs font-bold text-gray-300 mb-4">
                    <Gift className="h-4 w-4 text-[#FFD700]" />
                    <span>Personalized Keepsakes for Loved Ones</span>
                  </div>

                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white leading-tight">
                    CUSTOMIZE & GIFT TO <span className="text-[#FFD700]">YOUR LOVED ONES</span>
                  </h1>

                  <p className="mt-4 text-xs sm:text-sm md:text-base text-gray-300 leading-relaxed max-w-xl">
                    Whether it&apos;s a birthday jersey, anniversary ceramic mug, corporate debossed folder, engraved pen, monogram streetwear cap, or couple charm bracelets — personalize every detail with your custom inscription and generate an official proforma invoice in seconds.
                  </p>

                  {/* Flyer Value Badges */}
                  <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-gray-200 font-semibold">
                    <div className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 p-2.5">
                      <CheckCircle2 className="h-4 w-4 text-[#FFD700] flex-shrink-0" />
                      <span>Live Mockup Preview</span>
                    </div>
                    <div className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 p-2.5">
                      <FileText className="h-4 w-4 text-[#FFD700] flex-shrink-0" />
                      <span>Instant Official Invoice</span>
                    </div>
                    <div className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 p-2.5">
                      <Truck className="h-4 w-4 text-[#FFD700] flex-shrink-0" />
                      <span>Doorstep Dispatch</span>
                    </div>
                  </div>

                  {/* Flyer Call to Action Buttons */}
                  <div className="mt-8 flex flex-wrap items-center gap-3">
                    <a
                      href="#customization-form"
                      className="inline-flex items-center gap-2 rounded-full bg-[#FFD700] px-7 py-3.5 text-xs sm:text-sm font-black uppercase tracking-wider text-black transition-all hover:bg-[#ffcc00] hover:scale-105 active:scale-95 shadow-xl shadow-[#FFD700]/20"
                    >
                      <Edit3 className="h-4 w-4" />
                      <span>Start Customizing Now</span>
                    </a>

                    <button
                      onClick={() => {
                        const formEl = document.getElementById('customer-details');
                        if (formEl) formEl.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3.5 text-xs font-bold text-white transition hover:bg-white/20"
                    >
                      <FileText className="h-4 w-4 text-[#FFD700]" />
                      <span>Get Instant Invoice</span>
                    </button>
                  </div>
                </div>

                {/* Flyer Visual Collage / Sample Cards (5 cols) */}
                <div className="lg:col-span-5 relative">
                  <div className="relative rounded-2xl border border-white/15 bg-black/60 p-4 shadow-2xl backdrop-blur-md">
                    <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-black mb-3">
                      <img
                        src={selectedItem.image}
                        alt={selectedItem.name}
                        className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                      
                      {/* Overlay Inscription Stamp */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center pointer-events-none">
                        <div className="rounded-xl border border-white/30 bg-black/70 backdrop-blur-md px-4 py-2 shadow-2xl animate-pulse">
                          <p className="text-[9px] uppercase tracking-widest text-[#FFD700] font-bold">Custom Preview</p>
                          <p className="text-base sm:text-lg font-black text-white font-mono tracking-wider">
                            {customText || selectedItem.defaultText}
                          </p>
                        </div>
                      </div>

                      <div className="absolute top-2.5 left-2.5">
                        <span className="rounded-full bg-[#FFD700] px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-black">
                          {selectedItem.type}
                        </span>
                      </div>

                      <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-xs font-bold">
                        <span className="text-white drop-shadow-sm">{selectedItem.name}</span>
                        <span className="text-[#FFD700] font-black">₦{unitTotal.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-gray-400 pt-1">
                      <span>⚡ Turnaround: {selectedItem.estimatedDays || 2} Days</span>
                      <span className="text-emerald-400 font-semibold">✓ PM Price Verified</span>
                    </div>

                    {/* Official Gift Shop Flyer Badge */}
                    <div className="mt-3 flex items-center gap-3 p-2.5 rounded-xl border border-[#FFD700]/30 bg-black/50">
                      <div className="h-12 w-10 flex-shrink-0 overflow-hidden rounded-lg border border-[#FFD700]/50 shadow-md">
                        <img 
                          src="/banner-gift-shop.jpg" 
                          alt="Official YabaRight Gift Shop Flyer" 
                          className="h-full w-full object-cover" 
                        />
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-black text-white">Official Gift Shop Flyer</p>
                        <p className="text-[10px] text-[#FFD700] font-semibold">Unique Gifts • Personal Touch • Lasting Memories</p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </section>

        {/* ================= 2. THE CUSTOMIZATION STUDIO & FORM ================= */}
        <section id="customization-form" className="py-12 sm:py-16 lg:py-20">
          <div className="container-custom">
            
            <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
              <span className="text-xs font-black uppercase tracking-[0.24em] text-[#c88d00]">
                Interactive Order Studio
              </span>
              <h2 className="mt-1.5 text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-[#111111]">
                Customize Your Gift in 3 Simple Steps
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-gray-600">
                Choose your item, write your inscription, and instantly generate a printable proforma invoice or add to cart.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              
              {/* Left Column: The Interactive Form (7 cols) */}
              <div className="lg:col-span-7 space-y-8">
                
                {/* Step 1: Select Item to Customize */}
                <div className="rounded-3xl border border-black/10 bg-white p-6 sm:p-8 shadow-sm">
                  <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-black/5">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0b0b0b] text-xs font-black text-[#FFD700]">
                      1
                    </span>
                    <div>
                      <h3 className="text-base sm:text-lg font-black text-[#111111]">
                        Select Item to Customize
                      </h3>
                      <p className="text-[11px] text-gray-500">Pick from our 9 signature personalized merchandise items</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 gap-3">
                    {items.map((item) => {
                      const isSelected = selectedItemId === item.id;
                      const itemPrice = item.basePrice + item.customizationFee;

                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleSelectItem(item)}
                          className={`relative flex flex-col items-center text-center p-3 rounded-2xl border transition-all ${
                            isSelected
                              ? 'border-[#c88d00] bg-[#FFD700]/10 shadow-md ring-2 ring-[#FFD700]'
                              : 'border-black/10 bg-white hover:border-black/30 hover:bg-gray-50'
                          }`}
                        >
                          <div className="h-16 w-16 sm:h-20 sm:w-20 overflow-hidden rounded-xl bg-gray-100 mb-2">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <span className="text-xs font-black text-[#111111] line-clamp-1">
                            {item.type}
                          </span>
                          <span className="mt-1 text-[11px] font-bold text-[#c88d00]">
                            ₦{(itemPrice / 1000).toFixed(1)}k
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Step 2: Inscription Details (What they want to customize & write in it) */}
                <div className="rounded-3xl border border-black/10 bg-white p-6 sm:p-8 shadow-sm">
                  <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-black/5">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0b0b0b] text-xs font-black text-[#FFD700]">
                      2
                    </span>
                    <div>
                      <h3 className="text-base sm:text-lg font-black text-[#111111]">
                        What Do You Want to Customize & Write In It?
                      </h3>
                      <p className="text-[11px] text-gray-500">Specify the text, monogram, placement, and color details</p>
                    </div>
                  </div>

                  <div className="space-y-5">
                    
                    {/* Inscription Text Input */}
                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <label className="text-xs font-black uppercase tracking-wider text-[#111111]">
                          Exact Inscription / What to Write in It: <span className="text-red-500">*</span>
                        </label>
                        <span className="text-[10px] font-mono text-gray-500 font-bold">{customText.length}/35 chars</span>
                      </div>
                      <input
                        type="text"
                        required
                        maxLength={35}
                        value={customText}
                        onChange={(e) => setCustomText(e.target.value)}
                        placeholder={selectedItem.placeholderText || 'E.g. ADEBAYO 10 or DR. CHIOMA'}
                        className="w-full rounded-xl border border-black/15 bg-[#fffaf0] px-4 py-3 text-sm font-bold text-black placeholder-gray-400 focus:border-[#c88d00] focus:outline-none focus:ring-1 focus:ring-[#c88d00]"
                      />
                      <p className="mt-1 text-[11px] text-gray-500">
                        This will be precision-printed or laser-engraved onto your {selectedItem.type}.
                      </p>
                    </div>

                    {/* Color / Variant Selection */}
                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-[#111111] mb-2">
                        Preferred Color / Material Finish:
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {(selectedItem.colorOptions || ['Standard', 'Custom Color']).map((color) => (
                          <button
                            key={color}
                            type="button"
                            onClick={() => setSelectedColor(color)}
                            className={`rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                              selectedColor === color
                                ? 'bg-[#0b0b0b] text-[#FFD700] ring-2 ring-[#FFD700]/60 shadow-sm'
                                : 'border border-black/10 bg-white text-gray-700 hover:border-black/30'
                            }`}
                          >
                            {color}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Placement Instructions */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-black uppercase tracking-wider text-[#111111] mb-1.5">
                          Inscription Placement:
                        </label>
                        <select
                          value={placementNote}
                          onChange={(e) => setPlacementNote(e.target.value)}
                          className="w-full rounded-xl border border-black/15 bg-[#fffaf0] px-3.5 py-2.5 text-xs font-bold text-black focus:border-[#c88d00] focus:outline-none"
                        >
                          <option value="Center Back Print">Center Back (Standard for Jerseys)</option>
                          <option value="Front Left Chest">Front Left Chest (Tees / Polos)</option>
                          <option value="Front Center Large">Front Center Large</option>
                          <option value="Barrel Laser Engraving">Barrel Laser Engraving (Pens)</option>
                          <option value="Cover Debossing">Cover Foil Debossing (Folders/Books)</option>
                          <option value="Outer Monogram">Outer Monogram (Caps / Cases)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-black uppercase tracking-wider text-[#111111] mb-1.5">
                          Occasion:
                        </label>
                        <select
                          value={giftOccasion}
                          onChange={(e) => setGiftOccasion(e.target.value)}
                          className="w-full rounded-xl border border-black/15 bg-[#fffaf0] px-3.5 py-2.5 text-xs font-bold text-black focus:border-[#c88d00] focus:outline-none"
                        >
                          <option value="Birthday Gift">🎂 Birthday Celebration</option>
                          <option value="Wedding / Owambe">💍 Wedding & Owambe</option>
                          <option value="Anniversary">❤️ Anniversary & Romance</option>
                          <option value="Graduation & Career">🎓 Graduation & Promotion</option>
                          <option value="Corporate Executive">💼 Corporate & Client Gift</option>
                          <option value="Just Because">✨ Special Surprise (Loved One)</option>
                        </select>
                      </div>
                    </div>

                    {/* Optional Recipient Greeting Note */}
                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-[#111111] mb-1.5">
                        Complimentary Gift Card Message (Optional):
                      </label>
                      <input
                        type="text"
                        maxLength={70}
                        value={recipientNote}
                        onChange={(e) => setRecipientNote(e.target.value)}
                        placeholder="E.g. Wishing you endless joy and prosperity! Love always, Tolu"
                        className="w-full rounded-xl border border-black/15 bg-[#fffaf0] px-4 py-2.5 text-xs font-medium text-black placeholder-gray-400 focus:border-[#c88d00] focus:outline-none"
                      />
                    </div>

                    {/* Quantity Selector */}
                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-[#111111] mb-1.5">
                        Quantity:
                      </label>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center rounded-xl border border-black/15 bg-white p-1">
                          <button
                            type="button"
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="h-8 w-8 rounded-lg bg-gray-100 font-black text-black hover:bg-gray-200 transition"
                          >
                            -
                          </button>
                          <span className="w-12 text-center text-sm font-black text-black">{quantity}</span>
                          <button
                            type="button"
                            onClick={() => setQuantity(quantity + 1)}
                            className="h-8 w-8 rounded-lg bg-gray-100 font-black text-black hover:bg-gray-200 transition"
                          >
                            +
                          </button>
                        </div>
                        <span className="text-xs text-gray-500 font-medium">
                          {quantity >= 5 ? '🎉 Free delivery applied!' : 'Order 5+ items for free delivery'}
                        </span>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Step 3: Customer & Delivery Details (for Invoice generation) */}
                <div id="customer-details" className="rounded-3xl border border-black/10 bg-white p-6 sm:p-8 shadow-sm">
                  <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-black/5">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0b0b0b] text-xs font-black text-[#FFD700]">
                      3
                    </span>
                    <div>
                      <h3 className="text-base sm:text-lg font-black text-[#111111]">
                        Customer & Delivery Information
                      </h3>
                      <p className="text-[11px] text-gray-500">Required for official invoice issuance and doorstep delivery</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-[#111111] mb-1">
                        Full Name: <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="E.g. Dr. Chukwuemeka Adeleke"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full rounded-xl border border-black/15 bg-[#fffaf0] px-3.5 py-2.5 text-xs font-bold text-black placeholder-gray-400 focus:border-[#c88d00] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-[#111111] mb-1">
                        Phone / WhatsApp: <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="E.g. 0803 123 4567"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="w-full rounded-xl border border-black/15 bg-[#fffaf0] px-3.5 py-2.5 text-xs font-bold text-black placeholder-gray-400 focus:border-[#c88d00] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-[#111111] mb-1">
                        Email Address (Optional):
                      </label>
                      <input
                        type="email"
                        placeholder="E.g. chukwu@yahoo.com"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        className="w-full rounded-xl border border-black/15 bg-[#fffaf0] px-3.5 py-2.5 text-xs font-bold text-black placeholder-gray-400 focus:border-[#c88d00] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-[#111111] mb-1">
                        Delivery City / State:
                      </label>
                      <input
                        type="text"
                        placeholder="E.g. Ikeja, Lagos"
                        value={deliveryCity}
                        onChange={(e) => setDeliveryCity(e.target.value)}
                        className="w-full rounded-xl border border-black/15 bg-[#fffaf0] px-3.5 py-2.5 text-xs font-bold text-black placeholder-gray-400 focus:border-[#c88d00] focus:outline-none"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-black uppercase tracking-wider text-[#111111] mb-1">
                        Delivery Street Address:
                      </label>
                      <input
                        type="text"
                        placeholder="E.g. Plot 14 Commercial Avenue, Sabo-Yaba, Lagos"
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        className="w-full rounded-xl border border-black/15 bg-[#fffaf0] px-3.5 py-2.5 text-xs font-bold text-black placeholder-gray-400 focus:border-[#c88d00] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Column: Live Price Summary & Order Actions (5 cols) */}
              <div className="lg:col-span-5 sticky top-24">
                <div className="rounded-3xl border border-black/10 bg-[#0e0e0e] text-white p-6 sm:p-8 shadow-2xl">
                  
                  <div className="flex items-center justify-between pb-4 border-b border-white/10">
                    <span className="text-xs font-black uppercase tracking-widest text-[#FFD700]">
                      Price & Invoice Summary
                    </span>
                    <span className="rounded-full bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-black uppercase text-emerald-400">
                      PM Rates Live
                    </span>
                  </div>

                  {/* Selected Item Preview Pill */}
                  <div className="mt-5 flex items-center gap-3.5 rounded-2xl bg-white/5 border border-white/10 p-3">
                    <img
                      src={selectedItem.image}
                      alt={selectedItem.name}
                      className="h-14 w-14 rounded-xl object-cover border border-white/10 bg-black flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="rounded-full bg-[#FFD700] px-2 py-0.5 text-[9px] font-black uppercase text-black">
                        {selectedItem.type}
                      </span>
                      <h4 className="mt-1 text-xs font-black text-white truncate">{selectedItem.name}</h4>
                      <p className="text-[10px] text-gray-400 truncate">Inscription: &quot;{customText}&quot;</p>
                    </div>
                  </div>

                  {/* Itemized Calculation */}
                  <div className="mt-6 space-y-3 text-xs text-gray-300 pb-5 border-b border-white/10">
                    <div className="flex justify-between">
                      <span>Base Merchandise Price ({quantity}x):</span>
                      <strong className="text-white">₦{(unitBasePrice * quantity).toLocaleString()}</strong>
                    </div>

                    <div className="flex justify-between">
                      <span>Custom Inscription / Engraving Fee:</span>
                      <span className="text-[#FFD700] font-bold">
                        {unitCustomFee > 0 ? `₦${(unitCustomFee * quantity).toLocaleString()}` : 'Free'}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span className="text-white font-bold">₦{subtotal.toLocaleString()}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span>Nationwide Doorstep Delivery:</span>
                      <span className={deliveryFee === 0 ? 'text-emerald-400 font-black' : 'text-gray-300 font-bold'}>
                        {deliveryFee === 0 ? 'FREE' : `₦${deliveryFee.toLocaleString()}`}
                      </span>
                    </div>
                  </div>

                  {/* Grand Total */}
                  <div className="mt-5 flex items-baseline justify-between">
                    <div>
                      <span className="text-xs uppercase font-black tracking-wider text-gray-400 block">Total Due:</span>
                      <span className="text-[10px] text-emerald-400">Official VAT & Taxes Included</span>
                    </div>
                    <span className="text-2xl sm:text-3xl font-black text-[#FFD700]">
                      ₦{grandTotal.toLocaleString()}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="mt-8 space-y-3">
                    <button
                      type="button"
                      onClick={handleGenerateInvoice}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#FFD700] px-6 py-4 text-xs font-black uppercase tracking-wider text-black transition-all hover:bg-[#ffcc00] hover:scale-102 active:scale-95 shadow-xl shadow-[#FFD700]/20"
                    >
                      <FileText className="h-4 w-4" />
                      <span>Generate Official Proforma Invoice</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleAddToCart}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3.5 text-xs font-bold text-white transition hover:bg-white/20 hover:text-[#FFD700]"
                    >
                      <ShoppingBag className="h-4 w-4 text-[#FFD700]" />
                      <span>Add Directly to Bag & Checkout</span>
                    </button>
                  </div>

                  {/* Trust Footer */}
                  <div className="mt-6 pt-4 border-t border-white/5 space-y-2 text-[11px] text-gray-400">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-3.5 w-3.5 text-[#FFD700]" />
                      <span>100% Guaranteed Accurate Inscription</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5 text-[#FFD700]" />
                      <span>Ready in {selectedItem.estimatedDays || 2} business days</span>
                    </div>
                  </div>

                </div>
              </div>

            </div>

          </div>
        </section>

      {/* ================= 3. OFFICIAL PROFORMA INVOICE MODAL & PRINT VIEW ================= */}
      {showInvoiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-6 overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-3xl bg-white text-black shadow-2xl p-6 sm:p-10 my-8 animate-in fade-in zoom-in-95">
            
            {/* Modal Close Button */}
            <button
              onClick={() => setShowInvoiceModal(false)}
              className="absolute top-5 right-5 h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:text-black hover:bg-gray-200 transition"
              aria-label="Close invoice"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Printable Invoice Container */}
            <div ref={invoiceRef} id="printable-invoice">
              
              {/* Invoice Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-black/10 pb-6">
                <div className="flex items-center gap-3">
                  <img
                    src="/logo.png"
                    alt="YabaRight"
                    className="h-12 w-auto object-contain"
                  />
                  <div>
                    <h2 className="text-lg font-black tracking-tight text-black uppercase">YabaRight Marketplace</h2>
                    <p className="text-[10px] text-gray-500 font-semibold">Custom Gift Studio & Thrift Hub • Lagos, Nigeria</p>
                  </div>
                </div>

                <div className="sm:text-right">
                  <span className="inline-block rounded-full bg-[#FFD700] px-3 py-0.5 text-[10px] font-black uppercase text-black mb-1">
                    PROFORMA INVOICE
                  </span>
                  <p className="text-sm font-black font-mono text-black">{invoiceNumber}</p>
                  <p className="text-[11px] text-gray-500">Date: {invoiceDate}</p>
                </div>
              </div>

              {/* Billed To / Issued By Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-6 border-b border-black/10 text-xs">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 block mb-1">
                    BILLED TO (CLIENT):
                  </span>
                  <p className="font-black text-sm text-black">{customerName || 'Valued Customer'}</p>
                  <p className="text-gray-600 font-medium">📞 {customerPhone}</p>
                  {customerEmail && <p className="text-gray-600 font-medium">✉️ {customerEmail}</p>}
                  <p className="text-gray-600 font-medium mt-1">
                    📍 {deliveryAddress || 'Pick-up Center'}, {deliveryCity}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 block mb-1">
                    ISSUED BY:
                  </span>
                  <p className="font-black text-sm text-black">YabaRight Custom Merchandise</p>
                  <p className="text-gray-600 font-medium">Tejuosho Ultra-Modern Complex, Yaba, Lagos</p>
                  <p className="text-gray-600 font-medium">support@yabaright.ng • 0800-YABARIGHT</p>
                  <p className="text-gray-600 font-medium mt-1">Status: <strong className="text-amber-600">Pending Settlement</strong></p>
                </div>
              </div>

              {/* Itemized Table */}
              <div className="py-6 border-b border-black/10">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-black/10 text-[10px] font-black uppercase text-gray-500">
                      <th className="pb-2">Description & Inscription</th>
                      <th className="pb-2 text-center">Qty</th>
                      <th className="pb-2 text-right">Unit Price</th>
                      <th className="pb-2 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5">
                    <tr>
                      <td className="py-3">
                        <p className="font-black text-black">{selectedItem.name}</p>
                        <p className="text-[11px] text-[#c88d00] font-bold">
                          Custom Inscription: &quot;{customText}&quot; ({placementNote})
                        </p>
                        <p className="text-[10px] text-gray-500">
                          Color: {selectedColor} • Occasion: {giftOccasion}
                          {recipientNote && ` • Card: "${recipientNote}"`}
                        </p>
                      </td>
                      <td className="py-3 text-center font-bold">{quantity}</td>
                      <td className="py-3 text-right font-medium">₦{unitTotal.toLocaleString()}</td>
                      <td className="py-3 text-right font-black">₦{subtotal.toLocaleString()}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Totals Breakdown */}
              <div className="py-4 border-b border-black/10 flex justify-end text-xs">
                <div className="w-64 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Subtotal:</span>
                    <span className="font-bold">₦{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Logistics & Delivery:</span>
                    <span className="font-bold">{deliveryFee === 0 ? 'FREE' : `₦${deliveryFee.toLocaleString()}`}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-black/10 text-sm font-black">
                    <span>TOTAL AMOUNT DUE:</span>
                    <span className="text-black font-black">₦{grandTotal.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Payment Settlement Instructions */}
              <div className="py-4 text-[11px] text-gray-600 bg-gray-50 rounded-xl p-3 mt-4">
                <p className="font-black text-black uppercase mb-1">Payment Instructions:</p>
                <p>To confirm your custom gift order, proceed with online checkout or transfer to our escrow account: <strong className="text-black">YabaRight Technologies / Moniepoint MFB / 8031234567</strong> with reference <strong className="text-black">{invoiceNumber}</strong>.</p>
              </div>

            </div>

            {/* Modal Bottom Actions (Print, WhatsApp, Add to Cart) */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrintInvoice}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-black/20 bg-white px-4 py-2.5 text-xs font-black uppercase text-black hover:bg-gray-100 transition shadow-sm"
                >
                  <Printer className="h-4 w-4" />
                  <span>Print / Save PDF</span>
                </button>

                <button
                  type="button"
                  onClick={handleWhatsAppInvoice}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-black uppercase text-white hover:bg-emerald-700 transition shadow-sm"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Send to WhatsApp</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  handleAddToCart();
                  setShowInvoiceModal(false);
                }}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#0b0b0b] px-5 py-2.5 text-xs font-black uppercase text-[#FFD700] hover:bg-black transition shadow-md"
              >
                <ShoppingBag className="h-4 w-4" />
                <span>Add to Cart & Checkout</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* End Gift Shop Content */}
    </div>
  );
}

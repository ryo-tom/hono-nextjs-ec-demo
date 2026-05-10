// apps/web/src/app/page.tsx
"use client";

import Link from "next/link";
import { useState } from "react";

/* =============================================
   定数・ダミーデータ
   ============================================= */

const NAV_LINKS = [
  { label: "商品一覧",   href: "/products" },
  { label: "カテゴリ",   href: "/categories" },
  { label: "運営会社",   href: "/about" },
  { label: "お問い合わせ", href: "/contact" },
] as const;

const STATS = [
  { value: "1,200+", label: "取扱商品数" },
  { value: "翌日",   label: "配送対応（平日正午まで）" },
  { value: "法人",   label: "請求書払い対応" },
] as const;

const CATEGORIES = [
  { emoji: "🗂️", name: "カテゴリA", count: 120, id: 1 },
  { emoji: "📋", name: "カテゴリB", count: 95,  id: 2 },
  { emoji: "🗃️", name: "カテゴリC", count: 210, id: 3 },
  { emoji: "📁", name: "カテゴリD", count: 88,  id: 4 },
] as const;

const FEATURED = [
  { emoji: "📦", name: "サンプル商品 α", category: "カテゴリA", price: "¥3,200" },
  { emoji: "🧰", name: "サンプル商品 β", category: "カテゴリB", price: "¥5,800" },
  { emoji: "📐", name: "サンプル商品 γ", category: "カテゴリC", price: "¥1,980" },
  { emoji: "🔧", name: "サンプル商品 δ", category: "カテゴリD", price: "¥7,400" },
] as const;

const PRODUCTS = [
  {
    id: 1,
    emoji: "📦",
    imgBg: "bg-amber-50",
    tag: "カテゴリA",
    tagClass: "text-amber-800 bg-amber-100",
    name: "サンプル商品 アルファ",
    description: "汎用デモ用のサンプル商品です。実際の商品説明がここに入ります。",
    price: "¥3,200",
    badge: null,
  },
  {
    id: 2,
    emoji: "🧰",
    imgBg: "bg-blue-50",
    tag: "カテゴリB",
    tagClass: "text-blue-800 bg-blue-100",
    name: "サンプル商品 ベータ",
    description: "汎用デモ用のサンプル商品です。実際の商品説明がここに入ります。",
    price: "¥5,800",
    badge: "人気",
  },
  {
    id: 3,
    emoji: "📐",
    imgBg: "bg-green-50",
    tag: "カテゴリC",
    tagClass: "text-green-800 bg-green-100",
    name: "サンプル商品 ガンマ",
    description: "汎用デモ用のサンプル商品です。実際の商品説明がここに入ります。",
    price: "¥1,980",
    badge: "NEW",
  },
] as const;

const TECH_STACK = [
  { label: "Frontend", value: "Next.js 15 / React 19" },
  { label: "Backend",  value: "Hono" },
  { label: "ORM",      value: "Prisma" },
  { label: "DB",       value: "PostgreSQL" },
  { label: "Runtime",  value: "Bun" },
] as const;

/* =============================================
   ページコンポーネント
   ============================================= */

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-surface">

      {/* ── Navbar ─────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-card border-b border-border">
        <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

          {/* ロゴ */}
          <Link href="/" className="font-bold text-xl tracking-tight text-ink">
            Shop<span className="text-accent">Demo</span>
          </Link>

          {/* デスクトップ ナビ */}
          <ul className="hidden md:flex gap-8 list-none">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm font-medium text-ink-sub hover:text-ink transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            {/* 管理画面ボタン（常時表示） */}
            <Link
              href="/admin"
              className="text-sm font-semibold bg-ink text-white px-4 py-2 rounded-lg hover:bg-ink/80 transition-colors"
            >
              管理画面 →
            </Link>

            {/* ハンバーガーボタン（スマホのみ） */}
            <button
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              className="md:hidden flex flex-col justify-center items-center w-9 h-9 gap-1.5 rounded-lg hover:bg-surface transition-colors"
              aria-label="メニューを開く"
            >
              <span
                className={`block w-5 h-0.5 bg-ink transition-all duration-200 ${
                  menuOpen ? "translate-y-2 rotate-45" : ""
                }`}
              />
              <span
                className={`block w-5 h-0.5 bg-ink transition-all duration-200 ${
                  menuOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`block w-5 h-0.5 bg-ink transition-all duration-200 ${
                  menuOpen ? "-translate-y-2 -rotate-45" : ""
                }`}
              />
            </button>
          </div>
        </nav>

        {/* モバイル ドロワー */}
        {menuOpen && (
          <div className="md:hidden border-t border-border bg-card px-6 py-4">
            <ul className="flex flex-col gap-1 list-none">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="block text-sm font-medium text-ink-sub hover:text-ink py-2.5 border-b border-border/50 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </header>

      <main className="max-w-6xl mx-auto px-6">

        {/* ── Hero ───────────────────────────────── */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center py-16 md:py-20">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase text-accent bg-accent-light px-3 py-1.5 rounded-full mb-6">
              🛍️ EC デモサイト — Next.js + Hono + Prisma
            </span>
            <h1 className="font-black text-4xl md:text-5xl leading-[1.2] tracking-tight text-ink mb-5">
              買い物体験を、<br />
              <em className="not-italic text-accent">シンプル</em>に。<br />
              スマートに。
            </h1>
            <p className="text-base leading-relaxed text-ink-sub max-w-md mb-8">
              このサイトは学習・デモ用の汎用 EC サイトです。
            </p>
            <div className="flex gap-3 flex-wrap">
              <Link
                href="/products"
                className="font-bold text-sm bg-ink text-white px-7 py-3 rounded-xl hover:bg-ink/80 transition-colors"
              >
                商品を見る
              </Link>
              <Link
                href="/admin"
                className="font-bold text-sm border border-border text-ink px-7 py-3 rounded-xl hover:border-ink transition-colors"
              >
                管理画面を見る
              </Link>
            </div>
          </div>

          <div className="relative bg-card border border-border rounded-2xl p-6">
            <span className="absolute -top-3 right-5 bg-accent text-white text-xs font-bold tracking-wide px-3 py-1 rounded-full">
              注目商品
            </span>
            <p className="text-xs font-bold tracking-widest uppercase text-ink-sub mb-4">
              Featured Products
            </p>
            <ul className="divide-y divide-border list-none">
              {FEATURED.map((p) => (
                <li key={p.name} className="flex items-center gap-3 py-3">
                  <span className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center text-xl shrink-0">
                    {p.emoji}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-ink truncate">{p.name}</p>
                    <p className="text-xs text-ink-sub">{p.category}</p>
                  </div>
                  <span className="font-bold text-sm text-ink whitespace-nowrap">
                    {p.price}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── Stats ──────────────────────────────── */}
        <section className="pb-12">
          <dl className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {STATS.map((s) => (
              <div key={s.label} className="bg-card border border-border rounded-2xl px-6 py-5">
                <dt className="font-black text-4xl text-ink leading-none mb-1">
                  {s.value}
                </dt>
                <dd className="text-xs text-ink-sub">{s.label}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* ── Categories ─────────────────────────── */}
        <section className="pb-12">
          <p className="text-xs font-bold tracking-widest uppercase text-ink-sub mb-4">
            Categories
          </p>
          <ul className="grid grid-cols-2 md:grid-cols-4 gap-3 list-none">
            {CATEGORIES.map((cat) => (
              <li key={cat.id}>
                <Link
                  href={`/categories/${cat.id}`}
                  className="block bg-card border border-border rounded-2xl p-5 hover:border-accent transition-colors group"
                >
                  <span className="text-3xl mb-3 block">{cat.emoji}</span>
                  <p className="font-bold text-sm text-ink group-hover:text-accent transition-colors">
                    {cat.name}
                  </p>
                  <p className="text-xs text-ink-sub mt-0.5">{cat.count} 商品</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* ── Products ───────────────────────────── */}
        <section className="pb-12">
          <p className="text-xs font-bold tracking-widest uppercase text-ink-sub mb-4">
            Featured Products
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-3 gap-4 list-none">
            {PRODUCTS.map((p) => (
              <li key={p.id} className="relative bg-card border border-border rounded-2xl overflow-hidden">
                {p.badge && (
                  <span className="absolute top-3 right-3 bg-accent text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
                    {p.badge}
                  </span>
                )}
                <div className={`h-32 flex items-center justify-center text-5xl ${p.imgBg}`}>
                  {p.emoji}
                </div>
                <div className="p-4">
                  <span className={`text-xs font-bold tracking-wide uppercase px-2 py-0.5 rounded-full ${p.tagClass}`}>
                    {p.tag}
                  </span>
                  <h3 className="font-bold text-sm text-ink mt-2 mb-1">{p.name}</h3>
                  <p className="text-xs text-ink-sub leading-relaxed mb-4">{p.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-black text-base text-ink">{p.price}</span>
                    <button
                      type="button"
                      className="text-xs font-semibold text-accent border border-accent px-3 py-1.5 rounded-lg hover:bg-accent-light transition-colors cursor-pointer"
                    >
                      カートへ
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* ── Tech Stack Banner ──────────────────── */}
        <section className="pb-20">
          <div className="bg-ink rounded-2xl px-8 md:px-10 py-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div>
                <p className="text-xs font-bold tracking-widest uppercase text-white/40 mb-2">
                  Tech Stack
                </p>
                <h2 className="font-black text-2xl text-white mb-1">
                  このデモの技術構成
                </h2>
                <p className="text-sm text-white/55">
                  Hono + Next.jsのモノレポ構成で構築されています。
                </p>
              </div>
              <ul className="list-none shrink-0 flex flex-col gap-2">
                {TECH_STACK.map((t) => (
                  <li key={t.label} className="flex items-center gap-3">
                    <span className="text-xs font-bold text-white/40 w-20 shrink-0">{t.label}</span>
                    <span className="text-sm font-medium text-white">{t.value}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

      </main>

      {/* ── Footer ─────────────────────────────── */}
      <footer className="border-t border-border bg-card">
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
          <span className="font-bold text-ink">
            Shop<span className="text-accent">Demo</span>
          </span>
          <span className="text-xs text-ink-sub">
            © 2026 ShopDemo — 学習・デモ用プロジェクト
          </span>
        </div>
      </footer>

    </div>
  );
}

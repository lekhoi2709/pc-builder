import { ArrowUpRight, CircuitBoard, Fan } from 'lucide-react';
import { useState, type CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router';

const parts = {
  mainboard: {
    image: '/home/mainboard.png', width: 650, height: 628, Icon: CircuitBoard,
    points: [{ key: 'socket', x: 57, y: 43 }, { key: 'memory', x: 76, y: 39 }],
  },
  gpu: {
    image: '/home/gpu.png', width: 695, height: 416, Icon: Fan,
    points: [{ key: 'cooling', x: 42, y: 29 }, { key: 'connector', x: 15, y: 59 }],
  },
} as const;
const categories = ['mainboard', 'gpu'] as const;

export default function PartsExplorer() {
  const { lang = 'vn' } = useParams();
  const { t } = useTranslation('home');
  const [category, setCategory] = useState<(typeof categories)[number]>('mainboard');
  const [selected, setSelected] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);
  const part = parts[category];
  const active = hovered ?? selected;
  const point = part.points[active];

  return (
    <section aria-labelledby="home-parts-title" className="bg-[#111c1a] px-5 py-20 text-[#edf3e7] md:px-10 lg:px-16 lg:py-24">
      <div className="mx-auto max-w-[1600px]">
        <h2 id="home-parts-title" className="mb-9 max-w-3xl font-display text-4xl font-semibold tracking-[-.055em] sm:text-6xl">
          {t('explorer.title')}
        </h2>
        <div className="border border-[#526354]">
          <div className="grid grid-cols-2 divide-x divide-[#526354] border-b border-[#526354]">
            {categories.map(key => {
              const Icon = parts[key].Icon;
              return (
                <button key={key} type="button" aria-pressed={category === key} onClick={() => {
                  setCategory(key);
                  setSelected(0);
                  setHovered(null);
                }} className="flex min-h-14 items-center gap-2 px-3 py-3 text-left text-sm font-semibold transition-colors hover:bg-[#34483c] aria-pressed:bg-[#d1ff52] aria-pressed:text-[#111c1a] focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-current sm:gap-3 sm:px-6">
                  <Icon aria-hidden="true" className="size-5 shrink-0" />
                  {t(`explorer.${key}`)}
                </button>
              );
            })}
          </div>
          <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.48fr)]">
            <div className="grid min-h-72 place-items-center bg-[#1a2921] p-5 [background-image:radial-gradient(#526354_1px,transparent_1px)] [background-size:20px_20px] sm:p-9 lg:min-h-[34rem]">
              <div
                className="parts-inspection relative w-full"
                style={{
                  maxWidth: Math.min(part.width, part.width / part.height * 465),
                  '--point-x': `${point.x}%`,
                  '--point-y': `${point.y}%`,
                } as CSSProperties}
              >
                <img src={part.image} width={part.width} height={part.height} alt={t(`explorer.${category}`)} loading="lazy" decoding="async" className="block h-auto w-full brightness-[.68]" />
                <img src={part.image} width={part.width} height={part.height} alt="" loading="lazy" decoding="async" className="parts-inspection-detail pointer-events-none absolute inset-0 h-full w-full" />
                <div aria-hidden="true" className="parts-inspection-ring pointer-events-none absolute rounded-full border border-dashed border-[#d1ff52]" />
                {part.points.map((item, index) => (
                  <button
                    key={item.key}
                    type="button"
                    aria-label={t(`explorer.points.${item.key}.title`)}
                    aria-controls="home-part-detail"
                    aria-pressed={selected === index}
                    onPointerEnter={event => { if (event.pointerType === 'mouse') setHovered(index); }}
                    onPointerLeave={() => setHovered(null)}
                    onPointerCancel={() => setHovered(null)}
                    onClick={() => { setSelected(index); setHovered(null); }}
                    style={{ left: `${item.x}%`, top: `${item.y}%` }}
                    className="group absolute z-10 grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d1ff52]"
                  >
                    <span aria-hidden="true" className={`grid size-7 place-items-center rounded-full border border-[#d1ff52] font-mono text-xs font-semibold ${active === index ? 'bg-[#d1ff52] text-[#111c1a]' : 'bg-[#111c1a] text-[#d1ff52]'}`}>
                      {index + 1}
                    </span>
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-6 border-t border-[#526354] bg-[#26352d] p-5 sm:p-8 lg:border-t-0 lg:border-l">
              <div className="grid gap-2">
                {part.points.map((item, index) => (
                  <button key={item.key} type="button" aria-controls="home-part-detail" aria-pressed={selected === index}
                    onPointerEnter={event => { if (event.pointerType === 'mouse') setHovered(index); }}
                    onPointerLeave={() => setHovered(null)}
                    onClick={() => { setSelected(index); setHovered(null); }}
                    className={`flex min-h-11 items-center gap-3 border px-3 text-left text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d1ff52] ${active === index ? 'border-[#d1ff52] text-[#d1ff52]' : 'border-[#526354] text-[#edf3e7] hover:border-[#9eafa2]'}`}>
                    <span aria-hidden="true" className="font-mono text-xs">{index + 1}</span>
                    {t(`explorer.points.${item.key}.title`)}
                  </button>
                ))}
              </div>
              <p id="home-part-detail" className="min-h-24 text-sm leading-7 text-[#d0dad0]">
                {t(`explorer.points.${point.key}.description`)}
              </p>
              <Link to={`/${lang}/components?category_id=${category}`} className="group mt-auto flex min-h-12 items-center justify-between gap-3 bg-[#d1ff52] px-4 text-sm font-semibold text-[#111c1a] transition-colors hover:bg-[#e1ff91] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d1ff52]">
                {t('explorer.browse')}
                <ArrowUpRight aria-hidden="true" className="size-4 motion-safe:transition-transform motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

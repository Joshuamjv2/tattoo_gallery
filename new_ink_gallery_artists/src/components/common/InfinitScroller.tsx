import React, { useEffect, useRef } from 'react';

interface InfiniteScrollerProps {
  items: React.ReactNode[];  // <--- more flexible than string[]
  speed?: number;
  styled?: boolean;
}

const InfiniteScroller: React.FC<InfiniteScrollerProps> = ({
  items,
  bg_color,
  styled,
  speed = 0.3
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;

    if (!container || !content) return;

    let animationFrame: number;
    let position = 0;
    const itemWidth = 150; // You may want to make this dynamic later

    const animate = () => {
      position -= speed;
      if (position <= -itemWidth * items.length) {
        position = 0;
      }
      content.style.transform = `translateX(${position}px)`;
      content.style.willChange = 'transform';
      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [items.length, speed]);

  return (
    <div ref={containerRef} className="overflow-hidden relative py-4 md:py-6 font-roboto">
      {/* Gradient fade effects on sides */}
      <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

      <div ref={contentRef} className="flex whitespace-nowrap">
        {[...items, ...items, ...items, ...items, ...items, ...items, ...items, ...items, ...items].map((item, i) => (
          styled ? item : <div
            key={`item-${i}`}
            className={`relative mx-2 md:mx-4 px-6 py-2 text-sm md:text-base border border-black/20 rounded-full shadow text-center hover:bg-black/10 cursor-pointer transition-colors duration-200`}
          >
            <div className="relative z-20">
              {item}
            </div>
            <div className="absolute inset-0 rounded-full overflow-hidden z-10" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default InfiniteScroller;

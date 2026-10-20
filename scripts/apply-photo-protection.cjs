const fs = require('fs');
const path = require('path');

function updateFile(filePath, updateFn) {
  const fullPath = path.resolve(__dirname, '..', filePath);
  let content = fs.readFileSync(fullPath, 'utf8');
  const isCrlf = content.includes('\r\n');
  const normalized = content.replace(/\r\n/g, '\n');
  const updated = updateFn(normalized);
  if (updated === normalized) {
    console.warn(`No changes applied to ${filePath}`);
    return false;
  }
  const finalContent = isCrlf ? updated.replace(/\n/g, '\r\n') : updated;
  fs.writeFileSync(fullPath, finalContent, 'utf8');
  console.log(`Successfully updated ${filePath}`);
  return true;
}

// 1. Update APropos.tsx
updateFile('src/pages/APropos.tsx', (content) => {
  const target = `              {/* Photo Reveal Column with Curtain / Wipe Animation */}
              <div className="md:col-span-5">
                <div className="relative rounded-3xl overflow-hidden shadow-soft-lg border border-violet-imperial/20 bg-onyx">
                  {/* Container with overflow hidden for the curtain wipe */}
                  <div className="relative aspect-[4/5] w-full overflow-hidden">
                    {/* Photo with zoom effect */}
                    {(() => {
                      const optPortrait = getOptimizedImage('/assets/about/scott-nana.png', { width: 800 });
                      return (
                        <motion.img
                          src={optPortrait.src}
                          srcSet={optPortrait.srcSet}
                          sizes="(min-width: 768px) 40vw, 90vw"
                          alt="Scott Nana — Brand & Graphic Designer, Fondateur de Class S"
                          width={optPortrait.width}
                          height={optPortrait.height}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover object-center"
                          initial={prefersReducedMotion ? { opacity: 0 } : { scale: 1.08, opacity: 0 }}
                          whileInView={prefersReducedMotion ? { opacity: 1 } : { scale: 1, opacity: 1 }}
                          viewport={{ once: true, amount: 0.3 }}
                          transition={{
                            duration: prefersReducedMotion ? 0.3 : 0.85,
                            ease: [0.25, 0.1, 0.25, 1],
                          }}
                        />
                      );
                    })()}

                    {/* Curtain / Wipe Reveal Panel */}
                    {!prefersReducedMotion && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-b from-onyx via-ardoise to-violet-imperial z-20 pointer-events-none"
                        initial={{ y: '0%' }}
                        whileInView={{ y: '-100%' }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{
                          duration: 0.8,
                          ease: [0.76, 0, 0.24, 1],
                          delay: 0.1,
                        }}
                      />
                    )}

                    {/* Subtle bottom gradient overlay for legibility */}
                    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-onyx/90 via-onyx/40 to-transparent pointer-events-none z-10" />

                    {/* Floating caption tag */}
                    <div className="absolute bottom-3 left-3 right-3 z-10 p-3 rounded-2xl bg-onyx/75 backdrop-blur-md border border-white/15 text-white flex items-center justify-between">
                      <div className="space-y-0.5">
                        <span className="text-xs font-bold block font-body text-or-champagne">Scott Nana</span>
                        <span className="text-[11px] text-ivoire-violet/70 block font-body">Brand & Graphic Designer</span>
                      </div>
                      <span className="text-[10px] uppercase tracking-wider font-semibold bg-violet-imperial/40 px-2 py-0.5 rounded-full border border-violet-imperial/40 text-amethyste">
                        Fondateur
                      </span>
                    </div>
                  </div>
                </div>
              </div>`;

  const repl = `              {/* Photo Reveal Column with Curtain / Wipe Animation & Anti-Download Shield */}
              <div className="md:col-span-5">
                <div 
                  className="relative rounded-3xl overflow-hidden shadow-soft-lg border border-violet-imperial/20 bg-onyx select-none"
                  onContextMenu={(e) => e.preventDefault()}
                  data-protected-image="true"
                >
                  {/* Container with overflow hidden for the curtain wipe */}
                  <div 
                    className="relative aspect-[4/5] w-full overflow-hidden select-none"
                    onContextMenu={(e) => e.preventDefault()}
                  >
                    {/* Photo with zoom effect */}
                    {(() => {
                      const optPortrait = getOptimizedImage('/assets/about/scott-nana.png', { width: 800 });
                      return (
                        <motion.img
                          src={optPortrait.src}
                          srcSet={optPortrait.srcSet}
                          sizes="(min-width: 768px) 40vw, 90vw"
                          alt="Scott Nana — Brand & Graphic Designer, Fondateur de Class S"
                          width={optPortrait.width}
                          height={optPortrait.height}
                          loading="lazy"
                          decoding="async"
                          draggable={false}
                          onContextMenu={(e) => e.preventDefault()}
                          className="w-full h-full object-cover object-center pointer-events-none select-none"
                          initial={prefersReducedMotion ? { opacity: 0 } : { scale: 1.08, opacity: 0 }}
                          whileInView={prefersReducedMotion ? { opacity: 1 } : { scale: 1, opacity: 1 }}
                          viewport={{ once: true, amount: 0.3 }}
                          transition={{
                            duration: prefersReducedMotion ? 0.3 : 0.85,
                            ease: [0.25, 0.1, 0.25, 1],
                          }}
                        />
                      );
                    })()}

                    {/* Transparent anti-download shield over the entire photo */}
                    <div
                      className="absolute inset-0 z-10 cursor-default select-none"
                      onContextMenu={(e) => e.preventDefault()}
                      onDragStart={(e) => e.preventDefault()}
                      aria-hidden="true"
                    />

                    {/* Curtain / Wipe Reveal Panel */}
                    {!prefersReducedMotion && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-b from-onyx via-ardoise to-violet-imperial z-20 pointer-events-none"
                        initial={{ y: '0%' }}
                        whileInView={{ y: '-100%' }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{
                          duration: 0.8,
                          ease: [0.76, 0, 0.24, 1],
                          delay: 0.1,
                        }}
                      />
                    )}

                    {/* Subtle bottom gradient overlay for legibility */}
                    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-onyx/90 via-onyx/40 to-transparent pointer-events-none z-20" />

                    {/* Floating caption tag */}
                    <div className="absolute bottom-3 left-3 right-3 z-30 p-3 rounded-2xl bg-onyx/75 backdrop-blur-md border border-white/15 text-white flex items-center justify-between pointer-events-auto">
                      <div className="space-y-0.5">
                        <span className="text-xs font-bold block font-body text-or-champagne">Scott Nana</span>
                        <span className="text-[11px] text-ivoire-violet/70 block font-body">Brand & Graphic Designer</span>
                      </div>
                      <span className="text-[10px] uppercase tracking-wider font-semibold bg-violet-imperial/40 px-2 py-0.5 rounded-full border border-violet-imperial/40 text-amethyste">
                        Fondateur
                      </span>
                    </div>
                  </div>
                </div>
              </div>`;

  return content.replace(target, repl);
});

// 2. Update Projets.tsx
updateFile('src/pages/Projets.tsx', (content) => {
  // Lightbox modal current image
  const targetLightbox = `            {/* Current Image */}
            <div className="relative max-h-[75vh] flex items-center justify-center overflow-hidden rounded-2xl bg-onyx shadow-2xl border border-white/20">
              {(() => {
                const fullOpt = getOptimizedImage(activeGallery.items[activeGallery.currentIndex].src, { width: 1920 });
                return (
                  <img
                    src={fullOpt.src}
                    srcSet={fullOpt.srcSet}
                    sizes="90vw"
                    alt={activeGallery.items[activeGallery.currentIndex].caption}
                    width={fullOpt.width}
                    height={fullOpt.height}
                    className="max-h-[75vh] w-auto max-w-full object-contain"
                    decoding="async"
                  />
                );
              })()}
            </div>`;

  const replLightbox = `            {/* Current Image with Anti-Download Shield */}
            <div 
              className="relative max-h-[75vh] flex items-center justify-center overflow-hidden rounded-2xl bg-onyx shadow-2xl border border-white/20 select-none"
              onContextMenu={(e) => e.preventDefault()}
              data-protected-image="true"
            >
              {(() => {
                const fullOpt = getOptimizedImage(activeGallery.items[activeGallery.currentIndex].src, { width: 1920 });
                return (
                  <img
                    src={fullOpt.src}
                    srcSet={fullOpt.srcSet}
                    sizes="90vw"
                    alt={activeGallery.items[activeGallery.currentIndex].caption}
                    width={fullOpt.width}
                    height={fullOpt.height}
                    draggable={false}
                    onContextMenu={(e) => e.preventDefault()}
                    className="max-h-[75vh] w-auto max-w-full object-contain pointer-events-none select-none"
                    decoding="async"
                  />
                );
              })()}
              {/* Invisible protective overlay shield against right-click or drag */}
              <div
                className="absolute inset-0 z-10 select-none cursor-default"
                onContextMenu={(e) => e.preventDefault()}
                onDragStart={(e) => e.preventDefault()}
                aria-hidden="true"
              />
            </div>`;

  // Gallery thumbnails
  const targetThumb = `                          <img
                            src={thumbOpt.src}
                            srcSet={thumbOpt.srcSet}
                            sizes="(min-width: 1024px) 20vw, (min-width: 640px) 25vw, 50vw"
                            alt={img.caption}
                            width={thumbOpt.width}
                            height={thumbOpt.height}
                            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                            decoding="async"
                          />`;

  const replThumb = `                          <img
                            src={thumbOpt.src}
                            srcSet={thumbOpt.srcSet}
                            sizes="(min-width: 1024px) 20vw, (min-width: 640px) 25vw, 50vw"
                            alt={img.caption}
                            width={thumbOpt.width}
                            height={thumbOpt.height}
                            draggable={false}
                            onContextMenu={(e) => e.preventDefault()}
                            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300 pointer-events-none select-none"
                            loading="lazy"
                            decoding="async"
                          />`;

  return content.replace(targetLightbox, replLightbox).replace(targetThumb, replThumb);
});

// 3. Update ProjectsProof.tsx
updateFile('src/components/sections/ProjectsProof.tsx', (content) => {
  const targetBanner = `                {/* Image Banner */}
                <div className="relative aspect-[4/3] sm:aspect-[16/11] overflow-hidden bg-onyx">
                  <img
                    src={optImg.src}
                    srcSet={optImg.srcSet}
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    alt={project.title}
                    width={optImg.width}
                    height={optImg.height}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute top-3 left-3 bg-onyx/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/15 text-[11px] font-semibold text-ivoire-violet uppercase tracking-wider">
                    {project.category}
                  </div>
                </div>`;

  const replBanner = `                {/* Image Banner with Anti-Download Shield */}
                <div 
                  className="relative aspect-[4/3] sm:aspect-[16/11] overflow-hidden bg-onyx select-none"
                  onContextMenu={(e) => e.preventDefault()}
                  data-protected-image="true"
                >
                  <img
                    src={optImg.src}
                    srcSet={optImg.srcSet}
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    alt={project.title}
                    width={optImg.width}
                    height={optImg.height}
                    draggable={false}
                    onContextMenu={(e) => e.preventDefault()}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 pointer-events-none select-none"
                    loading="lazy"
                    decoding="async"
                  />
                  {/* Invisible protective overlay shield */}
                  <div
                    className="absolute inset-0 z-10 select-none cursor-default"
                    onContextMenu={(e) => e.preventDefault()}
                    onDragStart={(e) => e.preventDefault()}
                    aria-hidden="true"
                  />
                  <div className="absolute top-3 left-3 z-20 bg-onyx/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/15 text-[11px] font-semibold text-ivoire-violet uppercase tracking-wider">
                    {project.category}
                  </div>
                </div>`;

  return content.replace(targetBanner, replBanner);
});

// 4. Update BlogPost.tsx
updateFile('src/pages/BlogPost.tsx', (content) => {
  const targetCover = `        {/* Hero Cover Image */}
        {article.cover_image && (
          <div className="aspect-video w-full rounded-3xl overflow-hidden border border-white/10 shadow-soft-lg bg-black/40">
            <img
              src={article.cover_image}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}`;

  const replCover = `        {/* Hero Cover Image with Anti-Download Shield */}
        {article.cover_image && (
          <div 
            className="relative aspect-video w-full rounded-3xl overflow-hidden border border-white/10 shadow-soft-lg bg-black/40 select-none"
            onContextMenu={(e) => e.preventDefault()}
            data-protected-image="true"
          >
            <img
              src={article.cover_image}
              alt={article.title}
              draggable={false}
              onContextMenu={(e) => e.preventDefault()}
              className="w-full h-full object-cover pointer-events-none select-none"
            />
            {/* Invisible protective overlay shield */}
            <div
              className="absolute inset-0 z-10 select-none cursor-default"
              onContextMenu={(e) => e.preventDefault()}
              onDragStart={(e) => e.preventDefault()}
              aria-hidden="true"
            />
          </div>
        )}`;

  return content.replace(targetCover, replCover);
});

// 5. Update Blog.tsx
updateFile('src/pages/Blog.tsx', (content) => {
  const target = `                        <img
                          src={article.cover_image}
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />`;
  const repl = `                        <img
                          src={article.cover_image}
                          alt={article.title}
                          draggable={false}
                          onContextMenu={(e) => e.preventDefault()}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 pointer-events-none select-none"
                          loading="lazy"
                        />`;
  return content.replace(target, repl);
});

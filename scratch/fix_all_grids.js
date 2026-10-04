const fs = require('fs');
let c = fs.readFileSync('src/pages/HomePage.jsx', 'utf8');

// 1. Healthy Snacks: replace HorizontalCard grid with AutoScrollWrapper of SmallCards
c = c.replace(
  `                <SectionHeader cat={cat} count={catProducts.length} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
                  {catProducts.map(p => <HorizontalCard key={p.id} p={p} />)}
                </div>
              </div>
            </div>
          </section>
        );

        // ── LAYOUT E: 2-col with badge ribbon (Dairy) ──`,
  `                <SectionHeader cat={cat} count={catProducts.length} />
                {catProducts.length <= 4 ? (
                  <div className="flex gap-2 md:gap-3 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
                    {catProducts.map((p) => (
                      <div key={p.id} className="flex-shrink-0 w-36 md:w-44">
                        <SmallCard p={p} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <AutoScrollWrapper direction={sectionIdx % 2 === 0 ? 'right' : 'left'} speed={0.4}>
                    {[...catProducts, ...catProducts, ...catProducts, ...catProducts].map((p, i) => (
                      <div key={p.id + '-' + i} className="flex-shrink-0 w-36 md:w-44 snap-start">
                        <SmallCard p={p} />
                      </div>
                    ))}
                  </AutoScrollWrapper>
                )}
              </div>
            </div>
          </section>
        );

        // ── LAYOUT E: 2-col with badge ribbon (Dairy) ──`
);

// 2. Dairy: replace grid with badge ribbon with AutoScrollWrapper
c = c.replace(
  `              <SectionHeader cat={cat} count={catProducts.length} />
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {catProducts.map(p => (
                  <div key={p.id} className="relative">
                    <div className="absolute top-0 right-0 z-10 bg-blue-600 text-white text-[8px] font-black px-2 py-0.5 rounded-bl-lg rounded-tr-2xl">DAIRY</div>
                    <SmallCard p={p} />
                  </div>
                ))}
              </div>`,
  `              <SectionHeader cat={cat} count={catProducts.length} />
              {catProducts.length <= 4 ? (
                <div className="flex gap-2 md:gap-3 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
                  {catProducts.map((p) => (
                    <div key={p.id} className="relative flex-shrink-0 w-36 md:w-44">
                      <div className="absolute top-0 right-0 z-10 bg-blue-600 text-white text-[8px] font-black px-2 py-0.5 rounded-bl-lg rounded-tr-2xl">DAIRY</div>
                      <SmallCard p={p} />
                    </div>
                  ))}
                </div>
              ) : (
                <AutoScrollWrapper direction={sectionIdx % 2 === 0 ? 'right' : 'left'} speed={0.4}>
                  {[...catProducts, ...catProducts, ...catProducts, ...catProducts].map((p, i) => (
                    <div key={p.id + '-' + i} className="relative flex-shrink-0 w-36 md:w-44 snap-start">
                      <div className="absolute top-0 right-0 z-10 bg-blue-600 text-white text-[8px] font-black px-2 py-0.5 rounded-bl-lg rounded-tr-2xl">DAIRY</div>
                      <SmallCard p={p} />
                    </div>
                  ))}
                </AutoScrollWrapper>
              )}`
);

// 3. layoutVariant === 2 (HorizontalCard grid): replace with AutoScrollWrapper SmallCard
c = c.replace(
  `                <SectionHeader cat={cat} count={catProducts.length} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
                  {catProducts.map(p => <HorizontalCard key={p.id} p={p} />)}
                </div>
              </div>
            </div>
          </section>
        );

        // default: compact 3-col grid`,
  `                <SectionHeader cat={cat} count={catProducts.length} />
                {catProducts.length <= 4 ? (
                  <div className="flex gap-2 md:gap-3 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
                    {catProducts.map((p) => (
                      <div key={p.id} className="flex-shrink-0 w-36 md:w-44">
                        <SmallCard p={p} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <AutoScrollWrapper direction={sectionIdx % 2 === 0 ? 'right' : 'left'} speed={0.4}>
                    {[...catProducts, ...catProducts, ...catProducts, ...catProducts].map((p, i) => (
                      <div key={p.id + '-' + i} className="flex-shrink-0 w-36 md:w-44 snap-start">
                        <SmallCard p={p} />
                      </div>
                    ))}
                  </AutoScrollWrapper>
                )}
              </div>
            </div>
          </section>
        );

        // default: compact 3-col grid`
);

// 4. Also fix Spices rest-grid (the static 2-col grid of remaining items after spotlight)
c = c.replace(
  `                  {/* Rest in 2-col grid */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 flex-1">
                    {catProducts.slice(1).map(p => <SmallCard key={p.id} p={p} />)}
                  </div>`,
  `                  {/* Rest as scrollable row */}
                  <div className="flex-1 overflow-hidden">
                    <AutoScrollWrapper direction="left" speed={0.4} className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 snap-x snap-mandatory scrollbar-none">
                      {[...catProducts.slice(1), ...catProducts.slice(1), ...catProducts.slice(1)].map((p, i) => (
                        <div key={p.id + '-' + i} className="flex-shrink-0 w-36 md:w-44 snap-start">
                          <SmallCard p={p} />
                        </div>
                      ))}
                    </AutoScrollWrapper>
                  </div>`
);

fs.writeFileSync('src/pages/HomePage.jsx', c);

// Count remaining grids in CategorySectionsGrid
const remaining = (c.match(/grid grid-cols/g) || []).length;
console.log('Done. Remaining grid grid-cols occurrences:', remaining);

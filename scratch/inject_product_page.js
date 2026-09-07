const fs = require('fs');

let c = fs.readFileSync('src/pages/ProductPage.jsx', 'utf8');

c = c.replace(/\r\n/g, '\n');

const searchCode = `                <div className="text-stone-700 text-sm leading-relaxed">
                  {activeTab === 'description' && (
                    <div className="space-y-3">
                      <p className="font-semibold text-stone-900">{product.description}</p>
                      <p>Every batch is handpicked from organic farms and sealed in food-grade pouches to preserve natural aromas, crisp texture, and essential oils.</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-2">
                        <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs"><CheckCircle2 size={15} /> 100% Raw, Unsalted & Unprocessed</div>
                        <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs"><CheckCircle2 size={15} /> High In Antioxidants & Healthy Fats</div>
                        <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs"><CheckCircle2 size={15} /> Zero Chemical Additives & Preservatives</div>
                        <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs"><CheckCircle2 size={15} /> Nitrogen Flushed Freshness Pack</div>
                      </div>
                    </div>
                  )}
                  {activeTab === 'nutritional facts' && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-amber-50 p-4 rounded-2xl border border-amber-200">
                      <div><p className="text-xs text-stone-500 font-bold">Energy</p><p className="font-black text-stone-900">579 kcal</p></div>
                      <div><p className="text-xs text-stone-500 font-bold">Protein</p><p className="font-black text-stone-900">21.1 g</p></div>
                      <div><p className="text-xs text-stone-500 font-bold">Dietary Fiber</p><p className="font-black text-stone-900">12.5 g</p></div>
                      <div><p className="text-xs text-stone-500 font-bold">Healthy Fats</p><p className="font-black text-stone-900">49.9 g</p></div>
                    </div>
                  )}
                  {activeTab === 'purity testing' && (
                    <div className="space-y-2">
                      <p className="font-bold text-[#5c3110]">Fortune Foodz Purity Guarantee:</p>
                      <p>All dry fruits and spices undergo rigorous 12-point quality testing for moisture, heavy metals, synthetic colors, and artificial aromas.</p>
                    </div>
                  )}`;

// Also we need to inject the logic to parse `details`
const replacementCode = `                <div className="text-stone-700 text-sm leading-relaxed">
                  {(() => {
                    let details = {};
                    try {
                      if (product.details) {
                        details = typeof product.details === 'string' ? JSON.parse(product.details) : product.details;
                      }
                    } catch (e) {}

                    const descriptionBullets = details?.descriptionBullets?.filter(Boolean) || [
                      '100% Raw, Unsalted & Unprocessed',
                      'High In Antioxidants & Healthy Fats',
                      'Zero Chemical Additives & Preservatives',
                      'Nitrogen Flushed Freshness Pack'
                    ];

                    const nutritionalFacts = details?.nutritionalFacts?.filter(n => n.name && n.value) || [
                      { name: 'Energy', value: '579 kcal' },
                      { name: 'Protein', value: '21.1 g' },
                      { name: 'Dietary Fiber', value: '12.5 g' },
                      { name: 'Healthy Fats', value: '49.9 g' }
                    ];

                    const purityTesting = details?.purityTesting?.filter(Boolean) || [
                      '100% Organic & FSSAI Certified',
                      'No artificial colors or preservatives',
                      'Sourced directly from certified organic farms',
                      'Rigorous quality checks at every stage'
                    ];

                    return (
                      <>
                        {activeTab === 'description' && (
                          <div className="space-y-3">
                            <p className="font-semibold text-stone-900 whitespace-pre-wrap">{product.description}</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-2">
                              {descriptionBullets.map((bullet, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
                                  <CheckCircle2 size={15} /> {bullet}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {activeTab === 'nutritional facts' && (
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-amber-50 p-4 rounded-2xl border border-amber-200">
                            {nutritionalFacts.map((fact, idx) => (
                              <div key={idx}>
                                <p className="text-xs text-stone-500 font-bold">{fact.name}</p>
                                <p className="font-black text-stone-900">{fact.value}</p>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {activeTab === 'purity testing' && (
                          <div className="space-y-2">
                            <p className="font-bold text-[#5c3110]">Fortune Foodz Purity Guarantee:</p>
                            <ul className="list-disc pl-5 text-sm text-stone-700 space-y-1">
                              {purityTesting.map((pt, idx) => (
                                <li key={idx}>{pt}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </>
                    );
                  })()}`;

if (c.includes(searchCode)) {
  c = c.replace(searchCode, replacementCode);
  fs.writeFileSync('src/pages/ProductPage.jsx', c);
  console.log('ProductPage updated successfully.');
} else {
  console.log('Could not find search string in ProductPage.');
}

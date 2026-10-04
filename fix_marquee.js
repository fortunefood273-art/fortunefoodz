const fs = require('fs');
let content = fs.readFileSync('src/pages/HomePage.jsx', 'utf8');

const p1 = <AutoScrollWrapper direction={sectionIdx % 2 === 0 ? 'right' : 'left'}>
                  {[...catProducts, ...catProducts, ...catProducts].map((p, i) => (
                    <div key={p.id + '-' + i} className="flex-shrink-0 w-36 md:w-44 snap-start">
                      <SmallCard p={p} />
                    </div>
                  ))}
                </AutoScrollWrapper>;

const r1 = \{catProducts.length <= 4 ? (
                  <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
                    {catProducts.map((p) => (
                      <div key={p.id} className="flex-shrink-0 w-36 md:w-44">
                        <SmallCard p={p} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <AutoScrollWrapper direction={sectionIdx % 2 === 0 ? 'right' : 'left'}>
                    {[...catProducts, ...catProducts, ...catProducts].map((p, i) => (
                      <div key={p.id + '-' + i} className="flex-shrink-0 w-36 md:w-44 snap-start">
                        <SmallCard p={p} />
                      </div>
                    ))}
                  </AutoScrollWrapper>
                )}\;

const p3 = <AutoScrollWrapper direction={sectionIdx % 2 === 0 ? 'right' : 'left'}>
                    {[...catProducts, ...catProducts, ...catProducts].map((p, i) => (
                      <div key={p.id + '-' + i} className="flex-shrink-0 w-36 md:w-44 snap-start">
                        <SmallCard p={p} />
                      </div>
                    ))}
                  </AutoScrollWrapper>;

const r3 = \{catProducts.length <= 4 ? (
                    <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
                      {catProducts.map((p) => (
                        <div key={p.id} className="flex-shrink-0 w-36 md:w-44">
                          <SmallCard p={p} />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <AutoScrollWrapper direction={sectionIdx % 2 === 0 ? 'right' : 'left'}>
                      {[...catProducts, ...catProducts, ...catProducts].map((p, i) => (
                        <div key={p.id + '-' + i} className="flex-shrink-0 w-36 md:w-44 snap-start">
                          <SmallCard p={p} />
                        </div>
                      ))}
                    </AutoScrollWrapper>
                  )}\;

const p2 = <AutoScrollWrapper direction={sectionIdx % 2 === 0 ? 'right' : 'left'}>
                    {[...catProducts, ...catProducts, ...catProducts].map((p, i) => (
                      <div key={p.id + "-" + i} className="flex-shrink-0 w-32 md:w-40 snap-start">
                        <div className="bg-white rounded-2xl border border-pink-100 overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group flex flex-col text-center">
                          <Link to={\/product/\\} className="relative overflow-hidden block h-28 bg-pink-50/50">
                            <MediaDisplay src={p.img} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                          </Link>
                          <div className="p-2">
                            <p className="text-stone-800 text-[10px] font-bold line-clamp-2">{p.name}</p>
                            <p className="text-rose-600 font-black text-sm mt-1">₹{p.price}</p>
                            <button onClick={() => addToCart(p)} className={\w-full mt-1.5 text-[10px] font-bold py-1 rounded-lg transition-all \\}>
                              {isInCart(p.id) ? 'Added' : 'Add to Cart'}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </AutoScrollWrapper>;

const r2 = \{catProducts.length <= 4 ? (
                    <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
                      {catProducts.map((p) => (
                        <div key={p.id} className="flex-shrink-0 w-32 md:w-40">
                          <div className="bg-white rounded-2xl border border-pink-100 overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group flex flex-col text-center">
                            <Link to={\/product/\\} className="relative overflow-hidden block h-28 bg-pink-50/50">
                              <MediaDisplay src={p.img} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                            </Link>
                            <div className="p-2">
                              <p className="text-stone-800 text-[10px] font-bold line-clamp-2">{p.name}</p>
                              <p className="text-rose-600 font-black text-sm mt-1">₹{p.price}</p>
                              <button onClick={() => addToCart(p)} className={\w-full mt-1.5 text-[10px] font-bold py-1 rounded-lg transition-all \\}>
                                {isInCart(p.id) ? 'Added' : 'Add to Cart'}
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <AutoScrollWrapper direction={sectionIdx % 2 === 0 ? 'right' : 'left'}>
                      {[...catProducts, ...catProducts, ...catProducts].map((p, i) => (
                        <div key={p.id + "-" + i} className="flex-shrink-0 w-32 md:w-40 snap-start">
                          <div className="bg-white rounded-2xl border border-pink-100 overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group flex flex-col text-center">
                            <Link to={\/product/\\} className="relative overflow-hidden block h-28 bg-pink-50/50">
                              <MediaDisplay src={p.img} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                            </Link>
                            <div className="p-2">
                              <p className="text-stone-800 text-[10px] font-bold line-clamp-2">{p.name}</p>
                              <p className="text-rose-600 font-black text-sm mt-1">₹{p.price}</p>
                              <button onClick={() => addToCart(p)} className={\w-full mt-1.5 text-[10px] font-bold py-1 rounded-lg transition-all \\}>
                                {isInCart(p.id) ? 'Added' : 'Add to Cart'}
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </AutoScrollWrapper>
                  )}\;

content = content.replace(p1, r1);
content = content.replace(p3, r3);
content = content.replace(p2, r2);

fs.writeFileSync('src/pages/HomePage.jsx', content);
console.log('Success');

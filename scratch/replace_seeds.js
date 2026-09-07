const fs = require('fs');
let content = fs.readFileSync('src/pages/HomePage.jsx', 'utf8');

// Replace Seeds grid
content = content.replace(
  /<div className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-3">\s*\{catProducts\.map\(p => <SmallCard key=\{p\.id\} p=\{p\} \/>\)\}\s*<\/div>/,
  `{catProducts.length <= 4 ? (
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
                )}`
);

fs.writeFileSync('src/pages/HomePage.jsx', content);
console.log('Done');

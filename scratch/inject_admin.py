import re

with open('src/pages/admin/AdminProducts.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update handleAdd
handle_add_replacement = """  const handleAdd = () => {
    setEditing({
      name: '',
      brand: 'Fortune Foodz',
      price: 0,
      mrp: 0,
      rating: 5,
      reviews: 0,
      img: '',
      images: [],
      category: categories[0]?.label || '',
      petType: 'None',
      description: '',
      variants: [],
      details: {
        descriptionBullets: ['', '', '', ''],
        nutritionalFacts: [
          { name: 'Energy', value: '' },
          { name: 'Protein', value: '' },
          { name: 'Dietary Fiber', value: '' },
          { name: 'Healthy Fats', value: '' }
        ],
        purityTesting: [
          '100% Organic & FSSAI Certified',
          'No artificial colors or preservatives',
          'Sourced directly from certified organic farms',
          'Rigorous quality checks at every stage'
        ]
      }
    });
    setIsModalOpen(true);
  };"""

content = re.sub(
    r'const handleAdd = \(\) => \{[\s\S]*?setIsModalOpen\(true\);\n  \};',
    handle_add_replacement,
    content
)

# 2. Update handleEdit
handle_edit_replacement = """  const handleEdit = (p) => {
    let images = [];
    try { if (p.images) images = typeof p.images === 'string' ? JSON.parse(p.images) : p.images; } catch(e) {}
    let variants = [];
    try { if (p.variants) variants = typeof p.variants === 'string' ? JSON.parse(p.variants) : p.variants; } catch(e) {}
    
    let details = {
      descriptionBullets: ['', '', '', ''],
      nutritionalFacts: [
        { name: 'Energy', value: '' },
        { name: 'Protein', value: '' },
        { name: 'Dietary Fiber', value: '' },
        { name: 'Healthy Fats', value: '' }
      ],
      purityTesting: [
        '100% Organic & FSSAI Certified',
        'No artificial colors or preservatives',
        'Sourced directly from certified organic farms',
        'Rigorous quality checks at every stage'
      ]
    };
    try { 
      if (p.details) {
        const parsedDetails = typeof p.details === 'string' ? JSON.parse(p.details) : p.details; 
        details = { ...details, ...parsedDetails };
      }
    } catch(e) {}

    setEditing({ 
      ...p, 
      images: Array.isArray(images) ? images : [], 
      variants: Array.isArray(variants) ? variants : [],
      details 
    });
    setIsModalOpen(true);
  };"""

content = re.sub(
    r'const handleEdit = \(p\) => \{[\s\S]*?setIsModalOpen\(true\);\n  \};',
    handle_edit_replacement,
    content
)

# 3. Inject UI logic for details
# Find where the 2-column grid ends. It ends just before the buttons div.
# We will insert a new section before the `<div className="p-6 border-t bg-gray-50/50 flex justify-end gap-3">`

ui_code = """
                  </div>
                </div>

                {/* --- New Details Section --- */}
                <div className="mt-6 border-t border-gray-100 pt-6 space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Product Description</label>
                    <textarea 
                      rows="3" 
                      placeholder="Main paragraph description..." 
                      value={editing.description || ''} 
                      onChange={e => setEditing({...editing, description: e.target.value})} 
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm" 
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Description Bullets */}
                    <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-4 space-y-3">
                      <h4 className="text-sm font-bold text-emerald-800">Description Bullets</h4>
                      {(editing.details?.descriptionBullets || []).map((b, i) => (
                        <input 
                          key={i} 
                          type="text" 
                          placeholder={`Bullet ${i+1}`} 
                          value={b} 
                          onChange={e => {
                            const newB = [...(editing.details.descriptionBullets || [])];
                            newB[i] = e.target.value;
                            setEditing({...editing, details: {...editing.details, descriptionBullets: newB}});
                          }} 
                          className="w-full p-2 border border-emerald-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500" 
                        />
                      ))}
                    </div>

                    {/* Purity Testing */}
                    <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-4 space-y-3">
                      <h4 className="text-sm font-bold text-amber-800">Purity Guarantee Bullets</h4>
                      {(editing.details?.purityTesting || []).map((b, i) => (
                        <div key={i} className="flex gap-2">
                          <input 
                            type="text" 
                            placeholder={`Guarantee ${i+1}`} 
                            value={b} 
                            onChange={e => {
                              const newP = [...(editing.details.purityTesting || [])];
                              newP[i] = e.target.value;
                              setEditing({...editing, details: {...editing.details, purityTesting: newP}});
                            }} 
                            className="w-full p-2 border border-amber-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-amber-500" 
                          />
                          <button type="button" onClick={() => {
                            const newP = editing.details.purityTesting.filter((_, idx) => idx !== i);
                            setEditing({...editing, details: {...editing.details, purityTesting: newP}});
                          }} className="text-red-400 hover:text-red-600 px-2 bg-white rounded-lg border border-amber-200"><X size={14}/></button>
                        </div>
                      ))}
                      <button type="button" onClick={() => {
                        setEditing({...editing, details: {...editing.details, purityTesting: [...(editing.details?.purityTesting || []), '']}});
                      }} className="text-xs font-bold text-amber-600 hover:text-amber-800">+ Add Guarantee</button>
                    </div>
                  </div>

                  {/* Nutritional Facts */}
                  <div className="bg-stone-50 border border-stone-200 rounded-xl p-4">
                    <h4 className="text-sm font-bold text-stone-700 mb-3">Nutritional Facts</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {(editing.details?.nutritionalFacts || []).map((nf, i) => (
                        <div key={i} className="bg-white p-2 rounded-lg border border-stone-200">
                          <input 
                            type="text" 
                            placeholder="Label (e.g. Energy)" 
                            value={nf.name} 
                            onChange={e => {
                              const newN = [...(editing.details.nutritionalFacts || [])];
                              newN[i] = {...newN[i], name: e.target.value};
                              setEditing({...editing, details: {...editing.details, nutritionalFacts: newN}});
                            }} 
                            className="w-full p-1.5 text-xs font-bold text-stone-500 mb-1 border-b border-transparent hover:border-stone-200 focus:border-stone-400 focus:outline-none" 
                          />
                          <input 
                            type="text" 
                            placeholder="Value (e.g. 500 kcal)" 
                            value={nf.value} 
                            onChange={e => {
                              const newN = [...(editing.details.nutritionalFacts || [])];
                              newN[i] = {...newN[i], value: e.target.value};
                              setEditing({...editing, details: {...editing.details, nutritionalFacts: newN}});
                            }} 
                            className="w-full p-1.5 text-sm font-black text-stone-900 border-b border-transparent hover:border-stone-200 focus:border-stone-400 focus:outline-none" 
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
              <div className="p-6 border-t bg-gray-50/50 flex justify-end gap-3">
"""

content = content.replace(
    '</div>\n                </div>\n              </div>\n              <div className="p-6 border-t bg-gray-50/50 flex justify-end gap-3">',
    ui_code
)

with open('src/pages/admin/AdminProducts.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated AdminProducts.jsx")

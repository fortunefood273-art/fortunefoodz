const fs = require('fs');
let c = fs.readFileSync('src/components/CheckoutModal.jsx', 'utf8');

// 1. Update StepProgress
c = c.replace(
  /function StepProgress\(\{ step \}\) \{\s*const steps = \['Address', 'Payment', 'Order Placed'\];/m,
  `function StepProgress({ step, stepsList }) {\n  const steps = stepsList || ['Address', 'Payment', 'Order Placed'];`
);

// 2. Update CheckoutModal initialization
c = c.replace(
  /const { frontendSettings } = useData\(\);\n  const { user } = useAuth\(\);\n\n  const \[step, setStep\]     = useState\(0\);/m,
  `const { frontendSettings } = useData();\n  const { user, loginWithGoogle } = useAuth();\n\n  const stepsList = user ? ['Address', 'Payment', 'Order Placed'] : ['Sign In', 'Address', 'Payment', 'Order Placed'];\n  const currentStepName = stepsList[step];\n\n  const [step, setStep]     = useState(0);`
);

// 3. Update StepProgress call
c = c.replace(
  /<StepProgress step=\{step\} \/>/m,
  `<StepProgress step={step} stepsList={stepsList} />`
);

// 4. Add Sign In step and change step conditionals
c = c.replace(
  /\{\/\* Step 0: Address Details \*\/\}\n\s*\{step === 0 && \(/m,
  `{/* Step: Sign In */}\n            {currentStepName === 'Sign In' && (\n              <motion.div\n                key="step-signin"\n                custom={direction}\n                variants={stepVariants}\n                initial="enter"\n                animate="center"\n                exit="exit"\n                className="p-6 flex flex-col items-center justify-center space-y-5"\n              >\n                <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-2">\n                  <User size={32} />\n                </div>\n                <div className="text-center space-y-1">\n                  <h3 className="text-lg font-cinzel font-bold text-stone-900">Sign in to Checkout</h3>\n                  <p className="text-xs text-stone-500">Save your orders and wishlist for next time!</p>\n                </div>\n                <button\n                  onClick={async () => {\n                    try { await loginWithGoogle(); } catch(e) { console.error(e); }\n                  }}\n                  className="w-full bg-white text-stone-900 font-bold py-3.5 rounded-2xl shadow-md border border-stone-200 hover:shadow-lg transition-all flex items-center justify-center gap-3"\n                >\n                  <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />\n                  Continue with Google\n                </button>\n                \n                <div className="flex items-center gap-3 w-full my-2">\n                  <div className="h-px bg-stone-200 flex-1"></div>\n                  <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">OR</span>\n                  <div className="h-px bg-stone-200 flex-1"></div>\n                </div>\n\n                <button\n                  onClick={() => goTo(step + 1)}\n                  className="w-full text-[#d97706] font-bold text-sm py-3.5 rounded-2xl hover:bg-amber-50 transition-all"\n                >\n                  Continue as Guest\n                </button>\n              </motion.div>\n            )}\n\n            {/* Step: Address Details */}\n            {currentStepName === 'Address' && (`
);

c = c.replace(/\{step === 1 && \(/g, `{currentStepName === 'Payment' && (`);
c = c.replace(/\{step === 2 && confirmedOrder && \(/g, `{currentStepName === 'Order Placed' && confirmedOrder && (`);

// Fix the "Edit Address" button in Payment step to go back correctly
// If stepsList has 'Sign In', Address is index 1. If not, it's 0.
c = c.replace(
  /<button\n\s*onClick=\{[^}]*\}\n\s*className="flex items-center gap-1 text-xs text-\[#d97706\] font-bold hover:underline"\n\s*>\n\s*<ArrowLeft size=\{13\} \/> Edit Address\n\s*<\/button>/m,
  `<button\n                  onClick={() => goTo(stepsList.indexOf('Address'))}\n                  className="flex items-center gap-1 text-xs text-[#d97706] font-bold hover:underline"\n                >\n                  <ArrowLeft size={13} /> Edit Address\n                </button>`
);


fs.writeFileSync('src/components/CheckoutModal.jsx', c);
console.log('Done replacing');

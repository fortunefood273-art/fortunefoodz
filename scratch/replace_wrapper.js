const fs = require('fs');
let c = fs.readFileSync('src/pages/HomePage.jsx', 'utf8');

c = c.replace(
  /function AutoScrollWrapper\(\{ children, direction = 'left', speed = 0\.5, className = "flex gap-3 overflow-x-auto pb-2 -mx-1 px-1   scrollbar-none" \}\) \{[\s\S]*?    \);\n  \}/,
  `function AutoScrollWrapper({ children, direction = 'left', speed = 0.5, className = "pb-2 -mx-1 px-1" }) {
    const dir = direction === 'right' ? 'reverse' : 'normal';
    // Base 0.5 speed = 35 seconds. Higher speed = lower seconds.
    const duration = speed > 0 ? (17.5 / speed).toFixed(1) + 's' : '35s';
    
    return (
      <div className={\`overflow-hidden whitespace-nowrap w-full \${className}\`}>
        <div 
          className="animate-marquee inline-flex gap-3 items-stretch" 
          style={{ animationDirection: dir, animationDuration: duration }}
        >
          {children}
        </div>
      </div>
    );
  }`
);

fs.writeFileSync('src/pages/HomePage.jsx', c);
console.log('Replaced AutoScrollWrapper');

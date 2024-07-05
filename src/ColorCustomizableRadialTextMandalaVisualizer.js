import React, { useState, useEffect, useRef } from 'react';

const ColorCustomizableRadialTextMandalaVisualizer = () => {
  const [text, setText] = useState('Name Mandala');
  const [isAnimating, setIsAnimating] = useState(false);
  const [fontSize, setFontSize] = useState(24);
  const [fontFamily, setFontFamily] = useState("'Brush Script MT', cursive");
  const [textColor, setTextColor] = useState('#ff00ff');
  const [outlineColor, setOutlineColor] = useState('#ff00ff');
  const svgRef = useRef(null);

  const fontOptions = [
    { name: 'Brush Script MT', value: "'Brush Script MT', cursive" },
    { name: 'Lucida Handwriting', value: "'Lucida Handwriting', cursive" },
    { name: 'Segoe Script', value: "'Segoe Script', cursive" },
    { name: 'Freestyle Script', value: "'Freestyle Script', cursive" },
    { name: 'Edwardian Script ITC', value: "'Edwardian Script ITC', cursive" }
  ];

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = svgRef.current;
    const mandalaGroup = svg.querySelector('#mandalaGroup');

    const createRadialMandala = () => {
      mandalaGroup.innerHTML = '';
      const centerX = 250;
      const centerY = 250;
      const spokeCount = 24;

      let maxTextLength = 0;

      for (let i = 0; i < spokeCount; i++) {
        const angle = (i / spokeCount) * Math.PI * 2;

        const textElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        textElement.setAttribute('fill', textColor);
        textElement.setAttribute('font-size', fontSize);
        textElement.setAttribute('font-family', fontFamily);
        textElement.textContent = text;
        
        const spokeGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        spokeGroup.setAttribute('transform', `rotate(${(i * 360 / spokeCount)}, ${centerX}, ${centerY})`);
        spokeGroup.appendChild(textElement);

        mandalaGroup.appendChild(spokeGroup);

        // Measure the text length
        const bbox = textElement.getBBox();
        maxTextLength = Math.max(maxTextLength, bbox.width);
      }

      // Add the outlining circle
      const circleRadius = maxTextLength / 2 + 5; // Add a small padding
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', centerX);
      circle.setAttribute('cy', centerY);
      circle.setAttribute('r', circleRadius);
      circle.setAttribute('fill', 'none');
      circle.setAttribute('stroke', outlineColor);
      circle.setAttribute('stroke-width', '2');
      mandalaGroup.appendChild(circle);

      // Adjust text position to start from the center
      mandalaGroup.querySelectorAll('text').forEach(textEl => {
        textEl.setAttribute('x', centerX);
        textEl.setAttribute('y', centerY);
        textEl.setAttribute('text-anchor', 'middle');
        textEl.setAttribute('dominant-baseline', 'middle');
      });
    };

    const rotateMandala = () => {
      let rotation = 0;
      const animate = () => {
        rotation = (rotation + 0.5) % 360;
        mandalaGroup.style.transform = `rotate(${rotation}deg)`;
        mandalaGroup.style.transformOrigin = 'center';
        requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    };

    createRadialMandala();
    if (isAnimating) {
      rotateMandala();
    }

  }, [isAnimating, text, fontSize, fontFamily, textColor, outlineColor]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4">
      <svg ref={svgRef} width="500" height="500" viewBox="0 0 500 500">
        <g id="mandalaGroup"></g>
      </svg>
      <div className="mt-8 space-y-4 w-full max-w-md">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full px-4 py-2 text-lg text-center bg-gray-800 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Enter text"
        />
        <div className="flex items-center space-x-2">
          <span className="text-white whitespace-nowrap">Font Size:</span>
          <input
            type="range"
            min="8"
            max="72"
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
            className="w-full"
          />
          <span className="text-white whitespace-nowrap">{fontSize}px</span>
        </div>
        <select
          value={fontFamily}
          onChange={(e) => setFontFamily(e.target.value)}
          className="w-full px-4 py-2 text-lg bg-gray-800 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          {fontOptions.map((font, index) => (
            <option key={index} value={font.value}>{font.name}</option>
          ))}
        </select>
        <div className="flex justify-between items-center">
          <label className="text-white">Text Color:</label>
          <input
            type="color"
            value={textColor}
            onChange={(e) => setTextColor(e.target.value)}
            className="w-10 h-10 rounded-full"
          />
        </div>
        <div className="flex justify-between items-center">
          <label className="text-white">Outline Color:</label>
          <input
            type="color"
            value={outlineColor}
            onChange={(e) => setOutlineColor(e.target.value)}
            className="w-10 h-10 rounded-full"
          />
        </div>
        <button
          onClick={() => setIsAnimating(!isAnimating)}
          className="w-full px-6 py-3 font-bold text-white bg-gradient-to-r from-purple-500 to-pink-500 rounded-full hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105"
        >
          {isAnimating ? 'Stop Rotation' : 'Start Rotation'}
        </button>
      </div>
    </div>
  );
};

export default ColorCustomizableRadialTextMandalaVisualizer;
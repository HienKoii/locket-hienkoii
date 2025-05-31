'use client';

import dynamic from 'next/dynamic';

const SketchPicker = dynamic(() => import('react-color').then(mod => mod.SketchPicker), {
  ssr: false
});

const ColorPicker = ({ color, onChange }) => {
  return <SketchPicker color={color} onChange={onChange} />;
};

export default ColorPicker; 
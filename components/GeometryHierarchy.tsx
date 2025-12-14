import React, { useState, useMemo } from 'react';
import { 
  ChevronRight, Info, CheckCircle, XCircle, Sliders, Gamepad2, 
  Trophy, ArrowUpRight, Image as ImageIcon, Calculator, Ruler, 
  BookOpen, MousePointer2, HelpCircle 
} from 'lucide-react';

interface ShapeData {
  id: string;
  label: string;
  definition: string;
  formulas: {
    area: string | React.ReactNode;
    areaText?: string;
    perimeter: string;
  };
  realWorld?: {
    img: string;
    label: string;
  };
  x: number;
  y: number;
  parents: string[];
  path: string;
  diagonals?: string;
  color: string;
  markers: React.ReactNode | null;
}

const GeometryHierarchy = () => {
  const [selectedShape, setSelectedShape] = useState<ShapeData | null>(null);
  const [hoveredShape, setHoveredShape] = useState<string | null>(null);
  
  // Modes: 'view', 'quiz', 'lab', 'game'
  const [mode, setMode] = useState('view');
  
  // View Mode Tabs
  const [viewTab, setViewTab] = useState('definition');

  // Visualization States
  const [showDiagonals, setShowDiagonals] = useState(false);
  
  // Quiz State
  const [quizQuestion, setQuizQuestion] = useState<any>(null);
  const [quizFeedback, setQuizFeedback] = useState<any>(null);

  // Lab State
  const [labExperiment, setLabExperiment] = useState('parallelogram');
  const [labAngle, setLabAngle] = useState(60);
  const [labWidth, setLabWidth] = useState(150);

  // Game State
  const [placedShapes, setPlacedShapes] = useState<string[]>([]); 
  const [gameWon, setGameWon] = useState(false);
  const [gameFeedback, setGameFeedback] = useState<string | null>(null);
  const [shakeShape, setShakeShape] = useState<string | null>(null);

  // Error handling for images
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    // If image fails, try to show a placeholder or hide it gently
    const target = e.target as HTMLImageElement;
    target.style.opacity = '0.5'; // Dim it to show something is wrong but keep layout
    console.error("Image failed to load:", target.src);
  };

  // --- DATA STRUCTURE ---
  const shapes: Record<string, ShapeData> = useMemo(() => ({
    quadrilateral: {
      id: 'quadrilateral',
      label: 'Четириаголник',
      definition: 'Полигон со четири страни и четири агли. Збирот на внатрешните агли изнесува 360°.',
      formulas: {
        area: 'P = P₁ + P₂',
        areaText: 'Се дели на два триаголници со дијагонала.',
        perimeter: 'L = a + b + c + d'
      },
      realWorld: {
        // Nature/Land plot
        img: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=400&q=80",
        label: "Парцела земјиште"
      },
      x: 50, y: 5,
      parents: [] as string[],
      path: "M10,10 L90,20 L80,90 L20,80 Z",
      diagonals: "M10,10 L80,90 M90,20 L20,80", 
      color: "bg-purple-100 text-purple-700 border-purple-200", 
      markers: null
    },
    kite: {
      id: 'kite',
      label: 'Делтоид',
      definition: 'Четириаголник со два пара еднакви соседни страни. Нема паралелни страни. Дијагоналите се сечат под прав агол.',
      formulas: {
        area: (<span>P = <span className="fraction"><span className="numerator">d₁ · d₂</span><span className="symbol">/</span><span className="denominator">2</span></span></span>),
        areaText: 'Полупроизвод од дијагоналите.',
        perimeter: 'L = 2(a + b)'
      },
      realWorld: {
        // Kite flying - Updated URL
        img: "https://images.unsplash.com/photo-1596727147705-54a9d0c2094c?auto=format&fit=crop&w=400&q=80",
        label: "Змеј за летање"
      },
      x: 20, y: 30,
      parents: ['quadrilateral'],
      path: "M50,5 L80,40 L50,95 L20,40 Z",
      diagonals: "M50,5 L50,95 M20,40 L80,40", 
      color: "bg-blue-100 text-blue-700 border-blue-200",
      markers: (
        <>
          <path d="M50,34 L56,34 L56,40" fill="none" stroke="currentColor" strokeWidth="1.5" className="opacity-50" />
          <path d="M33,20 L37,25 M63,25 L67,20" stroke="currentColor" strokeWidth="2" />
          <path d="M32,65 L38,68 M34,63 L40,66" stroke="currentColor" strokeWidth="2" />
          <path d="M62,68 L68,65 M60,66 L66,63" stroke="currentColor" strokeWidth="2" />
        </>
      )
    },
    trapezium: {
      id: 'trapezium',
      label: 'Трапез',
      definition: 'Четириаголник со точно еден пар паралелни страни (основи).',
      formulas: {
        area: (<span>P = <span className="fraction"><span className="numerator">a + b</span><span className="symbol">/</span><span className="denominator">2</span></span> · h</span>),
        areaText: 'Средна линија помножена со висината.',
        perimeter: 'L = a + b + c + d'
      },
      realWorld: {
        // Handbag shape - Updated URL
        img: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=400&q=80",
        label: "Женска чанта"
      },
      x: 80, y: 30,
      parents: ['quadrilateral'],
      path: "M25,10 L75,10 L90,90 L10,90 Z",
      diagonals: "M25,10 L90,90 M75,10 L10,90",
      color: "bg-yellow-100 text-yellow-700 border-yellow-200",
      markers: (
        <>
          <path d="M48,10 L45,7 M48,10 L45,13" stroke="currentColor" strokeWidth="2" fill="none" />
          <path d="M52,90 L49,87 M52,90 L49,93" stroke="currentColor" strokeWidth="2" fill="none" />
        </>
      )
    },
    parallelogram: {
      id: 'parallelogram',
      label: 'Паралелограм',
      definition: 'Четириаголник со два пара паралелни страни. Спротивните страни и агли се еднакви.',
      formulas: {
        area: 'P = a · h',
        areaText: 'Страна помножена со соодветната висина.',
        perimeter: 'L = 2(a + b)'
      },
      realWorld: {
        // Modern building architecture
        img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=400&q=80",
        label: "Модерна зграда"
      },
      x: 50, y: 50,
      parents: ['trapezium'],
      path: "M25,10 L90,10 L75,90 L10,90 Z",
      diagonals: "M25,10 L75,90 M90,10 L10,90", 
      color: "bg-teal-100 text-teal-700 border-teal-200",
      markers: (
        <>
          <path d="M55,10 L52,7 M55,10 L52,13" stroke="currentColor" strokeWidth="2" fill="none" />
          <path d="M45,90 L42,87 M45,90 L42,93" stroke="currentColor" strokeWidth="2" fill="none" />
          <path d="M82,50 L80,46 M82,50 L84,46" stroke="currentColor" strokeWidth="2" fill="none" />
          <path d="M82,55 L80,51 M82,55 L84,51" stroke="currentColor" strokeWidth="2" fill="none" />
          <path d="M18,50 L16,46 M18,50 L20,46" stroke="currentColor" strokeWidth="2" fill="none" />
          <path d="M18,55 L16,51 M18,55 L20,51" stroke="currentColor" strokeWidth="2" fill="none" />
        </>
      )
    },
    isoscelesTrapezium: {
      id: 'isoscelesTrapezium',
      label: 'Рамнокрак трапез',
      definition: 'Трапез чии краци се еднакви. Аглите на основите се еднакви, како и дијагоналите.',
      formulas: {
        area: (<span>P = <span className="fraction"><span className="numerator">a + b</span><span className="symbol">/</span><span className="denominator">2</span></span> · h</span>),
        perimeter: 'L = a + b + 2c'
      },
      realWorld: {
        // Flower pot
        img: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=400&q=80", 
        label: "Саксија"
      },
      x: 90, y: 50,
      parents: ['trapezium'],
      path: "M25,10 L75,10 L90,90 L10,90 Z",
      diagonals: "M25,10 L90,90 M75,10 L10,90", 
      color: "bg-cyan-100 text-cyan-700 border-cyan-200",
      markers: (
        <>
          <path d="M48,10 L45,7 M48,10 L45,13" stroke="currentColor" strokeWidth="2" fill="none" />
          <path d="M52,90 L49,87 M52,90 L49,93" stroke="currentColor" strokeWidth="2" fill="none" />
          <line x1="16" y1="48" x2="20" y2="52" stroke="currentColor" strokeWidth="2" />
          <line x1="80" y1="52" x2="84" y2="48" stroke="currentColor" strokeWidth="2" />
        </>
      )
    },
    rhombus: {
      id: 'rhombus',
      label: 'Ромб',
      definition: 'Паралелограм со четири еднакви страни. Дијагоналите се сечат под прав агол и ги преполовуваат аглите.',
      formulas: {
        area: (<span>P = <span className="fraction"><span className="numerator">d₁ · d₂</span><span className="symbol">/</span><span className="denominator">2</span></span></span>),
        areaText: 'Како кај делтоидот.',
        perimeter: 'L = 4a'
      },
      realWorld: {
        // Traffic sign (diamond)
        img: "https://images.unsplash.com/photo-1520690214124-2405c5217036?auto=format&fit=crop&w=400&q=80",
        label: "Сообраќаен знак"
      },
      x: 35, y: 70,
      parents: ['kite', 'parallelogram'],
      path: "M50,5 L85,50 L50,95 L15,50 Z",
      diagonals: "M50,5 L50,95 M85,50 L15,50", 
      color: "bg-orange-100 text-orange-700 border-orange-200",
      markers: (
        <>
          <line x1="30" y1="25" x2="35" y2="30" stroke="currentColor" strokeWidth="2" />
          <line x1="65" y1="30" x2="70" y2="25" stroke="currentColor" strokeWidth="2" />
          <line x1="65" y1="70" x2="70" y2="75" stroke="currentColor" strokeWidth="2" />
          <line x1="30" y1="75" x2="35" y2="70" stroke="currentColor" strokeWidth="2" />
        </>
      )
    },
    rectangle: {
      id: 'rectangle',
      label: 'Правоаголник',
      definition: 'Паралелограм со четири прави агли. Дијагоналите се еднакви и се преполовуваат.',
      formulas: {
        area: 'P = a · b',
        perimeter: 'L = 2(a + b)'
      },
      realWorld: {
        // Door - Updated URL
        img: "https://images.unsplash.com/photo-1517672651691-24622a91b550?auto=format&fit=crop&w=400&q=80",
        label: "Врата"
      },
      x: 65, y: 70,
      parents: ['parallelogram', 'isoscelesTrapezium'],
      path: "M10,20 L90,20 L90,80 L10,80 Z",
      diagonals: "M10,20 L90,80 M90,20 L10,80", 
      color: "bg-pink-100 text-pink-700 border-pink-200",
      markers: (
        <>
          <path d="M10,28 L18,28 L18,20" fill="none" stroke="currentColor" strokeWidth="1.5" className="opacity-60" />
          <path d="M82,20 L82,28 L90,28" fill="none" stroke="currentColor" strokeWidth="1.5" className="opacity-60" />
          <path d="M90,72 L82,72 L82,80" fill="none" stroke="currentColor" strokeWidth="1.5" className="opacity-60" />
          <path d="M18,80 L18,72 L10,72" fill="none" stroke="currentColor" strokeWidth="1.5" className="opacity-60" />
        </>
      )
    },
    square: {
      id: 'square',
      label: 'Квадрат',
      definition: 'Правилен четириаголник. Има четири еднакви страни и четири прави агли. Ги има својствата на сите погорни форми.',
      formulas: {
        area: 'P = a²',
        perimeter: 'L = 4a'
      },
      realWorld: {
        // Window - Updated URL
        img: "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?auto=format&fit=crop&w=400&q=80",
        label: "Прозорец"
      },
      x: 50, y: 90,
      parents: ['rhombus', 'rectangle'],
      path: "M15,15 L85,15 L85,85 L15,85 Z",
      diagonals: "M15,15 L85,85 M85,15 L15,85", 
      color: "bg-sky-100 text-sky-700 border-sky-200",
      markers: (
        <>
           <path d="M15,23 L23,23 L23,15" fill="none" stroke="currentColor" strokeWidth="1.5" className="opacity-60" />
           <path d="M77,15 L77,23 L85,23" fill="none" stroke="currentColor" strokeWidth="1.5" className="opacity-60" />
           <path d="M85,77 L77,77 L77,85" fill="none" stroke="currentColor" strokeWidth="1.5" className="opacity-60" />
           <path d="M23,85 L23,77 L15,77" fill="none" stroke="currentColor" strokeWidth="1.5" className="opacity-60" />
           <line x1="50" y1="13" x2="50" y2="17" stroke="currentColor" strokeWidth="2" />
           <line x1="83" y1="50" x2="87" y2="50" stroke="currentColor" strokeWidth="2" />
           <line x1="50" y1="83" x2="50" y2="87" stroke="currentColor" strokeWidth="2" />
           <line x1="13" y1="50" x2="17" y2="50" stroke="currentColor" strokeWidth="2" />
        </>
      )
    }
  }), []);

  // --- HELPERS ---
  const isDescendant = (childId: string, ancestorId: string): boolean => {
    if (childId === ancestorId) return true;
    const child = shapes[childId];
    if (!child || !child.parents) return false;
    return child.parents.some((parentId: string) => isDescendant(parentId, ancestorId));
  };

  const handleModeSwitch = (newMode: string) => {
    setMode(newMode);
    if (newMode !== 'view') setSelectedShape(null);
    if (newMode === 'quiz') generateQuestion();
    if (newMode === 'game') {
      setPlacedShapes([]);
      setGameWon(false);
      setGameFeedback(null);
    }
    if (newMode === 'view') setViewTab('definition');
  };

  // --- LOGIC: QUIZ ---
  const generateQuestion = () => {
    const shapeKeys = Object.keys(shapes);
    const expectTrue = Math.random() > 0.5;
    let subject, object, isValid = false, attempts = 0;

    while (!isValid && attempts < 100) {
      subject = shapeKeys[Math.floor(Math.random() * shapeKeys.length)];
      object = shapeKeys[Math.floor(Math.random() * shapeKeys.length)];
      if (subject === object) { attempts++; continue; }
      const isActuallyDescendant = isDescendant(subject, object);
      if ((expectTrue && isActuallyDescendant) || (!expectTrue && !isActuallyDescendant)) isValid = true;
      attempts++;
    }

    if (!subject || !object) return;

    const sLabel = shapes[subject].label;
    const oLabel = shapes[object].label;

    setQuizQuestion({
      text: `Дали ${sLabel.toLowerCase()}от е вид на ${oLabel.toLowerCase()}?`,
      answer: isDescendant(subject, object),
      explanation: isDescendant(subject, object) 
        ? `Точно! Бидејќи има патека од ${oLabel} до ${sLabel}, тоа значи дека ${sLabel.toLowerCase()}от ги наследува сите својства.`
        : `Неточно. ${sLabel}от не е задолжително ${oLabel}.`
    });
    setQuizFeedback(null);
  };

  const handleQuizAnswer = (userAnswer: boolean) => {
    setQuizFeedback({ type: userAnswer === quizQuestion.answer ? 'correct' : 'incorrect', text: quizQuestion.explanation });
  };

  // --- LOGIC: GAME (DRAG & DROP) ---
  const handleDragStart = (e: React.DragEvent, shapeId: string) => {
    e.dataTransfer.setData("shapeId", shapeId);
  };
  const handleDragOver = (e: React.DragEvent) => e.preventDefault();
  
  const handleDrop = (e: React.DragEvent, targetSlotId: string) => {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData("shapeId");
    
    if (draggedId === targetSlotId) {
      const newPlaced = [...placedShapes, targetSlotId];
      setPlacedShapes(newPlaced);
      setGameFeedback('correct');
      setTimeout(() => setGameFeedback(null), 1000);
      if (newPlaced.length === Object.keys(shapes).length) setGameWon(true);
    } else {
      setGameFeedback('incorrect');
      setShakeShape(targetSlotId); // Shake the target to indicate "no"
      setTimeout(() => { setGameFeedback(null); setShakeShape(null); }, 600);
    }
  };

  // --- RENDERERS ---
  const renderConnections = () => {
    const lines: React.ReactElement[] = [];
    Object.values(shapes).forEach(shape => {
      shape.parents.forEach((parentId: string) => {
        const parent = shapes[parentId];
        const isHighlighted = hoveredShape && 
          (isDescendant(hoveredShape, parent.id) || hoveredShape === parent.id) &&
          (isDescendant(hoveredShape, shape.id));
        
        lines.push(
          <g key={`${parentId}-${shape.id}`}>
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill={isHighlighted ? "#4f46e5" : "#cbd5e1"} />
              </marker>
            </defs>
            <line
              x1={`${parent.x}%`}
              y1={`${parent.y + 7}%`} 
              x2={`${shape.x}%`}
              y2={`${shape.y - 7}%`} 
              stroke={isHighlighted ? "#4f46e5" : "#cbd5e1"}
              strokeWidth={isHighlighted ? "3" : "2"}
              markerEnd="url(#arrowhead)"
              className="transition-all duration-300"
            />
          </g>
        );
      });
    });
    return lines;
  };

  const renderLabPanel = () => {
    const w = 200, h = 140, centerX = w/2, centerY = h/2;
    let svgPath = '', feedback = null, targetName = '';

    if (labExperiment === 'parallelogram') {
      targetName = 'Правоаголник';
      const radian = (labAngle * Math.PI) / 180;
      const height = 80, width = 100, skew = height / Math.tan(radian);
      const p1 = { x: centerX - width/2 + skew/2, y: centerY - height/2 };
      const p2 = { x: centerX + width/2 + skew/2, y: centerY - height/2 };
      const p3 = { x: centerX + width/2 - skew/2, y: centerY + height/2 };
      const p4 = { x: centerX - width/2 - skew/2, y: centerY + height/2 };
      svgPath = `M${p1.x},${p1.y} L${p2.x},${p2.y} L${p3.x},${p3.y} L${p4.x},${p4.y} Z`;
      if (labAngle >= 88 && labAngle <= 92) feedback = <div className="text-emerald-600 font-bold animate-pulse mt-2 flex items-center gap-1 justify-center"><CheckCircle size={16}/> Успех! Правоаголник.</div>;
    } else {
      targetName = 'Квадрат';
      const height = 100, width = labWidth;
      const p1 = { x: centerX - width/2, y: centerY - height/2 };
      const p2 = { x: centerX + width/2, y: centerY - height/2 };
      const p3 = { x: centerX + width/2, y: centerY + height/2 };
      const p4 = { x: centerX - width/2, y: centerY + height/2 };
      svgPath = `M${p1.x},${p1.y} L${p2.x},${p2.y} L${p3.x},${p3.y} L${p4.x},${p4.y} Z`;
      if (labWidth >= 95 && labWidth <= 105) feedback = <div className="text-emerald-600 font-bold animate-pulse mt-2 flex items-center gap-1 justify-center"><CheckCircle size={16}/> Успех! Квадрат.</div>;
    }

    return (
      <div className="flex flex-col h-full animate-fade-in">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-indigo-600 border-b pb-2"><Sliders size={20} /> Лабораторија</h2>
        <div className="mb-4">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Експеримент:</label>
          <select value={labExperiment} onChange={(e) => setLabExperiment(e.target.value)} className="w-full p-2 rounded border border-slate-300 bg-slate-50 text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option value="parallelogram">Паралелограм → Правоаголник</option>
            <option value="rectangle">Правоаголник → Квадрат</option>
          </select>
        </div>
        <div className="bg-slate-100 rounded-xl border border-slate-200 h-48 flex items-center justify-center relative mb-6 overflow-hidden shadow-inner">
          <svg width="100%" height="100%" viewBox={`0 0 ${w} ${h}`} className="text-indigo-600 fill-indigo-200">
            <path d={svgPath} stroke="currentColor" strokeWidth="3" vectorEffect="non-scaling-stroke" className="transition-all duration-100" />
            {labExperiment === 'parallelogram' && labAngle >= 88 && <path d={`M${w/2 - 50 - (80/Math.tan(labAngle*Math.PI/180))/2 + 10},${h/2 + 40} L${w/2 - 50 - (80/Math.tan(labAngle*Math.PI/180))/2 + 10},${h/2 + 30} L${w/2 - 50 - (80/Math.tan(labAngle*Math.PI/180))/2},${h/2 + 30}`} stroke="currentColor" fill="none" />}
          </svg>
          <div className="absolute top-2 right-2 bg-white/80 px-2 py-1 rounded text-xs font-mono text-slate-500 shadow-sm">{labExperiment === 'parallelogram' ? `${labAngle}°` : `w:${labWidth}`}</div>
        </div>
        <div className="space-y-4">
          {labExperiment === 'parallelogram' ? (
            <div>
              <div className="flex justify-between text-sm mb-1"><span className="text-slate-600">Агол на наклон:</span><span className="font-bold text-indigo-600">{labAngle}°</span></div>
              <input type="range" min="45" max="135" value={labAngle} onChange={(e) => setLabAngle(Number(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"/>
              <p className="text-xs text-slate-400 mt-2 text-center">Движи го лизгачот до 90°.</p>
            </div>
          ) : (
            <div>
              <div className="flex justify-between text-sm mb-1"><span className="text-slate-600">Ширина на страна:</span><span className="font-bold text-indigo-600">{labWidth}</span></div>
              <input type="range" min="50" max="200" value={labWidth} onChange={(e) => setLabWidth(Number(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"/>
              <p className="text-xs text-slate-400 mt-2 text-center">Изедначи ја ширината со висината (100).</p>
            </div>
          )}
        </div>
        <div className="mt-auto bg-white border border-slate-100 rounded-lg p-3 text-center h-20 flex items-center justify-center transition-all">
          {feedback ? feedback : <span className="text-slate-400 text-sm flex items-center gap-2"><MousePointer2 size={16}/> Обиди се да добиеш {targetName}.</span>}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 p-3 md:p-6 font-sans text-slate-800 flex flex-col items-center">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col min-h-[750px] border border-slate-200">
        
        {/* Header */}
        <div className="bg-indigo-700 p-4 md:px-8 md:py-5 text-white flex flex-col md:flex-row justify-between items-center gap-4 shadow-md z-10">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Геометриска Хиерархија</h1>
            <p className="text-indigo-200 text-sm font-medium">Интерактивно истражување на четириаголници</p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-3 items-center">
            {mode === 'view' && (
              <button
                onClick={() => setShowDiagonals(!showDiagonals)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 border border-white/20 uppercase tracking-wide
                  ${showDiagonals ? 'bg-white text-indigo-700' : 'bg-indigo-800/50 text-indigo-100 hover:bg-indigo-600'}
                `}
              >
                <ArrowUpRight size={14} />
                {showDiagonals ? 'Сокриј Дијагонали' : 'Прикажи Дијагонали'}
              </button>
            )}

            <div className="flex bg-indigo-900/30 p-1 rounded-xl">
              {[
                { id: 'view', icon: Info, label: 'Учи' },
                { id: 'lab', icon: Sliders, label: 'Лаб' },
                { id: 'game', icon: Gamepad2, label: 'Игра' },
                { id: 'quiz', icon: CheckCircle, label: 'Квиз' }
              ].map((btn) => (
                <button
                  key={btn.id}
                  onClick={() => handleModeSwitch(btn.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2
                    ${mode === btn.id ? 'bg-white text-indigo-700 shadow-sm' : 'text-indigo-100 hover:bg-white/10'}
                  `}
                >
                  <btn.icon size={16} />
                  <span className="hidden sm:inline">{btn.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col md:flex-row flex-grow">
          
          {/* Left: Diagram Canvas */}
          <div className="flex-grow relative bg-slate-50 border-r border-slate-200 overflow-hidden select-none min-h-[450px]">
             {/* Grid Background */}
             <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage: 'radial-gradient(#4f46e5 1px, transparent 1px)', backgroundSize: '24px 24px'}}></div>

             {gameFeedback && (
               <div className={`absolute top-6 left-1/2 transform -translate-x-1/2 z-50 px-6 py-2 rounded-full font-bold shadow-lg transition-all animate-bounce flex items-center gap-2
                 ${gameFeedback === 'correct' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}
               `}>
                 {gameFeedback === 'correct' ? <CheckCircle size={18}/> : <XCircle size={18}/>}
                 {gameFeedback === 'correct' ? 'Точно!' : 'Грешка!'}
               </div>
             )}

            <svg className="w-full h-full absolute inset-0 pointer-events-none">
              {renderConnections()}
            </svg>

            {Object.values(shapes).map((shape) => {
               const isActive = selectedShape?.id === shape.id;
               const isPlacedInGame = mode === 'game' && placedShapes.includes(shape.id);
               const isGameMode = mode === 'game';
               const shouldShowShape = !isGameMode || isPlacedInGame;
               const isShaking = shakeShape === shape.id;
               
               return (
                <div
                  key={shape.id}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300
                    ${!isGameMode ? 'cursor-pointer group' : ''}
                    ${isActive && !isGameMode ? 'scale-110 z-20' : 'scale-100 z-10'}
                    ${!isGameMode ? 'hover:scale-105' : ''}
                    ${isShaking ? 'animate-shake' : ''}
                  `}
                  style={{ left: `${shape.x}%`, top: `${shape.y}%`, width: '100px', height: '100px' }}
                  onClick={() => {
                    if (!isGameMode) {
                      handleModeSwitch('view');
                      setSelectedShape(shape);
                    }
                  }}
                  onMouseEnter={() => !isGameMode && setHoveredShape(shape.id)}
                  onMouseLeave={() => !isGameMode && setHoveredShape(null)}
                  onDragOver={isGameMode && !isPlacedInGame ? handleDragOver : undefined}
                  onDrop={isGameMode && !isPlacedInGame ? (e) => handleDrop(e, shape.id) : undefined}
                >
                  {shouldShowShape ? (
                    <div className="flex flex-col items-center">
                      <div className={`w-20 h-20 mb-2 rounded-xl shadow-sm relative transition-all duration-500
                        ${shape.color} ${isActive && !isGameMode ? 'ring-4 ring-indigo-400 shadow-xl' : 'border'}
                        ${isGameMode ? 'animate-pop-in' : ''}
                      `}>
                        <svg viewBox="0 0 100 100" className="w-full h-full p-1 overflow-visible">
                           <path d={shape.path} fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
                          
                          {(showDiagonals && !isGameMode && shape.diagonals) && (
                            <path d={shape.diagonals} stroke="#dc2626" strokeWidth="1.5" strokeDasharray="4,3" className="animate-fade-in opacity-80" />
                          )}
                          {shape.markers}
                        </svg>
                      </div>
                      <span className={`text-[11px] font-bold px-2 py-1 rounded-full bg-white/95 backdrop-blur-sm shadow-sm whitespace-nowrap border border-slate-100
                         ${isActive && !isGameMode ? 'text-indigo-700 ring-2 ring-indigo-100' : 'text-slate-600'}
                      `}>
                        {shape.label}
                      </span>
                    </div>
                  ) : (
                    <div className="w-20 h-20 border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center bg-slate-100/50 transition-colors hover:bg-indigo-50 hover:border-indigo-300">
                      <div className="text-slate-300 font-bold text-2xl">?</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right: Interaction Panel */}
          <div className="w-full md:w-96 p-6 bg-white shrink-0 flex flex-col border-l border-slate-100 shadow-sm z-30 overflow-y-auto max-h-[600px] md:max-h-full">
            
            {mode === 'view' && (
              <div className="animate-fade-in h-full flex flex-col">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-slate-800 border-b pb-4"><BookOpen size={22} className="text-indigo-600"/> Детали и Својства</h2>
                
                {selectedShape ? (
                  <div className="flex-grow">
                    <h3 className="text-2xl font-black text-indigo-900 mb-6">{selectedShape.label}</h3>
                    
                    {/* Tabs */}
                    <div className="flex border-b border-slate-200 mb-6">
                      {['definition', 'area', 'perimeter'].map(tab => (
                        <button 
                          key={tab}
                          onClick={() => setViewTab(tab)}
                          className={`flex-1 pb-3 text-xs font-bold uppercase tracking-wide flex justify-center items-center gap-2 transition-all relative
                            ${viewTab === tab ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}
                          `}
                        >
                          {tab === 'definition' && <Info size={16}/>}
                          {tab === 'area' && <Calculator size={16}/>}
                          {tab === 'perimeter' && <Ruler size={16}/>}
                          {tab === 'definition' ? 'Опис' : tab === 'area' ? 'Плоштина' : 'Периметар'}
                          {viewTab === tab && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-t-full"></span>}
                        </button>
                      ))}
                    </div>

                    <div className="min-h-[200px]">
                      {viewTab === 'definition' && (
                        <div className="animate-fade-in">
                          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-slate-700 leading-relaxed text-sm mb-6 shadow-sm">
                            {selectedShape.definition}
                          </div>
                          {selectedShape.realWorld && (
                            <div className="mb-4 group cursor-default">
                              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                                <ImageIcon size={12} /> Пример од реалноста
                              </div>
                              <div className="rounded-xl overflow-hidden border border-slate-200 relative h-40 shadow-sm transition-all group-hover:shadow-md bg-slate-100">
                                <img 
                                    src={selectedShape.realWorld.img} 
                                    alt={selectedShape.realWorld.label} 
                                    className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
                                    onError={handleImageError}
                                />
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 pt-8">
                                    <p className="text-white text-xs font-bold">{selectedShape.realWorld.label}</p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {viewTab === 'area' && (
                        <div className="animate-fade-in p-6 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-900 flex flex-col items-center text-center h-full justify-center">
                           <div className="text-4xl font-black mb-4 tracking-tight">{selectedShape.formulas?.area || "N/A"}</div>
                           <p className="text-sm text-emerald-700 leading-snug">{selectedShape.formulas?.areaText}</p>
                        </div>
                      )}

                      {viewTab === 'perimeter' && (
                        <div className="animate-fade-in p-6 rounded-xl bg-amber-50 border border-amber-100 text-amber-900 flex flex-col items-center text-center h-full justify-center">
                           <div className="text-4xl font-black mb-4 tracking-tight">{selectedShape.formulas?.perimeter || "N/A"}</div>
                           <p className="text-sm text-amber-700 leading-snug">Збир на должините на сите страни.</p>
                        </div>
                      )}
                    </div>

                    <div className="space-y-3 mt-8 pt-6 border-t border-slate-100">
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Родителски форми:</h4>
                      {selectedShape.parents.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {selectedShape.parents.map((pid: string) => (
                            <button key={pid} onClick={() => setSelectedShape(shapes[pid])} className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold rounded-lg border border-slate-200 transition-colors flex items-center gap-1"><ChevronRight size={12}/>{shapes[pid].label}</button>
                          ))}
                        </div>
                      ) : <p className="text-xs text-slate-400 italic">Ова е основна (најопшта) форма.</p>}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-slate-400 text-center px-6">
                    {/* Welcome Animation Container */}
                    <div className="relative w-48 h-48 mb-6">
                      <div className="absolute inset-0 bg-indigo-50/80 rounded-full animate-pulse opacity-50"></div>
                      
                      {/* Floating Shapes Animation */}
                      <div className="absolute top-4 left-8 w-10 h-10 bg-sky-100 text-sky-500 rounded p-1 transform -rotate-12 animate-float shadow-sm border border-sky-200">
                        <svg viewBox="0 0 100 100" className="w-full h-full"><path d={shapes.square.path} stroke="currentColor" strokeWidth="3" fill="currentColor" fillOpacity="0.2"/></svg>
                      </div>
                      <div className="absolute top-12 right-6 w-12 h-12 bg-blue-100 text-blue-500 rounded p-1 transform rotate-12 animate-float-delayed shadow-sm border border-blue-200">
                        <svg viewBox="0 0 100 100" className="w-full h-full"><path d={shapes.kite.path} stroke="currentColor" strokeWidth="3" fill="currentColor" fillOpacity="0.2"/></svg>
                      </div>
                      <div className="absolute bottom-8 left-10 w-11 h-11 bg-orange-100 text-orange-500 rounded p-1 transform rotate-45 animate-float shadow-sm border border-orange-200">
                        <svg viewBox="0 0 100 100" className="w-full h-full"><path d={shapes.rhombus.path} stroke="currentColor" strokeWidth="3" fill="currentColor" fillOpacity="0.2"/></svg>
                      </div>
                      
                      {/* Center Icon */}
                      <div className="absolute inset-0 flex items-center justify-center">
                          <div className="bg-white p-3 rounded-full shadow-md">
                            <MousePointer2 size={32} className="text-indigo-400" />
                          </div>
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-slate-700 mb-2">Добредојде!</h3>
                    <p className="text-sm leading-relaxed max-w-xs text-slate-500">
                      Истражувај го светот на геометријата. <br/>
                      <span className="font-semibold text-indigo-500">Кликни на форма</span> за да започнеш.
                    </p>
                  </div>
                )}
              </div>
            )}

            {mode === 'lab' && renderLabPanel()}

            {mode === 'game' && (
              <div className="flex flex-col h-full animate-fade-in">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-indigo-600 border-b pb-4"><Gamepad2 size={22} /> Геометриска Сложувалка</h2>
                
                {!gameWon ? (
                   <>
                    <div className="bg-indigo-50 p-3 rounded-lg text-xs text-indigo-800 mb-4 flex gap-2 items-start">
                       <HelpCircle size={14} className="mt-0.5 shrink-0"/>
                       <p>Повлечи ги формите од листата долу и пушти ги на вистинското место во дијаграмот.</p>
                    </div>
                    <div className="flex-grow overflow-y-auto pr-1">
                      <div className="grid grid-cols-2 gap-3 pb-2">
                        {Object.values(shapes).filter(s => !placedShapes.includes(s.id)).map(shape => (
                          <div 
                            key={shape.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, shape.id)}
                            className="bg-white p-2 rounded-xl border border-slate-200 hover:border-indigo-400 hover:shadow-md cursor-grab active:cursor-grabbing flex flex-col items-center justify-center transition-all h-28 group"
                          >
                             <div className={`w-12 h-12 mb-2 ${shape.color.split(' ').filter(c => c.startsWith('bg') || c.startsWith('text')).join(' ')} rounded-lg group-hover:scale-110 transition-transform`}>
                                <svg viewBox="0 0 100 100" className="w-full h-full p-1"><path d={shape.path} strokeWidth="3" stroke="currentColor" fill="currentColor" fillOpacity="0.2" vectorEffect="non-scaling-stroke" /></svg>
                             </div>
                             <span className="text-[10px] font-bold text-center text-slate-600 leading-tight">{shape.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                   </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center animate-pop-in">
                    <Trophy size={64} className="text-yellow-500 mb-4 drop-shadow-sm" />
                    <h3 className="text-2xl font-black text-slate-800 mb-2">Честитки!</h3>
                    <p className="text-slate-500 mb-8 text-sm">Ја комплетираше целата хиерархија.</p>
                    <button onClick={() => { setPlacedShapes([]); setGameWon(false); }} className="px-8 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-bold shadow-lg shadow-indigo-200 transition-transform active:scale-95">Играј повторно</button>
                  </div>
                )}
              </div>
            )}

            {mode === 'quiz' && (
              <div className="flex flex-col h-full animate-fade-in">
                 <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-indigo-600 border-b pb-4"><CheckCircle size={22} /> Квиз на Знаење</h2>
                {quizQuestion && (
                  <div className="flex-grow flex flex-col">
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 mb-6 flex-grow flex items-center justify-center text-center shadow-inner relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
                      <p className="text-lg font-bold text-slate-700 leading-snug">{quizQuestion.text}</p>
                    </div>
                    {!quizFeedback ? (
                      <div className="grid grid-cols-2 gap-4 mt-auto">
                        <button onClick={() => handleQuizAnswer(true)} className="py-4 px-4 bg-emerald-50 text-emerald-700 font-black rounded-xl hover:bg-emerald-100 border border-emerald-200 hover:-translate-y-1 transition-all shadow-sm">ТОЧНО</button>
                        <button onClick={() => handleQuizAnswer(false)} className="py-4 px-4 bg-rose-50 text-rose-700 font-black rounded-xl hover:bg-rose-100 border border-rose-200 hover:-translate-y-1 transition-all shadow-sm">НЕТОЧНО</button>
                      </div>
                    ) : (
                      <div className={`p-6 rounded-2xl mb-4 shadow-lg animate-pop-in border-l-4 ${quizFeedback.type === 'correct' ? 'bg-emerald-50 border-emerald-500' : 'bg-rose-50 border-rose-500'}`}>
                        <div className="flex items-start gap-4">
                          {quizFeedback.type === 'correct' ? <CheckCircle className="text-emerald-600 shrink-0" size={28} /> : <XCircle className="text-rose-600 shrink-0" size={28} />}
                          <div>
                              <p className={`font-black text-lg mb-2 ${quizFeedback.type === 'correct' ? 'text-emerald-800' : 'text-rose-800'}`}>{quizFeedback.type === 'correct' ? 'Браво!' : 'Погрешно.'}</p>
                              <p className="text-sm text-slate-700 leading-relaxed">{quizFeedback.text}</p>
                          </div>
                        </div>
                        <button onClick={generateQuestion} className="mt-6 w-full py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-bold tracking-wide transition-all shadow-md active:scale-95">Следно прашање</button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <style>{`
        @keyframes pop-in { 0% { transform: scale(0.9); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
        .animate-pop-in { animation: pop-in 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
        .animate-fade-in { animation: pop-in 0.3s ease-out forwards; }
        @keyframes shake { 0%, 100% { transform: translate(-50%, -50%); } 25% { transform: translate(-55%, -50%); } 75% { transform: translate(-45%, -50%); } }
        .animate-shake { animation: shake 0.4s ease-in-out; }
        @keyframes float { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-8px) rotate(5deg); } }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-float-delayed { animation: float 3.5s ease-in-out infinite 1s; }
        .fraction { display: inline-block; text-align: center; vertical-align: middle; margin: 0 4px; font-size: 0.9em; }
        .numerator { display: block; border-bottom: 2px solid currentColor; padding-bottom: 1px; }
        .denominator { display: block; padding-top: 1px; }
        .symbol { display: none; }
      `}</style>
    </div>
  );
};

export default GeometryHierarchy;
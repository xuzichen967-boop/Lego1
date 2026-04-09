import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'motion/react';
import {
  Bird,
  Box,
  Camera,
  ChevronLeft,
  ChevronRight,
  Code2,
  Copy,
  Download,
  Grid3X3,
  Hammer,
  Pause,
  Play,
  Rabbit,
  RefreshCw,
  Sparkles,
  Upload,
  Wand2,
  X,
} from 'lucide-react';
import { GoogleGenAI, Type } from '@google/genai';
import { cn } from '../lib/utils';
import { Generators } from '../lib/voxelGenerators';
import { VoxelEngine } from '../services/VoxelEngine';
import {
  AppState,
  BuildHistory,
  LegoPart,
  SavedModel,
  VoxelData,
} from '../types';

const INITIAL_HISTORY: BuildHistory[] = [
  { id: '1', prompt: 'Eagle', timestamp: Date.now() - 3600000 },
  { id: '2', prompt: 'Rabbit', timestamp: Date.now() - 7200000 },
];

type PromptMode = 'create' | 'morph';
type JsonMode = 'import' | 'export' | null;

export default function Generator() {
  const viewerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<VoxelEngine | null>(null);

  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [leftPanelCollapsed, setLeftPanelCollapsed] = useState(false);
  const [rightPanelCollapsed, setRightPanelCollapsed] = useState(false);
  const [voxelCount, setVoxelCount] = useState(0);
  const [appState, setAppState] = useState<AppState>(AppState.STABLE);
  const [currentBaseModel, setCurrentBaseModel] = useState('Eagle');
  const [currentModelData, setCurrentModelData] = useState<VoxelData[]>([]);
  const [customBuilds, setCustomBuilds] = useState<SavedModel[]>([]);
  const [customRebuilds, setCustomRebuilds] = useState<SavedModel[]>([]);
  const [history, setHistory] = useState<BuildHistory[]>(INITIAL_HISTORY);
  const [parts, setParts] = useState<LegoPart[]>([]);
  const [isAutoRotate, setIsAutoRotate] = useState(true);
  const [jsonMode, setJsonMode] = useState<JsonMode>(null);
  const [jsonText, setJsonText] = useState('');
  const [jsonError, setJsonError] = useState('');
  const [promptMode, setPromptMode] = useState<PromptMode | null>(null);

  useEffect(() => {
    if (!viewerRef.current) {
      return;
    }

    const engine = new VoxelEngine(viewerRef.current, setAppState, setVoxelCount);
    engineRef.current = engine;
    const initialModel = Generators.Eagle();
    engine.loadInitialModel(initialModel);
    setCurrentModelData(initialModel);
    syncPartsFromVoxels(initialModel);

    const handleResize = () => engine.handleResize();
    const resizeObserver = new ResizeObserver(() => engine.handleResize());
    window.addEventListener('resize', handleResize);
    resizeObserver.observe(viewerRef.current);
    return () => {
      window.removeEventListener('resize', handleResize);
      resizeObserver.disconnect();
      engine.cleanup();
    };
  }, []);

  const relevantRebuilds = useMemo(
    () => customRebuilds.filter((item) => item.baseModel === currentBaseModel),
    [customRebuilds, currentBaseModel]
  );

  const modelLoaded = voxelCount > 0;
  const canBreak = appState === AppState.STABLE && modelLoaded;
  const canRebuild = appState === AppState.DISMANTLING && !isGenerating;

  function syncPartsFromVoxels(data: VoxelData[]) {
    const counts = new Map<number, number>();
    data.forEach((voxel) => {
      counts.set(voxel.color, (counts.get(voxel.color) || 0) + 1);
    });
    const generatedParts: LegoPart[] = Array.from(counts.entries()).map(([color, count], index) => ({
      id: `${color}-${index}`,
      name: '1x1 Brick',
      code: `Voxel #${index + 1}`,
      color: `#${color.toString(16).padStart(6, '0')}`,
      count,
    }));
    setParts(generatedParts);
  }

  function loadModel(name: string, data: VoxelData[]) {
    engineRef.current?.loadInitialModel(data);
    setCurrentBaseModel(name);
    setCurrentModelData(data);
    syncPartsFromVoxels(data);
    setHistory((prev) => [{ id: `${Date.now()}`, prompt: name, timestamp: Date.now() }, ...prev.slice(0, 7)]);
  }

  function rebuildModel(name: string, data: VoxelData[]) {
    engineRef.current?.rebuild(data);
    engineRef.current?.focusModel(data);
    setCurrentModelData(data);
    syncPartsFromVoxels(data);
    setHistory((prev) => [{ id: `${Date.now()}`, prompt: `${currentBaseModel} -> ${name}`, timestamp: Date.now() }, ...prev.slice(0, 7)]);
  }

  function handlePresetBuild(name: 'Eagle') {
    loadModel(name, Generators[name]());
  }

  function handlePresetRebuild(name: 'Cat' | 'Rabbit' | 'Twins') {
    rebuildModel(name, Generators[name]());
  }

  function handleToggleRotation() {
    const next = !isAutoRotate;
    setIsAutoRotate(next);
    engineRef.current?.setAutoRotate(next);
  }

  async function handleGenerate(mode: PromptMode) {
    if (!prompt.trim()) {
      return;
    }

    setIsGenerating(true);
    setPromptMode(mode);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      const paletteHint =
        mode === 'morph' && engineRef.current
          ? `Try to stay close to these existing colors: ${engineRef.current.getUniqueColors().join(', ')}.`
          : 'Choose colors that make the build readable and playful.';

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents:
          `Create a voxel Lego model for: ${prompt}. ` +
          `${paletteHint} Return only a JSON array. Each item must include x, y, z, color where color is a hex string like #ff0000. ` +
          `Keep the model compact and suitable for a tabletop toy sculpture.`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                x: { type: Type.NUMBER },
                y: { type: Type.NUMBER },
                z: { type: Type.NUMBER },
                color: { type: Type.STRING },
              },
              required: ['x', 'y', 'z', 'color'],
            },
          },
        },
      });

      const rawData = JSON.parse(response.text || '[]');
      const voxelData: VoxelData[] = rawData.map((voxel: { x: number; y: number; z: number; color: string }) => {
        const value = voxel.color.startsWith('#') ? voxel.color.slice(1) : voxel.color;
        return {
          x: Number(voxel.x) || 0,
          y: Number(voxel.y) || 0,
          z: Number(voxel.z) || 0,
          color: Number.parseInt(value, 16) || 0xcccccc,
        };
      });

      if (mode === 'create') {
        loadModel(prompt, voxelData);
        setCustomBuilds((prev) => [...prev, { name: prompt, data: voxelData }]);
      } else {
        rebuildModel(prompt, voxelData);
        setCustomRebuilds((prev) => [...prev, { name: prompt, data: voxelData, baseModel: currentBaseModel }]);
      }

      setPrompt('');
    } catch (error) {
      console.error('Generation failed:', error);
    } finally {
      setIsGenerating(false);
      setPromptMode(null);
    }
  }

  function openExportModal() {
    if (!engineRef.current) {
      return;
    }
    setJsonMode('export');
    setJsonText(engineRef.current.getJsonData());
    setJsonError('');
  }

  function openImportModal() {
    setJsonMode('import');
    setJsonText('');
    setJsonError('');
  }

  function handleJsonImport() {
    try {
      const rawData = JSON.parse(jsonText);
      if (!Array.isArray(rawData)) {
        throw new Error('JSON must be an array');
      }
      const voxelData: VoxelData[] = rawData.map((voxel: Record<string, unknown>) => {
        let colorValue = voxel.c ?? voxel.color;
        if (typeof colorValue === 'string' && colorValue.startsWith('#')) {
          colorValue = colorValue.slice(1);
        }
        return {
          x: Number(voxel.x) || 0,
          y: Number(voxel.y) || 0,
          z: Number(voxel.z) || 0,
          color:
            typeof colorValue === 'number'
              ? colorValue
              : Number.parseInt(String(colorValue || 'cccccc'), 16) || 0xcccccc,
        };
      });
      loadModel('Imported Build', voxelData);
      setJsonMode(null);
    } catch (error) {
      setJsonError('Invalid JSON format.');
    }
  }

  function handleCopyJson() {
    navigator.clipboard.writeText(jsonText).catch((error) => console.error(error));
  }

  function handleExportParts() {
    if (!parts.length) {
      return;
    }
    const content =
      `Build: ${currentBaseModel}\n\nParts List:\n` +
      parts.map((part) => `- ${part.name} (${part.code}): x${part.count}`).join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${currentBaseModel.replace(/\s+/g, '_')}_parts_list.txt`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex flex-1 min-h-0 overflow-hidden relative">
      <motion.aside
        initial={false}
        animate={{ width: leftPanelCollapsed ? 0 : 320, opacity: leftPanelCollapsed ? 0 : 1 }}
        className={cn(
          'glass-panel flex flex-col min-h-0 border-r border-outline-variant/10 relative z-30 overflow-hidden',
          leftPanelCollapsed && 'border-none'
        )}
      >
        <div className="p-6 flex flex-col gap-6 overflow-y-auto custom-scrollbar flex-1 min-w-[320px]">
          <div className="space-y-1">
            <h2 className="text-xs font-bold tracking-widest uppercase text-tertiary font-headline">Workbench</h2>
            <p className="text-xl font-bold font-headline leading-tight">Use the new UI to control your 3D Lego voxel builds</p>
          </div>

          <div className="rounded-2xl bg-surface-container-low p-4 border border-outline-variant/20 space-y-4">
            <textarea
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              className="w-full h-28 bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-4 text-sm text-on-surface focus:ring-2 focus:ring-tertiary focus:border-transparent outline-none transition-all resize-none"
              placeholder="Describe a brick build, for example futuristic owl tower"
            />
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleGenerate('create')}
                disabled={isGenerating}
                className="stud-button py-3 bg-primary text-on-primary rounded-xl font-headline font-bold flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isGenerating && promptMode === 'create' ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                New Build
              </button>
              <button
                onClick={() => handleGenerate('morph')}
                disabled={isGenerating || appState !== AppState.DISMANTLING}
                className="stud-button py-3 bg-secondary-container text-on-secondary-container rounded-xl font-headline font-bold flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isGenerating && promptMode === 'morph' ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                Rebuild AI
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-bold tracking-widest uppercase text-on-surface-variant">Build Library</h3>
              <span className="text-[10px] text-tertiary font-bold">{currentBaseModel}</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => handlePresetBuild('Eagle')} className="stud-button p-4 rounded-xl bg-surface-container-high text-on-surface flex flex-col items-start gap-2 border border-outline-variant/20">
                <Bird className="w-5 h-5 text-tertiary" />
                <span className="text-sm font-bold">Eagle</span>
              </button>
              <button onClick={openImportModal} className="stud-button p-4 rounded-xl bg-surface-container-high text-on-surface flex flex-col items-start gap-2 border border-outline-variant/20">
                <Upload className="w-5 h-5 text-secondary" />
                <span className="text-sm font-bold">Import JSON</span>
              </button>
            </div>
            {customBuilds.length > 0 && (
              <div className="space-y-2">
                {customBuilds.map((item, index) => (
                  <button
                    key={`${item.name}-${index}`}
                    onClick={() => loadModel(item.name, item.data)}
                    className="w-full text-left rounded-xl bg-surface-container-high px-4 py-3 border border-outline-variant/20 hover:border-tertiary/40 transition-colors"
                  >
                    <div className="text-sm font-bold text-on-surface">{item.name}</div>
                    <div className="text-[10px] uppercase tracking-wider text-on-surface-variant">Custom Build</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-bold tracking-widest uppercase text-on-surface-variant">History</h3>
              <span className="text-[10px] text-on-surface-variant">{history.length} entries</span>
            </div>
            <div className="space-y-2">
              {history.map((item) => (
                <div key={item.id} className="rounded-xl bg-surface-container-high px-4 py-3 border border-outline-variant/10">
                  <div className="text-sm font-bold text-on-surface">{item.prompt}</div>
                  <div className="text-[10px] uppercase tracking-wider text-on-surface-variant">
                    {new Date(item.timestamp).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.aside>

      <button
        onClick={() => setLeftPanelCollapsed(!leftPanelCollapsed)}
        className={cn(
          'absolute z-40 w-8 h-8 bg-surface-container-high border border-outline-variant/20 rounded-full flex items-center justify-center text-on-surface-variant hover:text-primary transition-all shadow-lg stud-button top-1/2 -translate-y-1/2',
          leftPanelCollapsed ? 'left-4' : 'left-[304px]'
        )}
      >
        {leftPanelCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>

      <main className="flex-1 min-w-0 min-h-0 relative flex flex-col bg-background overflow-hidden">
        <div className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-1 p-1.5 bg-surface-container-high/75 backdrop-blur-xl rounded-full border border-outline-variant/20 shadow-[0_18px_40px_rgba(0,0,0,0.32)] z-20">
          <button
            onClick={() => {
              if (currentModelData.length) {
                engineRef.current?.loadInitialModel(currentModelData);
              }
            }}
            className="p-2 hover:bg-surface-bright rounded-full text-on-surface-variant hover:text-tertiary transition-all"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
          <button onClick={handleToggleRotation} className="p-2 hover:bg-surface-bright rounded-full text-on-surface-variant hover:text-tertiary transition-all">
            {isAutoRotate ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </button>
          <button onClick={openExportModal} className="p-2 hover:bg-surface-bright rounded-full text-on-surface-variant hover:text-tertiary transition-all">
            <Code2 className="w-5 h-5" />
          </button>
          <div className="w-px h-4 bg-outline-variant/30 mx-1"></div>
          <button className="p-2 hover:bg-surface-bright rounded-full text-on-surface-variant hover:text-tertiary transition-all">
            <Grid3X3 className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-surface-bright rounded-full text-on-surface-variant hover:text-tertiary transition-all">
            <Camera className="w-5 h-5" />
          </button>
        </div>

        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3 rounded-full bg-surface-container-high/68 backdrop-blur-xl px-4 py-2 border border-outline-variant/20 shadow-[0_14px_32px_rgba(0,0,0,0.24)]">
          <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Voxels</span>
          <span className="text-lg font-black text-secondary">{voxelCount}</span>
          <span className="text-xs font-bold uppercase tracking-widest text-tertiary">{appState}</span>
        </div>

        <div className="flex-1 flex items-center justify-center overflow-hidden relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#1d2f52_0%,#0b1326_48%,#07101d_100%)]"></div>
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #424752 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
          <div className="absolute inset-x-[8%] top-[12%] bottom-[12%] rounded-[40px] border border-white/6 bg-white/[0.03] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"></div>
          <div ref={viewerRef} className="absolute inset-0 z-10" />

          {!modelLoaded && !isGenerating && (
            <div className="relative z-20 flex flex-col items-center text-center max-w-sm px-6 pointer-events-none">
              <div className="mb-6 relative">
                <div className="absolute -inset-10 bg-tertiary/10 blur-[60px] rounded-full"></div>
                <div className="relative w-24 h-24 bg-surface-container-high/50 rounded-3xl border border-outline-variant/30 flex items-center justify-center shadow-inner">
                  <Box className="w-12 h-12 text-on-surface-variant/40" />
                </div>
              </div>
              <h3 className="text-xl font-bold font-headline text-on-surface mb-2">No Model Loaded</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">Load a preset, import JSON, or generate a new brick sculpture from the left panel.</p>
            </div>
          )}

          {isGenerating && (
            <div className="absolute z-20 flex flex-col items-center gap-4">
              <div className="w-16 h-16 border-4 border-tertiary/20 border-t-tertiary rounded-full animate-spin"></div>
              <p className="text-tertiary font-bold animate-pulse">Assembling bricks...</p>
            </div>
          )}

          <div className="absolute bottom-6 left-6 flex items-center gap-4 text-on-surface-variant/40 z-20">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary"></span>
              <span className="text-[10px] font-label font-bold uppercase tracking-tighter">X-AXIS</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-secondary-container"></span>
              <span className="text-[10px] font-label font-bold uppercase tracking-tighter">Y-AXIS</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-tertiary"></span>
              <span className="text-[10px] font-label font-bold uppercase tracking-tighter">Z-AXIS</span>
            </div>
          </div>

        </div>
      </main>

      <div className="pointer-events-none fixed left-1/2 bottom-6 z-50 flex -translate-x-1/2 justify-center px-6">
        <div className="pointer-events-auto flex flex-wrap items-center justify-center gap-3 rounded-[28px] border border-outline-variant/20 bg-surface-container-high/80 p-3 shadow-[0_24px_50px_rgba(0,0,0,0.34)] backdrop-blur-xl">
          <button
            onClick={() => engineRef.current?.dismantle()}
            disabled={!canBreak}
            className="stud-button px-5 py-3 rounded-xl bg-primary text-on-primary font-headline font-bold flex items-center gap-2 disabled:opacity-50"
          >
            <Hammer className="w-4 h-4" />
            Break
          </button>
          <button
            onClick={() => handlePresetRebuild('Cat')}
            disabled={!canRebuild}
            className="stud-button px-5 py-3 rounded-xl bg-surface-container-high text-on-surface font-headline font-bold disabled:opacity-50"
          >
            Cat
          </button>
          <button
            onClick={() => handlePresetRebuild('Rabbit')}
            disabled={!canRebuild}
            className="stud-button px-5 py-3 rounded-xl bg-surface-container-high text-on-surface font-headline font-bold disabled:opacity-50 flex items-center gap-2"
          >
            <Rabbit className="w-4 h-4" />
            Rabbit
          </button>
          <button
            onClick={() => handlePresetRebuild('Twins')}
            disabled={!canRebuild}
            className="stud-button px-5 py-3 rounded-xl bg-surface-container-high text-on-surface font-headline font-bold disabled:opacity-50"
          >
            Eagles x2
          </button>
        </div>
      </div>

      <motion.aside
        initial={false}
        animate={{ width: rightPanelCollapsed ? 0 : 320, opacity: rightPanelCollapsed ? 0 : 1 }}
        className={cn(
          'glass-panel flex flex-col min-h-0 border-l border-outline-variant/10 relative z-30 overflow-hidden',
          rightPanelCollapsed && 'border-none'
        )}
      >
        <div className="p-6 flex flex-col h-full gap-6 min-w-[320px]">
          <div className="bg-surface-container/40 p-4 rounded-xl border border-outline-variant/20 flex items-center gap-3">
            <div className={cn('w-2 h-2 rounded-full shadow-[0_0_12px_rgba(171,199,255,0.4)]', modelLoaded ? 'bg-tertiary' : 'bg-outline-variant')}></div>
            <span className={cn('text-sm font-bold', modelLoaded ? 'text-tertiary' : 'text-on-surface-variant')}>
              {modelLoaded ? '3D build loaded' : 'Idle'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button onClick={openExportModal} className="stud-button flex flex-col items-center gap-1 p-3 bg-surface-variant rounded-xl border border-outline-variant/20 hover:text-secondary-container transition-all">
              <Download className="w-5 h-5" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Export JSON</span>
            </button>
            <button onClick={openImportModal} className="stud-button flex flex-col items-center gap-1 p-3 bg-surface-variant rounded-xl border border-outline-variant/20 hover:text-tertiary transition-all">
              <Upload className="w-5 h-5" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Import JSON</span>
            </button>
          </div>

          <div className="flex-1 flex flex-col gap-4 overflow-hidden">
            <div className="flex justify-between items-end">
              <h3 className="text-xs font-bold tracking-widest uppercase text-on-surface-variant">Parts Inventory</h3>
              <span className="text-[10px] font-bold text-on-surface-variant">TOTAL: {parts.reduce((sum, part) => sum + part.count, 0)}</span>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-2">
              {parts.map((part) => (
                <div key={part.id} className="flex items-center gap-4 p-3 bg-surface-container-high rounded-xl hover:bg-surface-bright transition-all group">
                  <div className="w-10 h-10 rounded-lg bg-surface-container-lowest flex items-center justify-center border border-outline-variant/10">
                    <div className="w-6 h-4 rounded-[2px] relative" style={{ backgroundColor: part.color }}>
                      <div className="absolute -top-1 left-1 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: part.color }}></div>
                      <div className="absolute -top-1 right-1 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: part.color }}></div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-on-surface">{part.name}</p>
                    <p className="text-[10px] text-on-surface-variant">{part.code}</p>
                  </div>
                  <span className="font-bold text-sm text-primary">x{part.count}</span>
                </div>
              ))}
            </div>
          </div>

          {relevantRebuilds.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold tracking-widest uppercase text-on-surface-variant">Saved Rebuilds</h3>
              {relevantRebuilds.map((item, index) => (
                <button
                  key={`${item.name}-${index}`}
                  onClick={() => rebuildModel(item.name, item.data)}
                  disabled={!canRebuild}
                  className="w-full rounded-xl bg-surface-container-high px-4 py-3 text-left border border-outline-variant/20 disabled:opacity-50"
                >
                  <div className="text-sm font-bold text-on-surface">{item.name}</div>
                  <div className="text-[10px] uppercase tracking-wider text-on-surface-variant">Saved AI Rebuild</div>
                </button>
              ))}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 mt-auto">
            <button
              onClick={handleExportParts}
              disabled={!modelLoaded}
              className="stud-button flex flex-col items-center gap-1 p-3 bg-surface-variant rounded-xl border border-outline-variant/20 hover:text-secondary-container transition-all disabled:opacity-50"
            >
              <Download className="w-5 h-5" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Export Parts</span>
            </button>
            <button
              onClick={handleCopyJson}
              disabled={!jsonText}
              className="stud-button flex flex-col items-center gap-1 p-3 bg-surface-variant rounded-xl border border-outline-variant/20 hover:text-tertiary transition-all disabled:opacity-50"
            >
              <Copy className="w-5 h-5" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Copy JSON</span>
            </button>
          </div>
        </div>
      </motion.aside>

      <button
        onClick={() => setRightPanelCollapsed(!rightPanelCollapsed)}
        className={cn(
          'absolute z-40 w-8 h-8 bg-surface-container-high border border-outline-variant/20 rounded-full flex items-center justify-center text-on-surface-variant hover:text-tertiary transition-all shadow-lg stud-button top-1/2 -translate-y-1/2',
          rightPanelCollapsed ? 'right-4' : 'right-[304px]'
        )}
      >
        {rightPanelCollapsed ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
      </button>

      {jsonMode && (
        <div className="absolute inset-0 z-[70] bg-black/50 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="w-full max-w-3xl rounded-3xl bg-surface-container-high border border-outline-variant/20 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/10">
              <div>
                <h3 className="text-lg font-bold text-on-surface">{jsonMode === 'import' ? 'Import JSON Blueprint' : 'Export JSON Blueprint'}</h3>
                <p className="text-xs uppercase tracking-widest text-on-surface-variant">Voxel Lego Data</p>
              </div>
              <button onClick={() => setJsonMode(null)} className="p-2 rounded-xl hover:bg-surface-bright text-on-surface-variant">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <textarea
                value={jsonText}
                onChange={(event) => setJsonText(event.target.value)}
                readOnly={jsonMode === 'export'}
                className="w-full h-[360px] rounded-2xl bg-surface-container-lowest border border-outline-variant/20 p-4 font-mono text-xs text-on-surface resize-none outline-none"
              />
              {jsonError && <div className="text-sm text-primary font-bold">{jsonError}</div>}
              <div className="flex justify-end gap-3">
                {jsonMode === 'export' ? (
                  <button onClick={handleCopyJson} className="stud-button px-5 py-3 rounded-xl bg-primary text-on-primary font-bold flex items-center gap-2">
                    <Copy className="w-4 h-4" />
                    Copy
                  </button>
                ) : (
                  <button onClick={handleJsonImport} className="stud-button px-5 py-3 rounded-xl bg-secondary-container text-on-secondary-container font-bold flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    Import
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

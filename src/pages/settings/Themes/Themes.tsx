import { GoogleIcon } from '../../../components/ui/GoogleIcon';
import { useTheme } from '../../../context/ThemeContext';
import { Card, CardHeader, CardBody } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';

const densities = [
  { id: 'compact', label: 'Compact' },
  { id: 'comfortable', label: 'Comfortable' },
  { id: 'spacious', label: 'Spacious' },
];

const fontSizes = [
  { id: 'small', label: 'Small' },
  { id: 'normal', label: 'Normal' },
  { id: 'large', label: 'Large' },
];

export const Themes: React.FC = () => {
  const { mode, setMode, accent, setCustomColor, density, setDensity, fontSize, setFontSize, resetAll } = useTheme();

  const isCustom = accent.startsWith('custom-');
  const customHex = isCustom ? '#' + accent.slice(7) : '#3B82F6';

  return (
    <Card>
      <CardHeader><div className="flex items-center gap-2"><GoogleIcon icon="palette" size={20} className="text-primary-600" /><h2 className="text-lg font-semibold text-gray-900">Appearance</h2></div></CardHeader>
      <CardBody className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2"><GoogleIcon icon="light_mode" size={16} className="inline mr-1.5 text-primary-600 align-text-bottom" />Theme Mode</label>
          <div className="flex gap-3">
            <button
              onClick={() => setMode('light')}
              className={`flex items-center gap-2 px-4 py-3 rounded border text-sm ${
                mode === 'light' ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-200 text-gray-700 hover:border-gray-300'
              }`}
            >
              <GoogleIcon icon="light_mode" size={18} />Light
            </button>
            <button
              onClick={() => setMode('dark')}
              className={`flex items-center gap-2 px-4 py-3 rounded border text-sm ${
                mode === 'dark' ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-200 text-gray-700 hover:border-gray-300'
              }`}
            >
              <GoogleIcon icon="dark_mode" size={18} />Dark
            </button>
            <button
              onClick={() => setMode('system')}
              className={`flex items-center gap-2 px-4 py-3 rounded border text-sm ${
                mode === 'system' ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-200 text-gray-700 hover:border-gray-300'
              }`}
            >
              <GoogleIcon icon="monitor" size={18} />System
            </button>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <label className="block text-sm font-medium text-gray-700 mb-2"><GoogleIcon icon="brush" size={16} className="inline mr-1.5 text-primary-600 align-text-bottom" />Accent Color</label>
          <label className={`relative inline-flex items-center gap-2 px-4 py-2.5 rounded border text-sm cursor-pointer ${isCustom ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-200 text-gray-700 hover:border-gray-300'}`} style={isCustom ? {} : {}}>
            <input type="color" value={customHex} onChange={e => setCustomColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer border-0 p-0 bg-transparent" title="Custom color" />
            <GoogleIcon icon="colorize" size={16} className="text-primary-600" />
            Custom
          </label>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <label className="block text-sm font-medium text-gray-700 mb-2"><GoogleIcon icon="density_medium" size={16} className="inline mr-1.5 text-primary-600 align-text-bottom" />Density</label>
          <div className="flex gap-2">
            {densities.map(opt => (
              <button
                key={opt.id}
                onClick={() => setDensity(opt.id)}
                className={`px-4 py-2 text-sm rounded border ${
                  density === opt.id ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-200 text-gray-700 hover:border-gray-300'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <label className="block text-sm font-medium text-gray-700 mb-2"><GoogleIcon icon="text_fields" size={16} className="inline mr-1.5 text-primary-600 align-text-bottom" />Font Size</label>
          <div className="flex gap-2">
            {fontSizes.map(opt => (
              <button
                key={opt.id}
                onClick={() => setFontSize(opt.id)}
                className={`px-4 py-2 text-sm rounded border ${
                  fontSize === opt.id ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-200 text-gray-700 hover:border-gray-300'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button variant="ghost" onClick={resetAll}>Reset to Defaults</Button>
        </div>
      </CardBody>
    </Card>
  );
};

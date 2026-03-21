import ToolPalette from './ToolPalette'
import AngleSelector from './AngleSelector'
import MatchingToggle from './MatchingToggle'
import ActionButtons from './ActionButtons'
import ResultPanel from '../ResultPanel'

export default function Sidebar({
  activeTool, onToolChange,
  angle, onAngleChange,
  isNomatch, onNomatchChange,
  result, loading, error,
  canPredict, onPredict, onClear,
}) {
  return (
    <aside className="sidebar">
      <ToolPalette activeTool={activeTool} onToolChange={onToolChange} />
      <AngleSelector angle={angle} onAngleChange={onAngleChange} />
      <MatchingToggle isNomatch={isNomatch} onChange={onNomatchChange} />
      <div className="sidebar-result">
        <ResultPanel result={result} loading={loading} error={error} />
        <ActionButtons canPredict={canPredict} onPredict={onPredict} onClear={onClear} />
      </div>
    </aside>
  )
}

import { useGameStore } from './stores/gameStore'
import { useBgm } from './hooks/useBgm'
import TitleScreen from './screens/TitleScreen'
import PrologueScreen from './screens/PrologueScreen'
import MapScreen from './screens/MapScreen'
import AreaScreen from './screens/AreaScreen'
import QuizScreen from './screens/QuizScreen'
import ExplanationScreen from './screens/ExplanationScreen'
import AreaClearScreen from './screens/AreaClearScreen'
import EndingScreen from './screens/EndingScreen'

export default function App() {
  const screen = useGameStore((s) => s.screen)
  useBgm()

  const renderScreen = () => {
    switch (screen) {
      case 'title':
        return <TitleScreen />
      case 'prologue':
        return <PrologueScreen />
      case 'map':
        return <MapScreen />
      case 'area':
        return <AreaScreen />
      case 'quiz':
        return <QuizScreen />
      case 'explanation':
        return <ExplanationScreen />
      case 'areaClear':
        return <AreaClearScreen />
      case 'ending':
        return <EndingScreen />
      default:
        return <TitleScreen />
    }
  }

  return (
    <div className="w-full max-w-md min-h-dvh flex flex-col">
      {renderScreen()}
    </div>
  )
}

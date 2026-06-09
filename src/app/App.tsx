import { AppProvider } from '@/contexts'
import { AppRouter } from '@/routes'

export default function App() {
	return (
		<AppProvider>
			<AppRouter />
		</AppProvider>
	)
}

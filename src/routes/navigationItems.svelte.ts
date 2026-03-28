import type { NavigationItem } from '$/views/NavigationItem.ts'

export const useNavigationItems = () => {
	const navigationItems = $derived([
		
	] satisfies NavigationItem[])

	return {
		get navigationItems() {
			return navigationItems
		},
	}
}

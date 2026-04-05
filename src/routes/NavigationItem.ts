export type NavigationItem = {
	id: string
	title: string
	icon?: string
	href?: string
	tag?: string
	tagIcon?: string
	defaultIsOpen?: boolean
	manualWatch?: boolean
	children?: NavigationItem[]
}

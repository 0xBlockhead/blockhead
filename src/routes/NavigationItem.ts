export type NavigationItem = {
	id: string
	title: string
	icon?: string
	address?: {
		network?: { chainId: number }
		address: `0x${string}`
	}
	href?: string
	tag?: string
	tagIcon?: string
	defaultIsOpen?: boolean
	manualWatch?: boolean
	children?: NavigationItem[]
	allChildren?: NavigationItem[]
}

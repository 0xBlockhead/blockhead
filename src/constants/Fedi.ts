// Constants
export const fediInstances = [
	{
		slug: 'fosstodon',
		origin: 'https://fosstodon.org',
	},
] as const satisfies readonly {
	slug: 'fosstodon'
	origin: string
}[]


// Lookups

export const fediInstanceBySlug = {
	fosstodon: fediInstances[0],
}

// Constants
export const cashuMints = [
	{
		slug: 'probe',
		url: 'https://8333.space:3338',
		activeKeysetId: '00d4cde34fada3fd',
	},
] as const satisfies readonly {
	slug: 'probe'
	url: string
	activeKeysetId: string
}[]


// Lookups

export const cashuMintBySlug = {
	probe: cashuMints[0],
}

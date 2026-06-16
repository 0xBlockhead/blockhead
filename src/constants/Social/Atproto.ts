// Constants
/** Stable Bluesky DID used in E2E probes, smoke routes, and hub examples. */
export const atprotoProbeDid = 'did:plc:z72i7hdynmk6r22z27h6tvur' as const

export const atprotoProbePostUri = (
	'at://did:plc:z72i7hdynmk6r22z27h6tvur/app.bsky.feed.post/3l6oveex3ii2l' as const
)

export const atprotoNetworkSeedActors = [
	{
		did: atprotoProbeDid,
	},
] as const satisfies readonly {
	did: string
}[]

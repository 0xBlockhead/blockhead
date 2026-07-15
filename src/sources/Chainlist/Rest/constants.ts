/**
 * Served from chainlist.org. CORS allows simple GETs — avoid non-simple headers (no preflight).
 * @see https://chainlist.org/rpcs.json
 */
export const origin = 'https://chainlist.org'

export const chainlistOrigins = [
	{
		origin,
		corsEnabled: true,
	},
] as const

export const eip8004ScanPublicBase = 'https://8004scan.io/api/v1/public' as const

export const eip8004ScanOrigins = [
	{
		origin: new URL(eip8004ScanPublicBase).origin,
		corsEnabled: true,
	},
] as const

import type { SourceOrigin } from '$/sources/$SourceProvider.ts'


export const eip8004ScanPublicBase = 'https://8004scan.io/api/v1/public' as const

export const eip8004ScanOrigins = [
	{
		origin: 'https://8004scan.io',
		corsEnabled: true,
	},
] as const satisfies readonly SourceOrigin[]

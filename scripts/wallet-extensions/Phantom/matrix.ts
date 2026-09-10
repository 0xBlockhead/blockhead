export const phantomWalletMatrixScenarios = (version: string) => ([
	{ id: 'phantom-connect-message-1', wallet: { kind: 'phantom', version }, accountOrdinal: 1, requestMethod: 'solana:signMessage' },
] as const)

// Constants
export const mevRelayHosts = [
	{
		chainId: 1,
		host: 'boost-relay.flashbots.net',
	},
	{
		chainId: 1,
		host: 'relay.ultrasound.money',
	},
	{
		chainId: 11155111,
		host: 'builder-relay-sepolia.flashbots.net',
	},
] as const satisfies readonly {
	chainId: number
	host: string
}[]

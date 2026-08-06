export type AvalancheInfoNetworkId = {
	networkID: string | number
}

export type AvalancheInfoNetworkName = {
	networkName: string
}

export type AvalancheInfoNodeId = {
	nodeID: string
	nodePOP?: {
		publicKey: string
		proofOfPossession: string
	}
}

export type AvalancheInfoNodeVersion = {
	version: string
	databaseVersion: string
	rpcProtocolVersion: string
	gitCommit: string
	vmVersions: Record<string, string>
}

export type AvalancheInfoPeers = {
	numPeers: string
	peers: {
		ip: string
		publicIP?: string
		nodeID: string
		version: string
		observedUptime?: string
		trackedSubnets?: string[]
	}[]
}

export type AvalancheInfoUptime = {
	rewardingStakePercentage: string
	weightedAveragePercentage: string
}

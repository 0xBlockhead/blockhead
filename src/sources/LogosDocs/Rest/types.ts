export type LogosDocsPage = {
	url: string
	title: string
}

export type LogosDocsNetworkSummary = {
	chainFramework: 'Substrate'
	networkRole: 'sub0layer'
	primaryComponents: readonly [
		'DVCI',
		'Logos Chain',
		'Network Gatekeeper',
		'W3bI',
	]
}

export type LogosDocsZoneSummary = {
	zoneId: 'DVCI' | 'Logos Chain' | 'Network Gatekeeper' | 'W3bI'
	zoneKind:
		| 'access-control'
		| 'blockchain'
		| 'computation-distribution-regulator'
		| 'distributed-virtual-computing-infrastructure'
}

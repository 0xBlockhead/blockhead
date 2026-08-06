import type { TransportType } from '$/constants/TransportType.ts'


export type QuilibriumDocsEndpoint = {
	url: string
	transportType: TransportType
	providerName: string
}

export type QuilibriumDocsNodeInterface = {
	label: string
	port: number
	transportType: TransportType
}

export type QuilibriumDocsProtocolFact = {
	label: string
	value: string
}

export type QuilibriumDocsServiceLayer = {
	label: string
	description: string
}

export type QuilibriumDocsProtocolDocument = {
	number: number
	documentBody: string
	documentCategory: string
	documentStatus: string
	documentTitle: string
}

export type QuilibriumDocsPage = {
	url: string
	title: string
}

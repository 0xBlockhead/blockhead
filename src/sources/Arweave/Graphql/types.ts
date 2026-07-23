export type ArweaveGraphqlTag = {
	name: string
	value: string
}

export type ArweaveGraphqlTransaction = {
	id: string
	anchor: string
	signature: string
	recipient: string
	owner: {
		address: string
		key: string
	}
	fee: {
		winston: string
	}
	quantity: {
		winston: string
	}
	data: {
		size: string
		type: string | null
	}
	tags: ArweaveGraphqlTag[]
	block: {
		id: string
		timestamp: number
		height: number
		previous: string
	} | null
}

export type ArweaveGraphqlTransactionEdge = {
	cursor: string
	node: ArweaveGraphqlTransaction
}

export type ArweaveGraphqlTransactionsResponse = {
	data?: {
		transactions: {
			pageInfo: {
				hasNextPage: boolean
			}
			edges: ArweaveGraphqlTransactionEdge[]
		}
	}
	errors?: {
		message: string
	}[]
}

export type ArweaveGraphqlTransactionPage = {
	edges: ArweaveGraphqlTransactionEdge[]
	nextCursor?: string
}

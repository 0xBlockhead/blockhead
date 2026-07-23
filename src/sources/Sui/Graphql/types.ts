export type SuiGraphqlPageInfo = {
	hasNextPage: boolean
	endCursor: string | null
}

export type SuiGraphqlBalance = {
	coinType: {
		repr: string
	}
	totalBalance: string
	coinBalance: string
	addressBalance: string
}

export type SuiGraphqlAddressBalances = {
	address: {
		address: string
		balances: {
			pageInfo: SuiGraphqlPageInfo
			nodes: SuiGraphqlBalance[]
		}
	} | null
}

export type SuiGraphqlTransaction = {
	digest: string
	sender: {
		address: string
	} | null
}

export type SuiGraphqlAddressTransactions = {
	address: {
		address: string
	} | null
	transactions: {
		pageInfo: SuiGraphqlPageInfo
		nodes: SuiGraphqlTransaction[]
	}
}

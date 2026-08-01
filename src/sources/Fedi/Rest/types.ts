export type FediAccount = {
	id: string
	name: string
	balance?: number
}

export type FediTransaction = {
	id: string
	amount: number
	timestamp: number
	status: 'pending' | 'confirmed' | 'failed'
}

export type FediCommunity = {
	id: string
	name: string
	members: number
}

export type TonApiAccount = {
	address: string
	balance: string
	last_activity: number
	status: 'uninit' | 'active' | 'frozen'
	interfaces: string[]
	get_methods: string[]
	is_wallet: boolean
}

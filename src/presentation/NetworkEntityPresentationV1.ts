export type NetworkResourceState = 'pending' | 'resolved-empty' | 'resolved-nonempty' | 'failed'
export type NetworkExecutionSection = 'blocks' | 'transactions'
export type NetworkSummaryDefinition = Readonly<{
	upgrade: 'Upgrade'
	block: 'Block'
	'fee-market': 'Fee market'
	'native-price': 'Native price'
	mempool: 'Mempool'
	epoch: 'Epoch'
	slot: 'Slot'
}>
export type NetworkDetailDefinition = Readonly<{
	name: 'Name'
	namespace: 'Namespace'
	'ledger-models': 'Ledger models'
	'execution-models': 'Execution models'
	'network-stack': 'Network stack'
	environment: 'Environment'
	caip2: 'CAIP-2'
}>

export type NetworkNavigationItem = Readonly<{
	label: string
	target: string
	selected: boolean
}>

type NetworkResourceCellFields = Readonly<{
	owner: string
	sources: readonly string[]
	state: NetworkResourceState
	observation: number
	value: string | null
	target: string | null
	error: string | null
	retryToken: string | null
}>

export type NetworkSummaryId = keyof NetworkSummaryDefinition
export type NetworkResourceCellFor<Id extends NetworkSummaryId> = NetworkResourceCellFields & Readonly<{
	id: Id
	label: NetworkSummaryDefinition[Id]
}>
export type NetworkResourceCell = {
	[Id in NetworkSummaryId]: NetworkResourceCellFor<Id>
}[NetworkSummaryId]

export type NetworkDetailId = keyof NetworkDetailDefinition
export type NetworkDetailRowFor<Id extends NetworkDetailId> = Readonly<{
	id: Id
	label: NetworkDetailDefinition[Id]
	value: string
	fullValue: string
}>
export type NetworkDetailRow = {
	[Id in NetworkDetailId]: NetworkDetailRowFor<Id>
}[NetworkDetailId]

export type NetworkEntityRow = Readonly<{
	key: string
	label: string
	target: string
}>

type NetworkCollectionCellBase = Readonly<{
	sources: readonly string[]
	state: NetworkResourceState
	observation: number
	rows: readonly NetworkEntityRow[]
	error: string | null
	retryToken: string | null
}>

export type NetworkBlocksCollectionCell = NetworkCollectionCellBase & Readonly<{
	id: 'blocks'
	label: 'Blocks'
	owner: 'Network.Evm.$$blocks'
	limit: 4
}>

export type NetworkTransactionsCollectionCell = NetworkCollectionCellBase & Readonly<{
	id: 'transactions'
	label: 'Transactions'
	owner: 'Network.Evm.$$transactions'
	limit: 16
}>

export type NetworkCollectionCell =
	| NetworkBlocksCollectionCell
	| NetworkTransactionsCollectionCell

export type NetworkEntityPresentationV1 = Readonly<{
	schemaVersion: 'NetworkEntityPresentationV1'
	revision: number
	route: string
	chrome: Readonly<{
		brand: 'Blockhead'
		navigation: readonly NetworkNavigationItem[]
		selectedTarget: string
		mainContentLabel: string
	}>
	entity: Readonly<{
		entityType: 'Network'
		selectorKey: string
		selector: Readonly<{ caip2: Readonly<{ namespace: string, reference: string }> }>
		fallbackTitle: string
		title: string
		annotation: 'Network'
		value: string
		expanded: boolean
	}>
	summary: readonly NetworkResourceCell[]
	details: readonly NetworkDetailRow[]
	execution: Readonly<{
		label: 'Execution'
		selectedSection: NetworkExecutionSection
		sections: Readonly<{
			blocks: NetworkBlocksCollectionCell
			transactions: NetworkTransactionsCollectionCell
		}>
	}>
	diagnostics: Readonly<{
		mountId: string
		subscriptionGeneration: number
		activeSubscriptions: 1
		persistenceGeneration: number
	}>
}>

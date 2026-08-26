<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		data,
	}: PageProps = $props()

	const pageSelection = $derived(
		(
			data.entityType === EntityType.EvmContract ?
				select(EntityType.EvmContract, data.selector, {
					sources: [
						Source.Constants_Internal,
						Source.Blockscout_Rest,
						Source.SafeTransactionService_Rest,
					],
					fields: {
						precompileName: true,
					},
				})
			:
			data.entityType === EntityType.CosmosContract ?
				select(EntityType.CosmosContract, data.selector)
			:
			data.entityType === EntityType.HederaContract ?
				select(EntityType.HederaContract, data.selector)
			:
				select(EntityType.NearContract, data.selector, {
					sources: [
						Source.NearRpc_JsonRpc,
					],
				})
		)
	)
	const entityViewByType = {
		[EntityType.EvmContract]: EvmContractView,
		[EntityType.CosmosContract]: CosmosContractView,
		[EntityType.HederaContract]: HederaContractView,
		[EntityType.NearContract]: NearContractView,
	}

	// Components
	import Page from '$/components/Page.svelte'
	import EvmContractView from '$/views/EvmContractView.svelte'
	import CosmosContractView from '$/views/CosmosContractView.svelte'
	import HederaContractView from '$/views/HederaContractView.svelte'
	import NearContractView from '$/views/NearContractView.svelte'
</script>


<svelte:head>
	<title>{
		(
			data.entityType === EntityType.EvmContract ?
				(pageSelection.entity == null ? (data.selector.address ?? '') || 'EVM contract' : [(pageSelection.entity.precompileName ?? ''), data.selector.address].filter(Boolean).join(' ') || 'EVM contract') + ' • EVM contract • Blockhead'
			:
			data.entityType === EntityType.CosmosContract ?
				(data.selector.address || 'Cosmos contract') + ' • Cosmos contract • Blockhead'
			:
			data.entityType === EntityType.HederaContract ?
				('hedera contract') + ' • hedera contract • Blockhead'
			:
				(data.selector.accountId || 'near contract') + ' • near contract • Blockhead'
		)
	}</title>
</svelte:head>


<Page>
	{@const EntityView = entityViewByType[data.entityType]}

	<EntityView
		selection={pageSelection}
	/>
</Page>

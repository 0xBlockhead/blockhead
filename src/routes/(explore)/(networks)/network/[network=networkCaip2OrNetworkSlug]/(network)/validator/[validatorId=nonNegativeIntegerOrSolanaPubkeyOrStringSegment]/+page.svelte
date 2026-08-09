<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()

	const pageSelection = $derived(
		(
			data.entityType === EntityType.BeaconValidator ?
				select(EntityType.BeaconValidator, data.selector, {
					sources: [
						Source.Beacon_Rest,
						Source.BeaconchaIn_Rest,
					],
				})
			:
			data.entityType === EntityType.SolanaValidator ?
				select(EntityType.SolanaValidator, data.selector)
			:
			data.entityType === EntityType.CosmosValidator ?
				select(EntityType.CosmosValidator, data.selector, {
					fields: {
						moniker: true,
					},
				})
			:
				select(EntityType.NearValidator, data.selector, {
					sources: [
						Source.NearRpc_JsonRpc,
					],
				})
		)
	)
	const entityViewByType = {
		[EntityType.BeaconValidator]: BeaconValidatorView,
		[EntityType.SolanaValidator]: SolanaValidatorView,
		[EntityType.CosmosValidator]: CosmosValidatorView,
		[EntityType.NearValidator]: NearValidatorView,
	}

	// Components
	import Page from '$/components/Page.svelte'
	import BeaconValidatorView from '$/views/BeaconValidatorView.svelte'
	import SolanaValidatorView from '$/views/SolanaValidatorView.svelte'
	import CosmosValidatorView from '$/views/CosmosValidatorView.svelte'
	import NearValidatorView from '$/views/NearValidatorView.svelte'
</script>


<svelte:head>
	<title>{
		(
			data.entityType === EntityType.BeaconValidator ?
				((String(data.selector.indexInNetwork ?? '') ? 'Validator #' + String(data.selector.indexInNetwork ?? '') : '') || 'beacon validator') + ' • beacon validator • Blockhead'
			:
			data.entityType === EntityType.SolanaValidator ?
				(data.selector.votePubkey || 'solana validator') + ' • solana validator • Blockhead'
			:
			data.entityType === EntityType.CosmosValidator ?
				(pageSelection.entity == null ? (data.selector.operatorAddress ?? '') || 'Cosmos validator' : [(pageSelection.entity.moniker ?? ''), data.selector.operatorAddress].filter(Boolean).join(' ') || 'Cosmos validator') + ' • Cosmos validator • Blockhead'
			:
				(data.selector.accountId || 'near validator') + ' • near validator • Blockhead'
		)
	}</title>
</svelte:head>


<Page>
	{@const EntityView = entityViewByType[data.entityType]}

	<EntityView
		selection={pageSelection}
	/>
</Page>

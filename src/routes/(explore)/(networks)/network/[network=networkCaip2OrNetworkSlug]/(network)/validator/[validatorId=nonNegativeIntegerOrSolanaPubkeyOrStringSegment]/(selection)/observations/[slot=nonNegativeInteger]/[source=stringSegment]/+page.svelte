<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()

	const entityViewByType = {
		[EntityType.BeaconValidator_Timestamp]: BeaconValidator_TimestampView,
		[EntityType.SolanaValidator_Timestamp]: SolanaValidator_TimestampView,
	}

	// Components
	import Page from '$/components/Page.svelte'
	import BeaconValidator_TimestampView from '$/views/BeaconValidator_TimestampView.svelte'
	import SolanaValidator_TimestampView from '$/views/SolanaValidator_TimestampView.svelte'
</script>


<svelte:head>
	<title>{
		(
			data.entityType === EntityType.BeaconValidator_Timestamp ?
				((String(data.selector.slot ?? '') ? 'Slot #' + String(data.selector.slot ?? '') : '') || 'beacon validator timestamp') + ' • beacon validator timestamp • Blockhead'
			:
				(String(data.selector.slot) || 'solana validator timestamp') + ' • solana validator timestamp • Blockhead'
		)
	}</title>
</svelte:head>


<Page>
	{@const EntityView = entityViewByType[data.entityType]}

	<EntityView
		selection={
			data.entityType === EntityType.BeaconValidator_Timestamp ?
				select(EntityType.BeaconValidator_Timestamp, data.selector, {
					sources: [data.selector.source],
				})
			:
				select(EntityType.SolanaValidator_Timestamp, data.selector, {
					sources: [data.selector.source],
				})
		}
	/>
</Page>

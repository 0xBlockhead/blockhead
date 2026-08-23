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
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import BeaconValidator_TimestampView from '$/views/BeaconValidator_TimestampView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.BeaconValidator_Timestamp, {
				$validator: data.selector,
				slot: Number(params.slot),
				source: params.source,
			}, {
				sources: [params.source],
			})}
		<title>{data?.title ?? ((String(pageSelection.entitySelector.slot ?? '') ? 'Slot #' + String(pageSelection.entitySelector.slot ?? '') : '') || 'beacon validator timestamp')} • beacon validator timestamp • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'beacon validator timestamp'} • beacon validator timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.BeaconValidator_Timestamp, {
				$validator: data.selector,
				slot: Number(params.slot),
				source: params.source,
			}, {
				sources: [params.source],
			})}

	<BeaconValidator_TimestampView
		selection={pageSelection}
	/>
	{/if}
</Page>

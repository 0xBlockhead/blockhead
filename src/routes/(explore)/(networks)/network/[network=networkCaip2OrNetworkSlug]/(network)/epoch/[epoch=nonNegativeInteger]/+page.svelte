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


	// Components
	import Page from '$/components/Page.svelte'
	import BeaconEpochView from '$/views/BeaconEpochView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.BeaconEpoch, data.selector, {
				sources: [
					Source.Beacon_Rest,
					Source.BeaconchaIn_Rest,
				],
			})}
		<title>{data?.title ?? ((String(pageSelection.entitySelector.epoch ?? '') ? 'Epoch #' + String(pageSelection.entitySelector.epoch ?? '') : '') || 'beacon epoch')} • beacon epoch • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'beacon epoch'} • beacon epoch • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.BeaconEpoch, data.selector, {
				sources: [
					Source.Beacon_Rest,
					Source.BeaconchaIn_Rest,
				],
			})}

	<BeaconEpochView
		selection={pageSelection}
	/>
	{/if}
</Page>

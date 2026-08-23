<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { untrack } from 'svelte'


	// State
	let {
		data,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import BeaconSlotView from '$/views/BeaconSlotView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.BeaconSlot, data.selector, {
					sources: [
						Source.Beacon_Rest,
						Source.BeaconchaIn_Rest,
					],
				}))}
			<title>{data?.title ?? ((String(pageSelection.entitySelector.slot ?? '') ? 'Slot #' + String(pageSelection.entitySelector.slot ?? '') : '') || 'beacon slot')} • beacon slot • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'beacon slot'} • beacon slot • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.BeaconSlot, data.selector, {
					sources: [
						Source.Beacon_Rest,
						Source.BeaconchaIn_Rest,
					],
				}))}

		<BeaconSlotView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>

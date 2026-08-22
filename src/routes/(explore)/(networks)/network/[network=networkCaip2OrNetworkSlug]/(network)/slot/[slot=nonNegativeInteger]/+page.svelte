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

	const pageSelection = $derived(select(EntityType.BeaconSlot, data.selector, {
		sources: [
			Source.Beacon_Rest,
			Source.BeaconchaIn_Rest,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BeaconSlotView from '$/views/BeaconSlotView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? ((String(pageSelection.entitySelector.slot ?? '') ? 'Slot #' + String(pageSelection.entitySelector.slot ?? '') : '') || 'beacon slot')} • beacon slot • Blockhead</title>
</svelte:head>


<Page>
	<BeaconSlotView
		selection={pageSelection}
	/>
</Page>

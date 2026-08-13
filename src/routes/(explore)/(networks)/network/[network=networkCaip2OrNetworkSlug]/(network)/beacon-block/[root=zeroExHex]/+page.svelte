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

	const pageSelection = $derived(select(EntityType.BeaconBlock, data.selector, {
		sources: [
			Source.Beacon_Rest,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BeaconBlockView from '$/views/BeaconBlockView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entitySelector.root || 'beacon block')} • beacon block • Blockhead</title>
</svelte:head>


<Page>
	<BeaconBlockView
		selection={pageSelection}
	/>
</Page>

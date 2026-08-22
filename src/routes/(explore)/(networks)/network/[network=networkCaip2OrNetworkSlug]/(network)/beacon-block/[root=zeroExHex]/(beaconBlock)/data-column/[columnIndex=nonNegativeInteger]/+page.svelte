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

	const pageSelection = $derived(select(EntityType.BeaconDataColumn, data.selector, {
		sources: [
			Source.Beacon_Rest,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BeaconDataColumnView from '$/views/BeaconDataColumnView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? ((String(pageSelection.entitySelector.columnIndex ?? '') ? 'Data column #' + String(pageSelection.entitySelector.columnIndex ?? '') : '') || 'beacon data column')} • beacon data column • Blockhead</title>
</svelte:head>


<Page>
	<BeaconDataColumnView
		selection={pageSelection}
	/>
</Page>

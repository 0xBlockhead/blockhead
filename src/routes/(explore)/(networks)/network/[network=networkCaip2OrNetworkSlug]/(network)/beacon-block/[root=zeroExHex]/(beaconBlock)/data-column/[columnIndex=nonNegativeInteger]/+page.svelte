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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.BeaconDataColumn, data.selector, {
		sources: [
			Source.Beacon_Rest,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BeaconDataColumnView from '$/views/BeaconDataColumnView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? ((String(pageSelection.entitySelector.columnIndex ?? '') ? 'Data column #' + String(pageSelection.entitySelector.columnIndex ?? '') : '') || 'beacon data column')} • beacon data column • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'beacon data column'} • beacon data column • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<BeaconDataColumnView
		selection={pageSelection}
	/>
	{/if}
</Page>

<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.CelestiaBlobOccurrence, {
		$block: data.selector,
		index: Number(params.index),
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import CelestiaBlobOccurrenceView from '$/views/CelestiaBlobOccurrenceView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? ((String(pageSelection.entitySelector.index ?? '') ? 'Blob occurrence #' + String(pageSelection.entitySelector.index ?? '') : '') || 'celestia blob occurrence')} • celestia blob occurrence • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'celestia blob occurrence'} • celestia blob occurrence • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<CelestiaBlobOccurrenceView
		selection={pageSelection}
	/>
	{/if}
</Page>

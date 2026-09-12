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
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.CelestiaBlock, data.selector, {
		fields: {
			hash: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import CelestiaBlockView from '$/views/CelestiaBlockView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entity == null ? String(pageSelection.entitySelector.height ?? '') || 'celestia block' : String(pageSelection.entitySelector.height) || pageSelection.entity.hash || 'celestia block')} • celestia block • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'celestia block'} • celestia block • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<CelestiaBlockView
		selection={pageSelection}
	/>
	{/if}
</Page>

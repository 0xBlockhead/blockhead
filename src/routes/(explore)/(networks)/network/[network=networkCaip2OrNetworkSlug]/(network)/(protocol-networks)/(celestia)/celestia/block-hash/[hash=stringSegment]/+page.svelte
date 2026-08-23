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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.CelestiaBlock, {
		$network: data.selector,
		hash: params.hash,
	}, {
		fields: {
			height: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import CelestiaBlockView from '$/views/CelestiaBlockView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.hash ?? '') || 'celestia block' : String(pageSelection.entity.height) || pageSelection.entitySelector.hash || 'celestia block')} • celestia block • Blockhead</title>
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

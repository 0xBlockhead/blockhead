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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.AvalanchePChainBlock, data.selector, {
		fields: {
			height: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import AvalanchePChainBlockView from '$/views/AvalanchePChainBlockView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.blockId ?? '') || 'avalanche p chain block' : String(pageSelection.entity.height) || pageSelection.entitySelector.blockId || 'avalanche p chain block')} • avalanche p chain block • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'avalanche p chain block'} • avalanche p chain block • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<AvalanchePChainBlockView
		selection={pageSelection}
	/>
	{/if}
</Page>

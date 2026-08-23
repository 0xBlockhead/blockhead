<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { untrack } from 'svelte'


	// State
	let {
		data,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import AvalanchePChainBlockView from '$/views/AvalanchePChainBlockView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.AvalanchePChainBlock, data.selector, {
					fields: {
						height: true,
					},
				}))}
			<title>{data?.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.blockId ?? '') || 'avalanche p chain block' : String(pageSelection.entity.height) || pageSelection.entitySelector.blockId || 'avalanche p chain block')} • avalanche p chain block • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'avalanche p chain block'} • avalanche p chain block • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.AvalanchePChainBlock, data.selector, {
					fields: {
						height: true,
					},
				}))}

		<AvalanchePChainBlockView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>

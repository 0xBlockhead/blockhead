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


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadIntentQuoteView from '$/views/BlockheadIntentQuoteView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.BlockheadIntentQuote, data.selector, {
				sources: [
					Source.Local_Internal,
				],
				fields: {
					providerProtocol: true,
				},
			})}
		<title>{data?.title ?? (pageSelection.entity == null ? 'blockhead intent quote' : pageSelection.entity.providerProtocol || 'blockhead intent quote')} • blockhead intent quote • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'blockhead intent quote'} • blockhead intent quote • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.BlockheadIntentQuote, data.selector, {
				sources: [
					Source.Local_Internal,
				],
				fields: {
					providerProtocol: true,
				},
			})}

	<BlockheadIntentQuoteView
		selection={pageSelection}
	/>
	{/if}
</Page>

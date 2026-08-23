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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.BlockheadIntentQuote, data.selector, {
		sources: [
			Source.Local_Internal,
		],
		fields: {
			providerProtocol: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadIntentQuoteView from '$/views/BlockheadIntentQuoteView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entity == null ? 'blockhead intent quote' : pageSelection.entity.providerProtocol || 'blockhead intent quote')} • blockhead intent quote • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'blockhead intent quote'} • blockhead intent quote • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<BlockheadIntentQuoteView
		selection={pageSelection}
	/>
	{/if}
</Page>

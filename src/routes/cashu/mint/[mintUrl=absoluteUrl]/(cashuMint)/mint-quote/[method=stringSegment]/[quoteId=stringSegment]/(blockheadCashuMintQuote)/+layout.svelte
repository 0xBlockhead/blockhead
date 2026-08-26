<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { LayoutProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		children,
		data,
		params,
	}: LayoutProps = $props()

	const detailHref = $derived(
		resolve(
			'/cashu/mint/[mintUrl=absoluteUrl]/(cashuMint)/mint-quote/[method=stringSegment]/[quoteId=stringSegment]',
			{
				mintUrl: params.mintUrl,
				method: params.method,
				quoteId: params.quoteId,
			}
		)
	)
	const detailSelection = $derived(data?.selector == null ? undefined : select(EntityType.BlockheadCashuMintQuote, data.selector))


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import BlockheadCashuMintQuoteView from '$/views/BlockheadCashuMintQuoteView.svelte'
</script>


<ParentPageCollapsible
	href={detailHref}
>
	{#snippet Summary()}
		{#if detailSelection != null}
			<BlockheadCashuMintQuoteView
				selection={detailSelection}
				href={detailHref}
				layout={EntityLayout.SummaryInline}
			/>
		{/if}
	{/snippet}

	{@render children()}
</ParentPageCollapsible>

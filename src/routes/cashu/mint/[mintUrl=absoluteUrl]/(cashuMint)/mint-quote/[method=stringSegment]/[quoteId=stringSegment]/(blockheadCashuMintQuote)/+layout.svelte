<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { LayoutProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


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


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import BlockheadCashuMintQuoteView from '$/views/BlockheadCashuMintQuoteView.svelte'
</script>


<ParentPageCollapsible
	href={detailHref}
>
	{#snippet Summary()}
		<BlockheadCashuMintQuoteView
			selection={select(EntityType.BlockheadCashuMintQuote, data.selector)}
			href={detailHref}
			layout={EntityLayout.SummaryInline}
		/>
	{/snippet}

	{@render children()}
</ParentPageCollapsible>

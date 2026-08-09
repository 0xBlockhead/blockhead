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


	// Components
	import Page from '$/components/Page.svelte'
	import SwapQuoteStepView from '$/views/SwapQuoteStepView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? 'swap quote step'} • swap quote step • Blockhead</title>
</svelte:head>


<Page>
	<SwapQuoteStepView
		selection={
			select(EntityType.SwapQuoteStep, {
				$quote: data.selector,
				indexInQuote: Number(params.indexInQuote),
			})
		}
	/>
</Page>

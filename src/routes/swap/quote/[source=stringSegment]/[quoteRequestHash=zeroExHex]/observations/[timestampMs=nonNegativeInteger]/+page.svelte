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
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import SwapQuote_TimestampView from '$/views/SwapQuote_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? 'swap quote timestamp'} • swap quote timestamp • Blockhead</title>
</svelte:head>


<Page>
	<SwapQuote_TimestampView
		selection={
			select(EntityType.SwapQuote_Timestamp, data.selector, {
				sources: [data.selector.source],
			})
		}
	/>
</Page>

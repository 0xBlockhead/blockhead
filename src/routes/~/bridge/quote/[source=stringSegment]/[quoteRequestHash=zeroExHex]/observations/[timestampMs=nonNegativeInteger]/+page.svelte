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

	const pageSelection = $derived(select(EntityType.BridgeRouteQuote_Timestamp, data.selector, {
		sources: [data.selector.source],
		fields: {
			fromChainId: true,
			toChainId: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BridgeRouteQuote_TimestampView from '$/views/BridgeRouteQuote_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entity == null ? 'to' : [String(pageSelection.entity.fromChainId), 'to', String(pageSelection.entity.toChainId)].filter(Boolean).join(' ') || 'bridge route quote timestamp')} • bridge route quote timestamp • Blockhead</title>
</svelte:head>


<Page>
	<BridgeRouteQuote_TimestampView
		selection={pageSelection}
	/>
</Page>

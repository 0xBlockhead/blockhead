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

	const pageSelection = $derived(select(EntityType.AvalanchePChainTransaction_Timestamp, {
		$transaction: data.selector,
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import AvalanchePChainTransaction_TimestampView from '$/views/AvalanchePChainTransaction_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (String(pageSelection.entitySelector.timestampMs) || 'avalanche p chain transaction timestamp')} • avalanche p chain transaction timestamp • Blockhead</title>
</svelte:head>


<Page>
	<AvalanchePChainTransaction_TimestampView
		selection={pageSelection}
	/>
</Page>

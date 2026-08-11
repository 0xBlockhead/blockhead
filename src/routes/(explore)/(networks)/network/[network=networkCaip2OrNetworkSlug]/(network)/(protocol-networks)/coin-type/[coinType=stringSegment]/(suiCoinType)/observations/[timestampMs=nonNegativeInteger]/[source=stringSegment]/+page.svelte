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

	const pageSelection = $derived(select(EntityType.SuiRegulatedCoinState_Timestamp, {
		$coinType: data.selector,
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import SuiRegulatedCoinState_TimestampView from '$/views/SuiRegulatedCoinState_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (String(pageSelection.entitySelector.timestampMs) || 'Sui regulated coin state timestamp')} • Sui regulated coin state timestamp • Blockhead</title>
</svelte:head>


<Page>
	<SuiRegulatedCoinState_TimestampView
		selection={pageSelection}
	/>
</Page>

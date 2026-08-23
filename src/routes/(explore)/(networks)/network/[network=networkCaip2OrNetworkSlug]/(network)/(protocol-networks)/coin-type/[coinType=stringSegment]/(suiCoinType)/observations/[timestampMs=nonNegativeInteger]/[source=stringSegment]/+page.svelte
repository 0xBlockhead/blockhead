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
	import SuiRegulatedCoinState_TimestampView from '$/views/SuiRegulatedCoinState_TimestampView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.SuiRegulatedCoinState_Timestamp, {
				$coinType: data.selector,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			}, {
				sources: [params.source],
			})}
		<title>{data?.title ?? (String(pageSelection.entitySelector.timestampMs) || 'Sui regulated coin state timestamp')} • Sui regulated coin state timestamp • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Sui regulated coin state timestamp'} • Sui regulated coin state timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.SuiRegulatedCoinState_Timestamp, {
				$coinType: data.selector,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			}, {
				sources: [params.source],
			})}

	<SuiRegulatedCoinState_TimestampView
		selection={pageSelection}
	/>
	{/if}
</Page>

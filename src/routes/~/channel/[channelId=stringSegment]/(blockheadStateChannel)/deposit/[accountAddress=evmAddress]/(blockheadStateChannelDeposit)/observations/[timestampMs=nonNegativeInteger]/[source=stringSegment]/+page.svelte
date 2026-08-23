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
	import BlockheadStateChannelDeposit_TimestampView from '$/views/BlockheadStateChannelDeposit_TimestampView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.BlockheadStateChannelDeposit_Timestamp, {
				$deposit: data.selector,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			}, {
				sources: [params.source],
			})}
		<title>{data?.title ?? (String(pageSelection.entitySelector.timestampMs) || 'blockhead state channel deposit timestamp')} • blockhead state channel deposit timestamp • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'blockhead state channel deposit timestamp'} • blockhead state channel deposit timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.BlockheadStateChannelDeposit_Timestamp, {
				$deposit: data.selector,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			}, {
				sources: [params.source],
			})}

	<BlockheadStateChannelDeposit_TimestampView
		selection={pageSelection}
	/>
	{/if}
</Page>

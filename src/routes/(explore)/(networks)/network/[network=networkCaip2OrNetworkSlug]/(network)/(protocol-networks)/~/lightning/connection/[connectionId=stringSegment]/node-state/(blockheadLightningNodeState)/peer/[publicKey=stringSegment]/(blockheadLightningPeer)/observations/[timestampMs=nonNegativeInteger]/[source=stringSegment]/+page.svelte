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
	import BlockheadLightningPeer_TimestampView from '$/views/BlockheadLightningPeer_TimestampView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.BlockheadLightningPeer_Timestamp, {
				$peer: data.selector,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			}, {
				sources: [params.source],
			})}
		<title>{data?.title ?? (String(pageSelection.entitySelector.timestampMs) || 'local LND peer observation')} • local LND peer observation • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'local LND peer observation'} • local LND peer observation • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.BlockheadLightningPeer_Timestamp, {
				$peer: data.selector,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			}, {
				sources: [params.source],
			})}

	<BlockheadLightningPeer_TimestampView
		selection={pageSelection}
	/>
	{/if}
</Page>

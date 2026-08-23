<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadLightningForwardView from '$/views/BlockheadLightningForwardView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.BlockheadLightningForward, {
				$localNodeState: data.selector,
				$incomingChannel: {
					$network: data.selector.$network.$network,
					channelId: params.incomingChannelId,
				},
				incomingHtlcId: BigInt(params.incomingHtlcId),
			}, {
				sources: [
					Source.LightningLnd_Rest,
					Source.Local_Internal,
				],
			})}
		<title>{data?.title ?? 'local LND forward'} • local LND forward • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'local LND forward'} • local LND forward • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.BlockheadLightningForward, {
				$localNodeState: data.selector,
				$incomingChannel: {
					$network: data.selector.$network.$network,
					channelId: params.incomingChannelId,
				},
				incomingHtlcId: BigInt(params.incomingHtlcId),
			}, {
				sources: [
					Source.LightningLnd_Rest,
					Source.Local_Internal,
				],
			})}

	<BlockheadLightningForwardView
		selection={pageSelection}
	/>
	{/if}
</Page>

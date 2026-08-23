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
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadLightningChannelStateView from '$/views/BlockheadLightningChannelStateView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.BlockheadLightningChannelState, data.selector, {
				sources: [
					Source.LightningLnd_Rest,
					Source.Local_Internal,
				],
			})}
		<title>{data?.title ?? 'local LND channel state'} • local LND channel state • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'local LND channel state'} • local LND channel state • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.BlockheadLightningChannelState, data.selector, {
				sources: [
					Source.LightningLnd_Rest,
					Source.Local_Internal,
				],
			})}

	<BlockheadLightningChannelStateView
		selection={pageSelection}
	/>
	{/if}
</Page>

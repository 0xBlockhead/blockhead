<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { untrack } from 'svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import LightningChannelRoutingPolicy_TimestampView from '$/views/LightningChannelRoutingPolicy_TimestampView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.LightningChannelRoutingPolicy_Timestamp, {
					$channelTimestamp: data.selector,
					$towardNode: {
						$network: data.selector.$channel.$network,
						publicKey: params.publicKey,
					},
				}))}
			<title>{data?.title ?? 'Lightning channel routing policy'} • Lightning channel routing policy • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'Lightning channel routing policy'} • Lightning channel routing policy • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.LightningChannelRoutingPolicy_Timestamp, {
					$channelTimestamp: data.selector,
					$towardNode: {
						$network: data.selector.$channel.$network,
						publicKey: params.publicKey,
					},
				}))}

		<LightningChannelRoutingPolicy_TimestampView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>

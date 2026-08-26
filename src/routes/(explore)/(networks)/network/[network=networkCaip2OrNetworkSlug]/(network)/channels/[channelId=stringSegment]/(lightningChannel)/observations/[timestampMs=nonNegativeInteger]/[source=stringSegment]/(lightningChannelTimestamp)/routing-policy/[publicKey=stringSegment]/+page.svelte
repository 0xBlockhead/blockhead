<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.LightningChannelRoutingPolicy_Timestamp, {
		$channelTimestamp: data.selector,
		$towardNode: {
			$network: data.selector.$channel.$network,
			publicKey: params.publicKey,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import LightningChannelRoutingPolicy_TimestampView from '$/views/LightningChannelRoutingPolicy_TimestampView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'Lightning channel routing policy'} • Lightning channel routing policy • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Lightning channel routing policy'} • Lightning channel routing policy • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<LightningChannelRoutingPolicy_TimestampView
		selection={pageSelection}
	/>
	{/if}
</Page>

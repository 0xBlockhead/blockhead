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
	import LightningChannelRoutingPolicy_TimestampView from '$/views/LightningChannelRoutingPolicy_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? 'Lightning channel routing policy'} • Lightning channel routing policy • Blockhead</title>
</svelte:head>


<Page>
	<LightningChannelRoutingPolicy_TimestampView
		selection={
			select(EntityType.LightningChannelRoutingPolicy_Timestamp, {
				$channelTimestamp: data.selector,
				$towardNode: {
					$network: data.selector.$channel.$network,
					publicKey: params.publicKey,
				},
			})
		}
	/>
</Page>

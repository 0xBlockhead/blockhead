<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import LightningChannelView from '$/views/LightningChannelView.svelte'
</script>


<Page>
	<LightningChannelView
		href={
			resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/channels/[channelId]', {
				networkSlug: params.networkSlug,
				channelId: params.channelId,
			})
		}
		selection={
			select(EntityType.LightningChannel, {
				$network: {
					slug: params.networkSlug,
				},
				channelId: params.channelId,
			}, {
				sources: [
					Source.LightningMempoolSpace_Rest,
					Source.LightningLnd_Rest,
				],
				fields: {
					shortChannelId: true,
					$node1: true,
					fundingTransactionId: true,
					fundingOutputIndex: true,
					openedAtMs: true,
				},
			})
		}
	/>
</Page>

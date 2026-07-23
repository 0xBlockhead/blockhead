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
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.LightningChannel, data.selector, {
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
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import LightningChannelView from '$/views/LightningChannelView.svelte'
</script>


<svelte:head>
	<title>{(data.title ?? (pageSelection.entity == null ? [String((data.selector.channelId) ?? '')].filter(Boolean).join(' ') || 'Lightning channel' : [String((({ ...data.selector, ...pageSelection.entity }).shortChannelId) ?? '')].filter(Boolean).join(' ') || [String((({ ...data.selector, ...pageSelection.entity }).channelId) ?? '')].filter(Boolean).join(' ') || 'Lightning channel'))} • Lightning channel • Blockhead</title>
</svelte:head>


<Page>
	<LightningChannelView
		href={
			resolve('/network/[network=networkCaip2OrNetworkSlug]/channels/[channelId=stringSegment]', {
				network: params.network,
				channelId: params.channelId,
			})
		}
		selection={pageSelection}
	/>
</Page>

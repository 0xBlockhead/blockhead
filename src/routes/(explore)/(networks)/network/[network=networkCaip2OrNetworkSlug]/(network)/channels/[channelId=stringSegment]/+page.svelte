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
	const pageEntityTitle = $derived((data.title ?? (pageSelection.entity == null ? [String((pageSelection.entitySelector.shortChannelId) ?? '')].filter(Boolean).join(' ') || [String((pageSelection.entitySelector.channelId) ?? '')].filter(Boolean).join(' ') || 'Lightning channel' : [String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).shortChannelId) ?? '')].filter(Boolean).join(' ') || [String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).channelId) ?? '')].filter(Boolean).join(' ') || 'Lightning channel')))


	// Components
	import Page from '$/components/Page.svelte'
	import LightningChannelView from '$/views/LightningChannelView.svelte'
</script>


<svelte:head>
	<title>{pageEntityTitle} • Lightning channel • Blockhead</title>
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

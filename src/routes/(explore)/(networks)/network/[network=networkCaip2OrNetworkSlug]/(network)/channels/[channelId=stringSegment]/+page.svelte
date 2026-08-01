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
	<title>{data.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.channelId ?? '') || 'Lightning channel' : (pageSelection.entity.shortChannelId ?? '') || pageSelection.entitySelector.channelId || 'Lightning channel')} • Lightning channel • Blockhead</title>
</svelte:head>


<Page>
	<LightningChannelView
		selection={pageSelection}
	/>
</Page>

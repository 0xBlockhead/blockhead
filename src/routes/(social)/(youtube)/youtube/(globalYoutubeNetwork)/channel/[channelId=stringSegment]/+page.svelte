<!-- Generated from APP.ts. Do not edit by hand. -->

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

	const pageSelection = $derived(select(EntityType.YoutubeChannel, data.selector, {
		sources: [
			Source.Youtube_Rest,
			Source.Piped_Rest,
			Source.Constants_Internal,
		],
		fields: {
			$icon: true,
			title: true,
			description: true,
			customUrl: true,
			publishedAtMs: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import YoutubeChannelView from '$/views/YoutubeChannelView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.channelId ?? '') || 'YouTube channel' : (pageSelection.entity.title ?? '') || pageSelection.entitySelector.channelId || 'YouTube channel')} • YouTube channel • Blockhead</title>
</svelte:head>


<Page>
	<YoutubeChannelView
		selection={pageSelection}
	/>
</Page>

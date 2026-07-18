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
	const pageEntityTitle = $derived((data.title ?? (pageSelection.entity == null ? [String((pageSelection.entitySelector.title) ?? '')].filter(Boolean).join(' ') || [String((pageSelection.entitySelector.channelId) ?? '')].filter(Boolean).join(' ') || 'YouTube channel' : [String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).title) ?? '')].filter(Boolean).join(' ') || [String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).channelId) ?? '')].filter(Boolean).join(' ') || 'YouTube channel')))


	// Components
	import Page from '$/components/Page.svelte'
	import YoutubeChannelView from '$/views/YoutubeChannelView.svelte'
</script>


<svelte:head>
	<title>{pageEntityTitle} • YouTube channel • Blockhead</title>
</svelte:head>


<Page>
	<YoutubeChannelView
		href={
			resolve('/youtube/channel/[channelId=stringSegment]', {
				channelId: params.channelId,
			})
		}
		selection={pageSelection}
	/>
</Page>

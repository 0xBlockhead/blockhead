<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import YoutubeChannelView from '$/views/YoutubeChannelView.svelte'
</script>


<svelte:head>
	<title>YouTube channel • Blockhead</title>
</svelte:head>


<Page>
	<YoutubeChannelView
		href={
			resolve('/(social)/(youtube)/youtube/channel/[channelId]', {
				channelId: params.channelId,
			})
		}
		selection={
			select(EntityType.YoutubeChannel, data.selector, {
				fields: {
					$icon: true,
					title: true,
					description: true,
					customUrl: true,
					publishedAtMs: true,
				},
			})
		}
	/>
</Page>

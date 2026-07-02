<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityProxyField } from '$/client/$proxy.svelte.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import YoutubeVideosView from '$/views/YoutubeVideosView.svelte'
</script>


<svelte:head>
	<title>Channel videos • Blockhead</title>
</svelte:head>


<Page>
	<YoutubeVideosView
		href={
			resolve('/(social)/(youtube)/youtube/channel/[channelId]/(channel)/videos', {
				channelId: params.channelId,
			})
		}
		title='Channel videos'
		selection={
			select(EntityType.YoutubeChannel, {
				channelId: decodeURIComponent(params.channelId),
			})[EntityProxyField]<EntityType.YoutubeVideo>('$$videos')
		}
		id='YoutubeVideosView-page'
	/>
</Page>

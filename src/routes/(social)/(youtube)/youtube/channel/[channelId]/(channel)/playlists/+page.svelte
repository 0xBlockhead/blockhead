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
	import YoutubePlaylistsView from '$/views/YoutubePlaylistsView.svelte'
</script>


<svelte:head>
	<title>Channel playlists • Blockhead</title>
</svelte:head>


<Page>
	<YoutubePlaylistsView
		href={
			resolve('/(social)/(youtube)/youtube/channel/[channelId]/(channel)/playlists', {
				channelId: params.channelId,
			})
		}
		title='Channel playlists'
		selection={
			select(EntityType.YoutubeChannel, {
				channelId: decodeURIComponent(params.channelId),
			})[EntityProxyField]<EntityType.YoutubePlaylist>('$$playlists')
		}
		id='YoutubePlaylistsView-page'
	/>
</Page>

<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { EntityProxyField } from '$/client/$proxy.svelte.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// Components
	import Page from '$/components/Page.svelte'
	import YoutubeChannelsView from '$/views/YoutubeChannelsView.svelte'
</script>


<svelte:head>
	<title>YouTube channels • Blockhead</title>
</svelte:head>


<Page>
	<YoutubeChannelsView
		href={resolve('/(social)/(youtube)/youtube/channels')}
		title='YouTube channels'
		selection={
			select(EntityType._GlobalYoutubeNetwork, {
				scope: '_GlobalYoutubeNetwork',
			})[EntityProxyField]<EntityType.YoutubeChannel>('$$sourceWindowChannels')
		}
		id='YoutubeChannelsView-page'
	/>
</Page>

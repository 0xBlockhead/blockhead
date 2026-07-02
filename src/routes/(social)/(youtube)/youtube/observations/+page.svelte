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
	import GlobalYoutubeNetwork_TimestampsView from '$/views/_GlobalYoutubeNetwork_TimestampsView.svelte'
</script>


<svelte:head>
	<title>YouTube observations • Blockhead</title>
</svelte:head>


<Page>
	<GlobalYoutubeNetwork_TimestampsView
		href={resolve('/(social)/(youtube)/youtube/observations')}
		title='YouTube observations'
		selection={
			select(EntityType._GlobalYoutubeNetwork, {
				scope: '_GlobalYoutubeNetwork',
			})[EntityProxyField]<EntityType._GlobalYoutubeNetwork_Timestamp>('$$timestamps')
		}
		id='GlobalYoutubeNetwork_TimestampsView-page'
	/>
</Page>

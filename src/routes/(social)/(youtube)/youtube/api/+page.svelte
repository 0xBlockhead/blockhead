<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// Components
	import Page from '$/components/Page.svelte'
	import YoutubeNetworkView from '$/views/YoutubeNetworkView.svelte'
</script>


<Page>
	<YoutubeNetworkView
		href={resolve('/(social)/(youtube)/youtube/api')}
		selection={
			select(EntityType.YoutubeNetwork, {
				scope: 'YoutubeNetwork',
			}, {
				sources: [
					Source.Constants_Internal,
				],
				fields: {
					protocolName: true,
					homeUrl: true,
					docsUrl: true,
				},
			})
		}
	/>
</Page>

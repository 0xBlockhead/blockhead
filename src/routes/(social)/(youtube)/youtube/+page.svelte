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
	import GlobalYoutubeNetworkView from '$/views/_GlobalYoutubeNetworkView.svelte'
</script>


<Page>
	<GlobalYoutubeNetworkView
		href={resolve('/(social)/(youtube)/youtube')}
		selection={
			select(EntityType._GlobalYoutubeNetwork, {
				scope: '_GlobalYoutubeNetwork',
			}, {
				sources: [
					Source.Constants_Internal,
				],
			})
		}
	/>
</Page>

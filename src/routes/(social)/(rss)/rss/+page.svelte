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
	import RssNetworkView from '$/views/RssNetworkView.svelte'
</script>


<Page>
	<RssNetworkView
		href={resolve('/(social)/(rss)/rss')}
		selection={
			select(EntityType.RssNetwork, {
				scope: 'RssNetwork',
			}, {
				sources: [
					Source.Constants_Internal,
				],
				fields: {
					protocolName: true,
					homeUrl: true,
					docsUrl: true,
					registryName: true,
					relationshipModel: true,
				},
			})
		}
	/>
</Page>

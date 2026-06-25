<script lang="ts">
	import { select } from '$/routes/+layout.svelte'
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'


	// Components
	import Page from '$/components/Page.svelte'
	import RssItemsView from '$/views/RssItemsView.svelte'
</script>


<Page>
	<RssItemsView
		href={resolve('/rss/items')}
		selection={select(
			EntityType.RssNetwork,
			{ scope: 'RssNetwork' }
		).$$rssItems}
		id="rss-items"
		title="Recent items"
	/>
</Page>

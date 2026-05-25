<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/$EntityType.ts'


	// Context
	import { resolve } from '$app/paths'


	// Components
	import Page from '$/components/Page.svelte'
	import RssItemsView from '$/views/RssItemsView.svelte'
</script>


<Page>
	<RssItemsView
		href={resolve('/rss/items')}
		entityFieldReference={{
			entityType: EntityType.RssNetwork,
			entityId: { scope: 'RssNetwork' },
			fieldName: '$$rssItems',
		}}
		id="rss-items"
		title="Recent items"
	/>
</Page>

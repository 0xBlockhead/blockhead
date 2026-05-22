<script lang="ts">
	// Context
	import { resolve } from '$app/paths'

	import { EntityType } from '$/schema/$EntityType.ts'


	// Components
	import Page from '$/components/Page.svelte'
	import RssItemsView from '$/views/RssItemsView.svelte'
</script>


<Page>
	<RssItemsView
		entityFieldReference={{
			entityType: EntityType.RssNetwork,
			entityId: { scope: 'RssNetwork' },
			fieldName: '$$rssItems',
		}}
		href={resolve('/rss/items')}
		id="rss-items"
		title="Recent items"
	/>
</Page>

<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'

	// Components
	import Page from '$/components/Page.svelte'
	import NostrArticlesView from '$/views/NostrArticlesView.svelte'
</script>


<Page>
	<NostrArticlesView
		entityFieldReference={{
			entityType: EntityType.NostrNetwork,
			selector: { scope: 'NostrNetwork' },
			fieldName: '$$nostrArticles',
		}}
		id="nostr-articles"
		title="Articles"
	/>
</Page>

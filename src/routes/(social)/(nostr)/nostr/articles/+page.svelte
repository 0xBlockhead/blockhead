<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/$EntityType.ts'


	// Context
	import { resolve } from '$app/paths'


	// Components
	import Page from '$/components/Page.svelte'
	import NostrArticlesView from '$/views/NostrArticlesView.svelte'
</script>


<Page>
	<NostrArticlesView
		entityFieldReference={{
			entityType: EntityType.NostrNetwork,
			entityId: { scope: 'NostrNetwork' },
			fieldName: '$$nostrArticles',
		}}
		id="nostr-articles"
		title="Articles"
	/>
</Page>

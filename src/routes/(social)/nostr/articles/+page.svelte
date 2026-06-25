<script lang="ts">
	import { select } from '$/routes/+layout.svelte'
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'

	// Components
	import Page from '$/components/Page.svelte'
	import NostrArticlesView from '$/views/NostrArticlesView.svelte'
</script>


<Page>
	<NostrArticlesView
		selection={select(
			EntityType.NostrNetwork,
			{ scope: 'NostrNetwork' }
		).$$nostrArticles}
		id="nostr-articles"
		title="Articles"
	/>
</Page>

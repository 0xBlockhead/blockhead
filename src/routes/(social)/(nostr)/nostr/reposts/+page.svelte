<script lang="ts">
	import { select } from '$/routes/+layout.svelte'
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'

	// Components
	import Page from '$/components/Page.svelte'
	import NostrRepostsView from '$/views/NostrRepostsView.svelte'
</script>


<Page>
	<NostrRepostsView
		selection={select(
			EntityType.NostrNetwork,
			{ scope: 'NostrNetwork' }
		).$$nostrReposts}
		id="nostr-reposts"
		title="Reposts"
	/>
</Page>

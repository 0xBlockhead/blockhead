<script lang="ts">
	import { select } from '$/routes/+layout.svelte'
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'

	let { data }: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import NostrArticlesView from '$/views/NostrArticlesView.svelte'
</script>


<Page>
	<NostrArticlesView
		selection={select(
			EntityType.NostrProfile,
			data.selector
		).$$articles}
		id="nostr-profile-articles"
	/>
</Page>

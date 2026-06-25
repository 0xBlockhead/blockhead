<script lang="ts">
	import { select } from '$/routes/+layout.svelte'
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'

	let { data }: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import NostrRepostsView from '$/views/NostrRepostsView.svelte'
</script>


<Page>
	<NostrRepostsView
		selection={select(
			EntityType.NostrProfile,
			data.selector
		).$$reposts}
		id="nostr-profile-reposts"
	/>
</Page>

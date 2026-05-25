<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/$EntityType.ts'


	// Context
	import { resolve } from '$app/paths'


	// Components
	import Page from '$/components/Page.svelte'
	import NostrRepostsView from '$/views/NostrRepostsView.svelte'
</script>


<Page>
	<NostrRepostsView
		entityFieldReference={{
			entityType: EntityType.NostrNetwork,
			entityId: { scope: 'NostrNetwork' },
			fieldName: '$$nostrReposts',
		}}
		id="nostr-reposts"
		title="Reposts"
	/>
</Page>

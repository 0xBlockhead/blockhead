<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


	// Components
	import Page from '$/components/Page.svelte'
	import NostrRepostsView from '$/views/NostrRepostsView.svelte'
	import { EntityType } from '$/schema/$EntityType.ts'
</script>


<Page>
	<NostrRepostsView
		entityFieldReference={{
			entityType: EntityType.NostrNetwork,
			entityId: { scope: 'NostrNetwork' },
			fieldName: '$$nostrReposts',
		}}
		href={resolve('/(social)/(nostr)/nostr/reposts')}
		id="nostr-reposts"
		title="Reposts"
	/>
</Page>

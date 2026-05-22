<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


	// Components
	import Page from '$/components/Page.svelte'
	import NostrProfilesView from '$/views/NostrProfilesView.svelte'
	import { EntityType } from '$/schema/$EntityType.ts'
</script>


<Page>
	<NostrProfilesView
		entityFieldReference={{
			entityType: EntityType.NostrNetwork,
			entityId: { scope: 'NostrNetwork' },
			fieldName: '$$nostrProfiles',
		}}
		href={resolve('/nostr/profiles')}
		id="nostr-profiles"
	/>
</Page>

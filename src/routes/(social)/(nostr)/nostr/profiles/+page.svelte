<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/$EntityType.ts'


	// Context
	import { resolve } from '$app/paths'


	// Components
	import Page from '$/components/Page.svelte'
	import NostrProfilesView from '$/views/NostrProfilesView.svelte'
</script>


<Page>
	<NostrProfilesView
		href={resolve('/nostr/profiles')}
		entityFieldReference={{
			entityType: EntityType.NostrNetwork,
			entityId: { scope: 'NostrNetwork' },
			fieldName: '$$nostrProfiles',
		}}
		id="nostr-profiles"
	/>
</Page>

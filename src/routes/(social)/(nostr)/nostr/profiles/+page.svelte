<script lang="ts">
	import { select } from '$/routes/+layout.svelte'
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'


	// Components
	import Page from '$/components/Page.svelte'
	import NostrProfilesView from '$/views/NostrProfilesView.svelte'
</script>


<Page>
	<NostrProfilesView
		href={resolve('/nostr/profiles')}
		selection={select(
			EntityType.NostrNetwork,
			{ scope: 'NostrNetwork' }
		)}
		id="nostr-profiles"
	/>
</Page>

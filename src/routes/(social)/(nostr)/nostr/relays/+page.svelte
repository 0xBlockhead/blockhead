<script lang="ts">
	import { select } from '$/routes/+layout.svelte'
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'


	// Components
	import Page from '$/components/Page.svelte'
	import NostrRelaysView from '$/views/NostrRelaysView.svelte'
</script>


<Page>
	<NostrRelaysView
		href={resolve('/nostr/relays')}
		selection={select(
			EntityType.NostrNetwork,
			{ scope: 'NostrNetwork' }
		).$$nostrRelays}
		id="nostr-relays"
		title="Relays"
	/>
</Page>

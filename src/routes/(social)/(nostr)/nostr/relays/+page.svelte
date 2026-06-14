<script lang="ts">
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
		entityFieldReference={{
			entityType: EntityType.NostrNetwork,
			selector: { scope: 'NostrNetwork' },
			fieldName: '$$nostrRelays',
		}}
		id="nostr-relays"
		title="Relays"
	/>
</Page>

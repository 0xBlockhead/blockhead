<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


	// Components
	import Page from '$/components/Page.svelte'
	import NostrRelaysView from '$/views/NostrRelaysView.svelte'
	import { EntityType } from '$/schema/$EntityType.ts'
</script>


<Page>
	<NostrRelaysView
		entityFieldReference={{
			entityType: EntityType.NostrNetwork,
			entityId: { scope: 'NostrNetwork' },
			fieldName: '$$nostrRelays',
		}}
		href={resolve('/(social)/(nostr)/nostr/relays')}
		id="nostr-relays"
		title="Relays"
	/>
</Page>

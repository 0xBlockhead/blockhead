<script lang="ts">
	import type { PageProps } from './$types.ts'

	// Context
	import { resolve } from '$app/paths'


	// Props
	let { data }: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import NostrNotesView from '$/views/NostrNotesView.svelte'
	import { EntityType } from '$/schema/$EntityType.ts'
</script>


<Page>
	<NostrNotesView
		entityFieldReference={{
			entityType: EntityType.NostrProfile,
			entityId: data.entityId,
			fieldName: '$$notes',
		}}
		href={resolve('/(social)/(nostr)/nostr/profile/[pubkey]/(profile)/notes', {
			pubkey: data.entityId.pubkey,
		})}
		id="nostr-profile-notes"
	/>
</Page>

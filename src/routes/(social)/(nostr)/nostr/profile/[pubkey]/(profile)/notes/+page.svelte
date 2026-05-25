<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/$EntityType.ts'


	// Context
	import { resolve } from '$app/paths'


	// Props
	let { data }: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import NostrNotesView from '$/views/NostrNotesView.svelte'
</script>


<Page>
	<NostrNotesView
		href={resolve(
			'/(social)/(nostr)/nostr/profile/[pubkey]/(profile)/notes',
			{ pubkey: data.entityId.pubkey },
		)}
		entityFieldReference={{
			entityType: EntityType.NostrProfile,
			entityId: data.entityId,
			fieldName: '$$notes',
		}}
		id="nostr-profile-notes"
	/>
</Page>

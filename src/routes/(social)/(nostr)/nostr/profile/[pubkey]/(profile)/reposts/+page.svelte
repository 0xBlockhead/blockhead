<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/$EntityType.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	let { data }: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import NostrRepostsView from '$/views/NostrRepostsView.svelte'
</script>


<Page>
	<NostrRepostsView
		entityFieldReference={{
			entityType: EntityType.NostrProfile,
			entityId: data.entityId,
			fieldName: '$$reposts',
		}}
		id="nostr-profile-reposts"
	/>
</Page>

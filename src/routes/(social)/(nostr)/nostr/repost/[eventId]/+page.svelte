<script lang="ts">
	import type { PageProps } from './$types.ts'

	// Context
	import { resolve } from '$app/paths'


	// State
	let { data }: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import NostrRepostView from '$/views/NostrRepostView.svelte'
</script>


<Page>
	<NostrRepostView
		entityId={data.entityId}
		href={resolve('/(social)/(nostr)/nostr/repost/[eventId]', {
			eventId: data.entityId.eventId,
		})}
	/>
</Page>

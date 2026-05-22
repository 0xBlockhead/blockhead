<script lang="ts">
	// Types/constants
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityType } from '$/schema/$EntityType.ts'

	// Context
	import { resolve } from '$app/paths'


	// State
	let { params } = $props()

	const entityId = $derived(
		({
			variant: 'byChannel' as const,
			channelId: params.channelId,
		}) satisfies EntityId<typeof schema, EntityType.FarcasterFeed>,
	)


	// Components
	import Page from '$/components/Page.svelte'
	import FarcasterFeedView from '$/views/FarcasterFeedView.svelte'
</script>


<Page>
	<FarcasterFeedView
		entityId={entityId}
		href={resolve(`/farcaster/feed/channel/${encodeURIComponent(params.channelId)}`)}
		limit={50}
	/>
</Page>

<script lang="ts">
	// Types/constants
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityType } from '$/schema/$EntityType.ts'

	// Context
	import { resolve } from '$app/paths'


	// Props
	let { params } = $props()

	const entityId = $derived(
		({
			variant: 'byUser' as const,
			fid: Number(params.userId),
		}) satisfies EntityId<typeof schema, EntityType.FarcasterFeed>,
	)


	// Components
	import Page from '$/components/Page.svelte'
	import FarcasterFeedView from '$/views/FarcasterFeedView.svelte'
</script>


<Page>
	<FarcasterFeedView
		entityId={entityId}
		href={resolve(`/farcaster/feed/user/${params.userId}`)}
		limit={50}
	/>
</Page>

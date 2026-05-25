<script lang="ts">
	// Types/constants
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityType } from '$/schema/$EntityType.ts'


	// State
	let { params } = $props()


	const entityId = $derived(
		({
			variant: 'following' as const,
			viewerFid: Number(params.userId),
		}) satisfies EntityId<typeof schema, EntityType.FarcasterFeed>,
	)


	// Components
	import Page from '$/components/Page.svelte'
	import FarcasterFeedView from '$/views/FarcasterFeedView.svelte'
</script>


<Page>
	<FarcasterFeedView
		entityId={entityId}
		limit={50}
	/>
</Page>

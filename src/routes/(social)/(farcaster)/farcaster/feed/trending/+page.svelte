<script lang="ts">
	// Types/constants
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityType } from '$/schema/$EntityType.ts'


	// Functions
	const entityId = ({
		variant: 'trending' as const,
	}) satisfies EntityId<typeof schema, EntityType.FarcasterFeed>


	// Components
	import Page from '$/components/Page.svelte'
	import FarcasterFeedView from '$/views/FarcasterFeedView.svelte'
</script>


<Page>
	<FarcasterFeedView
		{entityId}
		limit={50}
	/>
</Page>

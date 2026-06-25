<script lang="ts">
	import { select } from '$/routes/+layout.svelte'
	// Types/constants
	import type { EntitySelector } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Functions
	const selector: EntitySelector<typeof schema, EntityType.FarcasterFeed> = {
		variant: 'trending',
	}


	// Components
	import Page from '$/components/Page.svelte'
	import FarcasterFeedView from '$/views/FarcasterFeedView.svelte'
</script>


<Page>
	<FarcasterFeedView
		selection={select(EntityType.FarcasterFeed, selector)}
		limit={50}
	/>
</Page>

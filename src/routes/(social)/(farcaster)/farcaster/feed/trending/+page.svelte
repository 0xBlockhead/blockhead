<script lang="ts">
	// Types/constants
	import type { EntitySelector } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Functions
	const entitySelector: EntitySelector<typeof schema, EntityType.FarcasterFeed> = {
		variant: 'trending',
	}


	// Components
	import Page from '$/components/Page.svelte'
	import FarcasterFeedView from '$/views/FarcasterFeedView.svelte'
</script>


<Page>
	<FarcasterFeedView
		selector={selector}
		limit={50}
	/>
</Page>

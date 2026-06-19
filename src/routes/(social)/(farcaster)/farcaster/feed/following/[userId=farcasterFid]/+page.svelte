<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'
	import { select } from '$/routes/+layout.svelte'


	// State
	let { params } = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import FarcasterFeedView from '$/views/FarcasterFeedView.svelte'
</script>


<Page>
	<FarcasterFeedView
		selection={select(EntityType.FarcasterFeed, {
			variant: 'following',
			viewerFid: Number(params.userId),
		})}
		limit={6}
	/>
</Page>

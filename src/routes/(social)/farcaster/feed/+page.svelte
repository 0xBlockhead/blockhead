<script lang="ts">
	import { select } from '$/routes/+layout.svelte'
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'


	// Components
	import Page from '$/components/Page.svelte'
	import FarcasterFeedsView from '$/views/FarcasterFeedsView.svelte'
</script>


<Page>
	<FarcasterFeedsView
		href={resolve('/farcaster/feed')}
		collapsible={false}
		selection={select(
			EntityType.FarcasterNetwork,
			{ scope: 'FarcasterNetwork' }
		).$$feeds}
		id="feed-index"
		limit={36}
		title="Feeds"
	/>
</Page>

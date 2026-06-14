<script lang="ts">
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
		entityFieldReference={{
			entityType: EntityType.FarcasterNetwork,
			selector: { scope: 'FarcasterNetwork' },
			fieldName: '$$feeds',
		}}
		id="feed-index"
		limit={36}
		title="Feeds"
	/>
</Page>

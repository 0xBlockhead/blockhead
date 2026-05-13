<script lang="ts">
	// Context
	import { resolve } from '$app/paths'

	import { EntityType } from '$/schema/$EntityType.ts'


	// Components
	import Page from '$/components/Page.svelte'
	import FarcasterFeedsView from '$/views/FarcasterFeedsView.svelte'
</script>


<Page>
	<FarcasterFeedsView
		collapsible={false}
		entityFieldReference={{
			entityType: EntityType.FarcasterNetwork,
			entityId: { scope: 'FarcasterNetwork' },
			fieldName: '$$feeds',
		}}
		href={resolve('/farcaster/feed')}
		id="feed-index"
		limit={36}
		title="Feeds"
		open={true}
	/>
</Page>

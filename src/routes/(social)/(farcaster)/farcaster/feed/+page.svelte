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
		entityFieldReference={{
			entityType: EntityType.FarcasterNetwork,
			entityId: { scope: 'FarcasterNetwork' },
			fieldName: '$$feeds',
		}}
		href={resolve('/farcaster/feed')}
		id="feed-index"
		title="Feeds"
		open={true}
	/>
</Page>

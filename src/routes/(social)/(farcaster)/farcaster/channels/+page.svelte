<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


	// Components
	import Page from '$/components/Page.svelte'
	import FarcasterChannelsView from '$/views/FarcasterChannelsView.svelte'
	import { EntityType } from '$/schema/$EntityType.ts'
</script>


<Page>
	<FarcasterChannelsView
		entityFieldReference={{
			entityType: EntityType.FarcasterNetwork,
			entityId: { scope: 'FarcasterNetwork' },
			fieldName: '$$channels',
		}}
		href={resolve('/farcaster/channels')}
		id="channels"
	/>
</Page>

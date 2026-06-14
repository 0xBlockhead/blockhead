<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'


	// Components
	import Page from '$/components/Page.svelte'
	import FarcasterChannelsView from '$/views/FarcasterChannelsView.svelte'
</script>


<Page>
	<FarcasterChannelsView
		href={resolve('/farcaster/channels')}
		entityFieldReference={{
			entityType: EntityType.FarcasterNetwork,
			selector: { scope: 'FarcasterNetwork' },
			fieldName: '$$channels',
		}}
		id="channels"
	/>
</Page>

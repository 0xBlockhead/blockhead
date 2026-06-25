<script lang="ts">
	import { select } from '$/routes/+layout.svelte'
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
		selection={select(
			EntityType.FarcasterNetwork,
			{ scope: 'FarcasterNetwork' }
		).$$channels}
		id="channels"
	/>
</Page>

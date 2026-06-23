<script lang="ts">
	import { select } from '$/routes/+layout.svelte'
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadStateChannelsView from '$/views/BlockheadStateChannelsView.svelte'
</script>


<Page>
	<BlockheadStateChannelsView
		href={resolve('/channels')}
		selection={select(
			EntityType._Global,
			{ scope: '$$stateChannels' }
		).$$stateChannels}
		id="channels"
	/>
</Page>

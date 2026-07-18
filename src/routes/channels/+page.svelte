<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadStateChannelsView from '$/views/BlockheadStateChannelsView.svelte'
</script>


<svelte:head>
	<title>Channels • Blockhead</title>
</svelte:head>


<Page>
	<BlockheadStateChannelsView
		href={resolve('/channels')}
		title='Channels'
		selection={
			select(EntityType._Global, {
				scope: '$$blockheadStateChannels',
			}).$$blockheadStateChannels({
				count: true,
			})
		}
		id='blockhead-state-channels'
		data-column-item="flexible"
		data-card
		data-scroll-container
	/>
</Page>

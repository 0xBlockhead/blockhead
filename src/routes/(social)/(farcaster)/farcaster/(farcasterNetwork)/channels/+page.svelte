<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// Components
	import Page from '$/components/Page.svelte'
	import FarcasterChannelsView from '$/views/FarcasterChannelsView.svelte'
</script>


<svelte:head>
	<title>Farcaster channels • Blockhead</title>
</svelte:head>


<Page>
	<FarcasterChannelsView
		href={resolve('/farcaster/channels')}
		title='Farcaster channels'
		selection={
			select(EntityType.FarcasterNetwork, {
				scope: 'FarcasterNetwork',
			}).$$channels({
				sources: [
					Source.Farcaster_Rest,
				],
				count: true,
			})
		}
		id='channels'
		data-column-item="flexible"
		data-card
		data-scroll-container
	/>
</Page>

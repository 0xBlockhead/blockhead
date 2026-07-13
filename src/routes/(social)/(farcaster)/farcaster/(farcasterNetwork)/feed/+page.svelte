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
	import FarcasterFeedsView from '$/views/FarcasterFeedsView.svelte'
</script>


<svelte:head>
	<title>Farcaster feeds • Blockhead</title>
</svelte:head>


<Page>
	<FarcasterFeedsView
		href={resolve('/farcaster/feed')}
		title='Farcaster feeds'
		selection={
			select(EntityType.FarcasterNetwork, {
				scope: 'FarcasterNetwork',
			}).$$feeds({
				sources: [
					Source.Constants_Internal,
				],
				count: true,
			})
		}
		id='feeds'
	/>
</Page>

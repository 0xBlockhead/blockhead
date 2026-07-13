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
	import FarcasterCastsView from '$/views/FarcasterCastsView.svelte'
</script>


<svelte:head>
	<title>Farcaster trending casts • Blockhead</title>
</svelte:head>


<Page>
	<FarcasterCastsView
		href={resolve('/farcaster/feed/trending')}
		title='Farcaster trending casts'
		selection={
			select(EntityType.FarcasterFeed, {
				variant: 'trending',
			}).$$entries({
				sources: [
					Source.Neynar_Rest,
					Source.Farcaster_Rest,
					Source.Snapchain_Rest,
				],
				count: true,
			})
		}
		id='entries'
	/>
</Page>

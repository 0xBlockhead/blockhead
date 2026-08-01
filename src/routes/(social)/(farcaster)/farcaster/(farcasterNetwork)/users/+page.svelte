<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// Components
	import Page from '$/components/Page.svelte'
	import FarcasterUsersView from '$/views/FarcasterUsersView.svelte'
</script>


<svelte:head>
	<title>Farcaster users • Blockhead</title>
</svelte:head>


<Page>
	{@const collectionSelection = select(EntityType.FarcasterNetwork, {
		scope: 'FarcasterNetwork',
	})
		.$$users({
			sources: [
				Source.Snapchain_Rest,
			],
		})}

	<FarcasterUsersView
		href={resolve('/(social)/(farcaster)/farcaster/(farcasterNetwork)/users')}
		selection={collectionSelection}
		countResource={collectionSelection.count}
		id='users'
	/>
</Page>

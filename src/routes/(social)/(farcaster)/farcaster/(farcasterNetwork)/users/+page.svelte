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
	import FarcasterUsersView from '$/views/FarcasterUsersView.svelte'
</script>


<svelte:head>
	<title>Farcaster users • Blockhead</title>
</svelte:head>


<Page>
	<FarcasterUsersView
		href={resolve('/farcaster/users')}
		title='Farcaster users'
		selection={
			select(EntityType.FarcasterNetwork, {
				scope: 'FarcasterNetwork',
			})
				.$$users({
					sources: [
						Source.Snapchain_Rest,
						Source.Neynar_Rest,
					],
				})
		}
		countResource={
			select(EntityType.FarcasterNetwork, {
				scope: 'FarcasterNetwork',
			})
				.$$users({
					sources: [
						Source.Snapchain_Rest,
						Source.Neynar_Rest,
					],
				}).count
		}
		id='users'
		data-column-item="flexible"
		data-card
		data-scroll-container
	/>
</Page>

<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { EntityProxyField } from '$/client/$proxy.svelte.ts'
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
		href={resolve('/(social)/(farcaster)/farcaster/channels')}
		title='Farcaster channels'
		selection={
			select(EntityType.FarcasterNetwork, {
				scope: 'FarcasterNetwork',
			})[EntityProxyField]<EntityType.FarcasterChannel>('$$channels', {
				sources: [
					Source.Farcaster_Rest,
				],
			})
		}
		id='FarcasterChannelsView-page'
	/>
</Page>

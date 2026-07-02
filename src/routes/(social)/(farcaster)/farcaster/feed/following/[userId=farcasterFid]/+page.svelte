<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityProxyField } from '$/client/$proxy.svelte.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import FarcasterCastsView from '$/views/FarcasterCastsView.svelte'
</script>


<svelte:head>
	<title>Farcaster following feed • Blockhead</title>
</svelte:head>


<Page>
	<FarcasterCastsView
		href={
			resolve('/(social)/(farcaster)/farcaster/feed/following/[userId=farcasterFid]', {
				userId: params.userId,
			})
		}
		title='Farcaster following feed'
		selection={
			select(EntityType.FarcasterFeed, {
				variant: 'following',
				viewerFid: Number(params.userId),
			})[EntityProxyField]<EntityType.FarcasterCast>('$$entries', {
				sources: [
					Source.Neynar_Rest,
					Source.Farcaster_Rest,
					Source.Snapchain_Rest,
				],
			})
		}
		id='FarcasterCastsView-page'
	/>
</Page>

<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
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
	<title>Farcaster user casts • Blockhead</title>
</svelte:head>


<Page>
	<FarcasterCastsView
		href={
			resolve('/(social)/(farcaster)/farcaster/user/[userId=farcasterFid]/(user)/casts', {
				userId: params.userId,
			})
		}
		title='Farcaster user casts'
		selection={
			select(EntityType.FarcasterUser, {
				fid: Number(params.userId),
			}).$$casts({
				sources: [
					Source.Snapchain_Rest,
				],
			})
		}
		id='casts'
	/>
</Page>

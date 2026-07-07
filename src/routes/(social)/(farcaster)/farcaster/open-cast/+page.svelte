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
	import FarcasterCastView from '$/views/FarcasterCastView.svelte'
</script>


<svelte:head>
	<title>Open Farcaster cast • Blockhead</title>
</svelte:head>


<Page>
	<FarcasterCastView
		href={resolve('/(social)/(farcaster)/farcaster/open-cast')}
		selection={
			select(EntityType.FarcasterCast, {
				fid: 3,
				hash: '0xe4f2e1c70d72388a98dba2a2511a9b480840e544',
			}, {
				sources: [
					Source.Snapchain_Rest,
					Source.Farcaster_Rest,
					Source.Neynar_Rest,
				],
				fields: {
					text: true,
					timestamp: true,
					$author: true,
					$channel: true,
					$parentCast: true,
					parentUrl: true,
					threadHash: true,
				},
			})
		}
	/>
</Page>

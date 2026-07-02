<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()


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
			select(EntityType.FarcasterCast, data.selector, {
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

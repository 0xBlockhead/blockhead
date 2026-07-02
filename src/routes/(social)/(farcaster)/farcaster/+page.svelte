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
	import FarcasterNetworkView from '$/views/FarcasterNetworkView.svelte'
</script>


<svelte:head>
	<title>Farcaster • Blockhead</title>
</svelte:head>


<Page>
	<FarcasterNetworkView
		href={resolve('/(social)/(farcaster)/farcaster')}
		selection={
			select(EntityType.FarcasterNetwork, data.selector, {
				fields: {
					protocolName: true,
					homeUrl: true,
					docsUrl: true,
					registryLabel: true,
					topology: true,
				},
			})
		}
	/>
</Page>

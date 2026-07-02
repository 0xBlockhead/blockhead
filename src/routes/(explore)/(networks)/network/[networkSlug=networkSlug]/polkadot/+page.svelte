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
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import PolkadotNetworkView from '$/views/PolkadotNetworkView.svelte'
</script>


<svelte:head>
	<title>Polkadot network • Blockhead</title>
</svelte:head>


<Page>
	<PolkadotNetworkView
		href={
			resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/polkadot', {
				networkSlug: params.networkSlug,
			})
		}
		selection={select(EntityType.PolkadotNetwork, data.selector)}
	/>
</Page>

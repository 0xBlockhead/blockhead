<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { resolve } from '$app/paths'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()
	// Components
	import Page from '$/components/Page.svelte'
	import Erc4337BundlersView from '$/views/Erc4337BundlersView.svelte'
</script>


<svelte:head>
	<title>ERC-4337 bundlers • Blockhead</title>
</svelte:head>


<Page>
	<Erc4337BundlersView
		href={
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/erc-4337/bundlers',
				{
					network: params.network,
				}
			)
		}
		selection={select(EntityType.Network, data.selector).Evm.$$erc4337Bundlers}
		id='erc4337-bundlers'
	/>
</Page>

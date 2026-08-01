<!-- Generated from APP.ts. Do not edit by hand. -->

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
	import Erc4337AccountFactoriesView from '$/views/Erc4337AccountFactoriesView.svelte'
</script>


<svelte:head>
	<title>ERC-4337 account factories • Blockhead</title>
</svelte:head>


<Page>
	<Erc4337AccountFactoriesView
		href={
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/erc-4337/account-factories',
				{
					network: params.network,
				}
			)
		}
		selection={select(EntityType.Network, data.selector).Evm.$$erc4337AccountFactories}
		id='erc4337-account-factories'
	/>
</Page>

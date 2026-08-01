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
	import EvmUserOperationsView from '$/views/EvmUserOperationsView.svelte'
</script>


<svelte:head>
	<title>ERC-4337 user operations • Blockhead</title>
</svelte:head>


<Page>
	<EvmUserOperationsView
		href={
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/erc-4337/user-operations',
				{
					network: params.network,
				}
			)
		}
		title='ERC-4337 user operations'
		selection={select(EntityType.Network, data.selector).Evm.$$userOperations}
		id='user-operations'
	/>
</Page>

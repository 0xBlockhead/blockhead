<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { resolve } from '$app/paths'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		data,
		params,
	}: PageProps = $props()
	// Components
	import Page from '$/components/Page.svelte'
	import SolanaAccountsView from '$/views/SolanaAccountsView.svelte'
</script>


<svelte:head>
	<title>Solana accounts • Blockhead</title>
</svelte:head>


<Page>
	<SolanaAccountsView
		href={
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/accounts',
				{
					network: params.network,
				}
			)
		}
		title='Solana accounts'
		selection={select(EntityType.Network, data.selector).Solana.$$accounts}
		id='accounts'
	/>
</Page>

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
	import SolanaTokenAccountsView from '$/views/SolanaTokenAccountsView.svelte'
</script>


<svelte:head>
	<title>Solana token accounts • Blockhead</title>
</svelte:head>


<Page>
	<SolanaTokenAccountsView
		href={
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/token-accounts',
				{
					network: params.network,
				}
			)
		}
		title='Solana token accounts'
		selection={select(EntityType.Network, data.selector).Solana.$$tokenAccounts}
		id='token-accounts'
	/>
</Page>

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
	import SolanaTokenMintsView from '$/views/SolanaTokenMintsView.svelte'
</script>


<svelte:head>
	<title>Solana token mints • Blockhead</title>
</svelte:head>


<Page>
	<SolanaTokenMintsView
		href={
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/token-mints',
				{
					network: params.network,
				}
			)
		}
		title='Solana token mints'
		selection={select(EntityType.Network, data.selector).Solana.$$tokenMints}
		id='token-mints'
	/>
</Page>

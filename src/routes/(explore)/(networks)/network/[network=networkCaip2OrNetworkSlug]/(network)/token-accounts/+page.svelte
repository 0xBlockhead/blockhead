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
	import ProjectionBoundary from '$/components/ProjectionBoundary.svelte'
	import SolanaTokenAccountsView from '$/views/SolanaTokenAccountsView.svelte'
</script>


<svelte:head>
	<title>Solana token accounts • Blockhead</title>
</svelte:head>


<Page>
	<ProjectionBoundary
		resource={select(EntityType.Network, data.selector).Solana}
	>
		{#snippet Applicable(projection)}
			<SolanaTokenAccountsView
				href={
					resolve('/network/[network=networkCaip2OrNetworkSlug]/token-accounts', {
						network: params.network,
					})
				}
				title='Solana token accounts'
				selection={
					projection.$$tokenAccounts({
						count: true,
					})
				}
				id='token-accounts'
			/>
		{/snippet}
	</ProjectionBoundary>
</Page>

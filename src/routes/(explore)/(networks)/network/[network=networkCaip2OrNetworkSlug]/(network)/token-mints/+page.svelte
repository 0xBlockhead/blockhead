<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


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
	import SolanaTokenMintsView from '$/views/SolanaTokenMintsView.svelte'
</script>


<svelte:head>
	<title>Solana token mints • Blockhead</title>
</svelte:head>


<Page>
	<ProjectionBoundary
		resource={select(EntityType.Network, data.selector).Solana}
	>
		{#snippet Applicable(projection)}
			<SolanaTokenMintsView
				href={
					resolve('/network/[network=networkCaip2OrNetworkSlug]/token-mints', {
						network: params.network,
					})
				}
				title='Solana token mints'
				selection={
					projection
						.$$tokenMints({
							sources: [
								Source.Solana_JsonRpc,
							],
						})
				}
				id='account-solana-token-mint'
				data-column-item="flexible"
				data-card
				data-scroll-container
			/>
		{/snippet}
	</ProjectionBoundary>
</Page>

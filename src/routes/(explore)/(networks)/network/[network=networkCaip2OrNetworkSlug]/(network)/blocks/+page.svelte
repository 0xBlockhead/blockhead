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
	import EvmBlocksView from '$/views/EvmBlocksView.svelte'
</script>


<svelte:head>
	<title>Blocks • Blockhead</title>
</svelte:head>


<Page>
	<ProjectionBoundary
		resource={select(EntityType.Network, data.selector).Evm}
	>
		{#snippet Applicable(projection)}
			<EvmBlocksView
				href={
					resolve('/network/[network=networkCaip2OrNetworkSlug]/blocks', {
						network: params.network,
					})
				}
				title='Blocks'
				selection={
					projection
						.$$blocks({
							sources: [
								Source.Voltaire_JsonRpc,
								Source.Blockscout_Rest,
							],
						})
				}
				id='account-evm-block'
				data-column-item="flexible"
				data-card
				data-scroll-container
			/>
		{/snippet}
	</ProjectionBoundary>
</Page>

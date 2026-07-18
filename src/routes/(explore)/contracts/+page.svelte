<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// Components
	import Page from '$/components/Page.svelte'
	import ProjectionBoundary from '$/components/ProjectionBoundary.svelte'
	import EvmContractsView from '$/views/EvmContractsView.svelte'
</script>


<svelte:head>
	<title>Contracts • Blockhead</title>
</svelte:head>


<Page>
	<ProjectionBoundary
		resource={
			select(EntityType.Network, {
				caip2: {
					namespace: 'eip155',
					reference: '1',
				},
			}).Evm
		}
	>
		{#snippet Applicable(projection)}
			<EvmContractsView
				href={resolve('/contracts')}
				title='Contracts'
				selection={
					projection.$$contracts({
						sources: [
							Source.Blockscout_Rest,
						],
						limit: 16,
						count: true,
					})
				}
				id='contracts'
				data-column-item="flexible"
				data-card
				data-scroll-container
			/>
		{/snippet}
	</ProjectionBoundary>
</Page>

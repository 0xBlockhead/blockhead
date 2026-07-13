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
	import EvmUserOperationsView from '$/views/EvmUserOperationsView.svelte'
</script>


<svelte:head>
	<title>ERC-4337 user operations • Blockhead</title>
</svelte:head>


<Page>
	<ProjectionBoundary
		resource={select(EntityType.Network, data.selector).Evm}
	>
		{#snippet Applicable(projection)}
			<EvmUserOperationsView
				href={
					resolve('/network/[network=networkCaip2OrNetworkSlug]/erc-4337/user-operations', {
						network: params.network,
					})
				}
				title='ERC-4337 user operations'
				selection={
					projection.$$userOperations({
						sources: [
							Source.Blockscout_Rest,
						],
						count: true,
					})
				}
				id='user-operations'
			/>
		{/snippet}
	</ProjectionBoundary>
</Page>

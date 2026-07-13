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
	import EvmBlobsView from '$/views/EvmBlobsView.svelte'
</script>


<svelte:head>
	<title>Blobs • Blockhead</title>
</svelte:head>


<Page>
	<ProjectionBoundary
		resource={select(EntityType.Network, data.selector).Evm}
	>
		{#snippet Applicable(projection)}
			<EvmBlobsView
				href={
					resolve('/network/[network=networkCaip2OrNetworkSlug]/blobs', {
						network: params.network,
					})
				}
				title='Blobs'
				selection={
					projection.$$blobs({
						sources: [
							Source.Voltaire_JsonRpc,
						],
					})
				}
				id='blobs'
			/>
		{/snippet}
	</ProjectionBoundary>
</Page>

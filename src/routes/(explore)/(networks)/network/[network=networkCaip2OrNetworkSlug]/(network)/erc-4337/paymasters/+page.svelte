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
	import Erc4337PaymastersView from '$/views/Erc4337PaymastersView.svelte'
</script>


<svelte:head>
	<title>ERC-4337 paymasters • Blockhead</title>
</svelte:head>


<Page>
	<ProjectionBoundary
		resource={select(EntityType.Network, data.selector).Evm}
	>
		{#snippet Applicable(projection)}
			<Erc4337PaymastersView
				href={
					resolve('/network/[network=networkCaip2OrNetworkSlug]/erc-4337/paymasters', {
						network: params.network,
					})
				}
				title='ERC-4337 paymasters'
				selection={
					projection.$$erc4337Paymasters({
						sources: [
							Source.Blockscout_Rest,
						],
					})
				}
				id='erc4337-paymasters'
			/>
		{/snippet}
	</ProjectionBoundary>
</Page>

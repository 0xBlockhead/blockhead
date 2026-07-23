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
	import BeaconValidatorsView from '$/views/BeaconValidatorsView.svelte'
	import SolanaValidatorsView from '$/views/SolanaValidatorsView.svelte'
</script>


<svelte:head>
	<title>Collections • Blockhead</title>
</svelte:head>


<Page>
	<ProjectionBoundary
		resource={
			select(EntityType.Network, data.selector).Evm
				.$$beaconValidators({
					sources: [
						Source.Beacon_Rest,
					],
				}).Evm
		}
	>
		{#snippet Applicable(projection)}
			<BeaconValidatorsView
				href={
					resolve('/network/[network=networkCaip2OrNetworkSlug]/validators', {
						network: params.network,
					})
				}
				title='Beacon validators'
				selection={
					projection
						.$$beaconValidators({
							sources: [
								Source.Beacon_Rest,
							],
						})
				}
				id='account-beacon-validator'
				data-column-item="flexible"
				data-card
				data-scroll-container
			/>
		{/snippet}
	</ProjectionBoundary>

	<ProjectionBoundary
		resource={
			select(EntityType.Network, data.selector).Solana
				.$$validators({
					sources: [
						Source.Solana_JsonRpc,
					],
				}).Solana
		}
	>
		{#snippet Applicable(projection)}
			<SolanaValidatorsView
				href={
					resolve('/network/[network=networkCaip2OrNetworkSlug]/validators', {
						network: params.network,
					})
				}
				title='Solana validators'
				selection={
					projection
						.$$validators({
							sources: [
								Source.Solana_JsonRpc,
							],
						})
				}
				id='account-solana-validator'
				data-column-item="flexible"
				data-card
				data-scroll-container
			/>
		{/snippet}
	</ProjectionBoundary>
</Page>

<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.CoinBridgeCapability, {
		$fromInstance: (
			params.fromCoinInstanceSlug === 'native' ?
				{
					$network: {
						caip2: {
							namespace: 'eip155',
							reference: params.fromChainId,
						},
					},
					type: 'NativeCurrency',
				}
			:
				{
					$network: {
						caip2: {
							namespace: 'eip155',
							reference: params.fromChainId,
						},
					},
					type: 'Erc20Token',
					$contract: {
						$network: {
							caip2: {
								namespace: 'eip155',
								reference: params.fromChainId,
							},
						},
						address: params.fromCoinInstanceSlug,
					},
				}
		),
		$toInstance: (
			params.toCoinInstanceSlug === 'native' ?
				{
					$network: {
						caip2: {
							namespace: 'eip155',
							reference: params.toChainId,
						},
					},
					type: 'NativeCurrency',
				}
			:
				{
					$network: {
						caip2: {
							namespace: 'eip155',
							reference: params.toChainId,
						},
					},
					type: 'Erc20Token',
					$contract: {
						$network: {
							caip2: {
								namespace: 'eip155',
								reference: params.toChainId,
							},
						},
						address: params.toCoinInstanceSlug,
					},
				}
		),
		toolKey: params.toolKey,
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import CoinBridgeCapabilityView from '$/views/CoinBridgeCapabilityView.svelte'
</script>


<svelte:head>
	<title>{pageSelection.entitySelector.toolKey || 'Coin bridge capability'} • Coin bridge capability • Blockhead</title>
</svelte:head>


<Page>
	<CoinBridgeCapabilityView
		selection={pageSelection}
	/>
</Page>

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
	}, {
		fields: {
			railId: true,
			settlementModel: true,
			verificationModel: true,
			assetOutcome: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import CoinBridgeCapabilityView from '$/views/CoinBridgeCapabilityView.svelte'
</script>


<svelte:head>
	<title>{(pageSelection.entity == null ? [String(({
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
	}.toolKey) ?? '')].filter(Boolean).join(' ') || 'Coin bridge capability' : [String((({ ...{
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
	}, ...pageSelection.entity }).toolKey) ?? '')].filter(Boolean).join(' ') || 'Coin bridge capability')} • Coin bridge capability • Blockhead</title>
</svelte:head>


<Page>
	<CoinBridgeCapabilityView
		href={
			resolve('/bridge-capability/[fromChainId=eip155ChainId]/[fromCoinInstanceSlug=nativeCurrencySlugOrEvmAddress]/[toChainId=eip155ChainId]/[toCoinInstanceSlug=nativeCurrencySlugOrEvmAddress]/[toolKey=stringSegment]', {
				fromChainId: params.fromChainId,
				fromCoinInstanceSlug: params.fromCoinInstanceSlug,
				toChainId: params.toChainId,
				toCoinInstanceSlug: params.toCoinInstanceSlug,
				toolKey: params.toolKey,
			})
		}
		selection={pageSelection}
	/>
</Page>

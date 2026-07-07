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


	// Components
	import Page from '$/components/Page.svelte'
	import CoinBridgeCapabilityView from '$/views/CoinBridgeCapabilityView.svelte'
</script>


<Page>
	<CoinBridgeCapabilityView
		href={
			resolve('/(assets)/bridge-capability/[fromChainId=eip155ChainId]/[fromCoinInstanceSlug]/[toChainId=eip155ChainId]/[toCoinInstanceSlug]/[toolKey]', {
				fromChainId: params.fromChainId,
				fromCoinInstanceSlug: params.fromCoinInstanceSlug,
				toChainId: params.toChainId,
				toCoinInstanceSlug: params.toCoinInstanceSlug,
				toolKey: params.toolKey,
			})
		}
		selection={
			select(EntityType.CoinBridgeCapability, {
				$fromInstance: {
					$network: {
						caip2: {
							namespace: 'eip155',
							reference: params.fromChainId,
						},
					},
					type: (
					params.fromCoinInstanceSlug === 'native' ?
						'NativeCurrency'
					:
						params.fromCoinInstanceSlug
					),
				},
				$toInstance: {
					$network: {
						caip2: {
							namespace: 'eip155',
							reference: params.toChainId,
						},
					},
					type: (
					params.toCoinInstanceSlug === 'native' ?
						'NativeCurrency'
					:
						params.toCoinInstanceSlug
					),
				},
				toolKey: decodeURIComponent(params.toolKey),
			}, {
				fields: {
					railId: true,
					settlementModel: true,
					verificationModel: true,
					assetOutcome: true,
				},
			})
		}
	/>
</Page>

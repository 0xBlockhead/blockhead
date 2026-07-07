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
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import EvmCoinInstanceView from '$/views/EvmCoinInstanceView.svelte'
</script>


<Page>
	<EvmCoinInstanceView
		href={
			resolve('/(assets)/coin-instance/[chainId=eip155ChainId]/[coinInstanceSlug]', {
				chainId: params.chainId,
				coinInstanceSlug: params.coinInstanceSlug,
			})
		}
		selection={
			select(EntityType.EvmCoinInstance, (
			decodeURIComponent(params.coinInstanceSlug) === 'native' ?
				{
					$network: {
						caip2: {
							namespace: 'eip155',
							reference: params.chainId,
						},
					},
					type: 'NativeCurrency',
				}
			:
				{
					$network: {
						caip2: {
							namespace: 'eip155',
							reference: params.chainId,
						},
					},
					type: 'Erc20Token',
					$contract: {
						$network: {
							caip2: {
								namespace: 'eip155',
								reference: params.chainId,
							},
						},
						address: decodeURIComponent(params.coinInstanceSlug),
					},
				}
			), {
				sources: [
					Source.Constants_Internal,
					Source.Blockscout_Rest,
				],
				fields: {
					symbol: true,
					name: true,
					coinId: true,
					decimals: true,
					caip19: true,
					representation: true,
					iconUrl: true,
					$canonicalInstance: true,
					$icon: true,
				},
			})
		}
	/>
</Page>

<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { CoinInstanceType } from '$/schema/EvmCoinInstance.ts'
	import { UrlString } from '$/schema/UrlString.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(data.entityType === EntityType.EvmCoinInstance && data.selectorName === 'NetworkType' ? select(EntityType.EvmCoinInstance, data.selector, {
		fields: {
			$contract: true,
			NativeCurrency: {
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
			},
			Erc20Token: {
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
			},
		},
	}) : select(EntityType.EvmCoinInstance, data.selector, {
		fields: {
			NativeCurrency: {
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
			},
			Erc20Token: {
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
			},
		},
	}))
	const entityViewComponentByType = {
		[EntityType.EvmCoinInstance]: EvmCoinInstanceView,
	}

	// Components
	import Page from '$/components/Page.svelte'
	import EvmCoinInstanceView from '$/views/EvmCoinInstanceView.svelte'
</script>


<svelte:head>
	<title>{data.entityType === EntityType.EvmCoinInstance && data.selectorName === 'NetworkType' ? (pageSelection.entity == null ? 'EVM coin instance' : 'EVM coin instance') : (pageSelection.entity == null ? 'EVM coin instance' : 'EVM coin instance')} • EVM coin instance • Blockhead</title>
</svelte:head>


<Page>
	{@const EntityView = entityViewComponentByType[data.entityType]}

	<EntityView
		href={
			resolve('/coin-instance/[chainId=eip155ChainId]/[coinInstanceSlug=nativeCurrencySlugOrEvmAddress]', {
				chainId: params.chainId,
				coinInstanceSlug: params.coinInstanceSlug,
			})
		}
		selection={pageSelection}
	/>
</Page>

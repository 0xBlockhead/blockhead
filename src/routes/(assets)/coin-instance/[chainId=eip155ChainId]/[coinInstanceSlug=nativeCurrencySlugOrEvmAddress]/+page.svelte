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

	const pageSelection = $derived(data.selectorMapping.entityType === EntityType.EvmCoinInstance && data.selectorMapping.selectorName === 'NetworkType' ? select(EntityType.EvmCoinInstance, data.selectorMapping.selector, {
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
	}) : data.selectorMapping.entityType === EntityType.EvmCoinInstance && data.selectorMapping.selectorName === 'NetworkTypeContract' ? select(EntityType.EvmCoinInstance, data.selectorMapping.selector, {
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
	}) : undefined)
	const pageEntityTitle = $derived(data.selectorMapping.entityType === EntityType.EvmCoinInstance && data.selectorMapping.selectorName === 'NetworkType' ? (pageSelection.entity == null ? 'EVM coin instance' : 'EVM coin instance') : data.selectorMapping.entityType === EntityType.EvmCoinInstance && data.selectorMapping.selectorName === 'NetworkTypeContract' ? (pageSelection.entity == null ? 'EVM coin instance' : 'EVM coin instance') : 'Blockhead')
	const pageEntityTypeLabel = $derived(data.selectorMapping.entityType === EntityType.EvmCoinInstance && data.selectorMapping.selectorName === 'NetworkType' ? 'EVM coin instance' : data.selectorMapping.entityType === EntityType.EvmCoinInstance && data.selectorMapping.selectorName === 'NetworkTypeContract' ? 'EVM coin instance' : 'Entity')

	// Components
	import Page from '$/components/Page.svelte'
	import { entityViewComponentByType } from '$/views/index.ts'
</script>


<svelte:head>
	<title>{pageEntityTitle} • {pageEntityTypeLabel} • Blockhead</title>
</svelte:head>


<Page>
	{@const EntityView = entityViewComponentByType[data.selectorMapping.entityType]}

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

<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { CoinInstanceType } from '$/schema/EvmCoinInstance.ts'
	import { UrlString } from '$/schema/UrlString.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()

	const pageSelection = $derived(
		(
			data.entityType === EntityType.EvmCoinInstance && data.selectorName === 'NetworkType' ?
				select(EntityType.EvmCoinInstance, data.selector, {
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
						$contract: true,
					},
				})
			:
				select(EntityType.EvmCoinInstance, data.selector, {
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
				})
		)
	)
	const pageTitle = $derived(
		(
			data.entityType === EntityType.EvmCoinInstance && data.selectorName === 'NetworkType' ?
				(pageSelection.entity == null ? 'EVM coin instance' : 'EVM coin instance')
			:
				(pageSelection.entity == null ? 'EVM coin instance' : 'EVM coin instance')
		)
	)

	// Components
	import Page from '$/components/Page.svelte'
	import EvmCoinInstanceView from '$/views/EvmCoinInstanceView.svelte'
</script>


<svelte:head>
	<title>{pageTitle} • EVM coin instance • Blockhead</title>
</svelte:head>


<Page>
	<EvmCoinInstanceView
		selection={pageSelection}
	/>
</Page>

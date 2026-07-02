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
		data,
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import EvmCoinInstanceView from '$/views/EvmCoinInstanceView.svelte'
</script>


<svelte:head>
	<title>EVM coin instance • Blockhead</title>
</svelte:head>


<Page>
	<EvmCoinInstanceView
		href={
			resolve('/(assets)/coin-instance/[chainId=eip155ChainId]/[coinInstanceSlug]', {
				chainId: params.chainId,
				coinInstanceSlug: params.coinInstanceSlug,
			})
		}
		selection={
			select(EntityType.EvmCoinInstance, data.selector, {
				fields: {
					$icon: true,
					symbol: true,
					name: true,
					coinId: true,
					decimals: true,
					caip19: true,
					representation: true,
					iconUrl: true,
					$canonicalInstance: true,
				},
			})
		}
	/>
</Page>

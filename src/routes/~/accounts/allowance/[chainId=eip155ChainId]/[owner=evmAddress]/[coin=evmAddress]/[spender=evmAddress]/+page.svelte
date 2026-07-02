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
	import EvmActorCoinAllowanceView from '$/views/EvmActorCoinAllowanceView.svelte'
</script>


<svelte:head>
	<title>allowance • Blockhead</title>
</svelte:head>


<Page>
	<EvmActorCoinAllowanceView
		href={
			resolve('/~/accounts/allowance/[chainId=eip155ChainId]/[owner=evmAddress]/[coin=evmAddress]/[spender=evmAddress]', {
				chainId: params.chainId,
				owner: params.owner,
				coin: params.coin,
				spender: params.spender,
			})
		}
		selection={
			select(EntityType.EvmActorCoinAllowance, data.selector, {
				fields: {
					$actorCoin: true,
					$spenderContract: true,
				},
			})
		}
	/>
</Page>

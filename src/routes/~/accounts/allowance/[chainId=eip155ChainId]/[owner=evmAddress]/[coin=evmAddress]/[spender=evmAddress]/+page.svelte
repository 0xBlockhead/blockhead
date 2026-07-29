<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.EvmActorCoinAllowance, {
		$actor: {
			interopAddress: 'eip155:' + String(Number(params.chainId)) + ':' + String(params.owner),
		},
		$contract: {
			$network: {
				caip2: {
					namespace: 'eip155',
					reference: params.chainId,
				},
			},
			address: params.coin,
		},
		$spender: {
			interopAddress: 'eip155:' + String(Number(params.chainId)) + ':' + String(params.spender),
		},
		interopAddress: 'eip155:' + String(Number(params.chainId)) + ':' + String(params.owner),
	}, {
		sources: [
			Source.EnvioHyperSync_RawHttp,
			Source.SqdPortal_RawHttp,
			Source.Voltaire_JsonRpc,
		],
		fields: {
			$actorCoin: true,
			$spenderContract: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import EvmActorCoinAllowanceView from '$/views/EvmActorCoinAllowanceView.svelte'
</script>


<svelte:head>
	<title>{'allowance'} • allowance • Blockhead</title>
</svelte:head>


<Page>
	<EvmActorCoinAllowanceView
		selection={pageSelection}
	/>
</Page>

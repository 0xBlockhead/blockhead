<script lang="ts">
	import { EntityType } from '$/schema/EntityType.ts'
	import { select } from '$/routes/+layout.svelte'
	// Types/constants
	import type { CoinId } from '$/constants/Coin.ts'
	import { coinById, coins } from '$/constants/Coin.ts'


	// State
	let {
		params,
	} = $props()

	const route = $derived.by(() => {
		const param = params.coinId ?? ''
		const coinId = coinIdFromParam(param)
		return { param, coinId }
	})


	// Components
	import Page from '$/components/Page.svelte'
	import CoinView from '$/views/CoinView.svelte'


	// Functions
	const coinIdFromParam = (param: string): CoinId | null => (
		coins.find((c) => c.id === param)?.id ?? null
	)
</script>


<svelte:head>
	<title>
		{route.coinId ? coinById[route.coinId]?.symbol ?? route.coinId : route.param || 'Coin'} – Coin
	</title>
</svelte:head>


<Page>
	{#if !route.coinId}
		<div id="coin-not-found">
		<h1>
			Not found
		</h1>
		<p>
			{route.param ?
				`Unsupported coin: ${route.param}`
			:
				'Coin required'}
		</p>
		</div>
	{:else}
		<div id="coin-detail-page">
			<CoinView
				selection={select(EntityType.Coin, {
					coinId: route.coinId,
				})}
				open
			/>
		</div>
	{/if}
</Page>

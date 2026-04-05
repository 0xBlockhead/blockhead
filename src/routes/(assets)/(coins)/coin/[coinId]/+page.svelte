<script lang="ts">
	// Types/constants
	import type { CoinId } from '$/constants/Coin.ts'
	import { coinById } from '$/constants/Coin.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		params,
	} = $props()


	// (Derived)
	const route = $derived.by(() => {
		const param = params.coinId ?? ''
		const coinId = coinById.has(param as CoinId) ? (param as CoinId) : null
		return { param, coinId }
	})


	// Components
	import Page from '$/components/Page.svelte'
	import CoinView from '$/views/CoinView.svelte'
</script>


<svelte:head>
	<title>
		{route.coinId ? coinById.get(route.coinId)?.symbol ?? route.coinId : route.param || 'Coin'} – Coin
	</title>
</svelte:head>


<Page>
	{#if !route.coinId}
		<h1>
			Not found
		</h1>
		<p>
			{route.param ?
				`Unsupported coin: ${route.param}`
			:
				'Coin required'}
		</p>
	{:else}
		<CoinView
			entityId={{
				coinId: route.coinId,
			}}
			href={resolve('/(assets)/(coins)/coin/[coinId]', params)}
		/>
	{/if}
</Page>

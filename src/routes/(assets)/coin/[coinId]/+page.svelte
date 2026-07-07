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
	import CoinView from '$/views/CoinView.svelte'
</script>


<Page>
	<CoinView
		href={
			resolve('/(assets)/coin/[coinId]', {
				coinId: params.coinId,
			})
		}
		selection={
			select(EntityType.Coin, {
				coinId: params.coinId,
			}, {
				sources: [
					Source.Constants_Internal,
				],
				fields: {
					$logo: true,
					symbol: true,
					name: true,
					decimals: true,
				},
			})
		}
	/>
</Page>

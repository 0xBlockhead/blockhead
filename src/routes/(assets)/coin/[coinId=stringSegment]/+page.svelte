<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { CoinId } from '$/constants/Coin.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.Coin, data.selector, {
		sources: [
			Source.Constants_Internal,
		],
		fields: {
			$logo: true,
			symbol: true,
			name: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import CoinView from '$/views/CoinView.svelte'
</script>


<svelte:head>
	<title>{(data.title ?? (pageSelection.entity == null ? 'Coin' : [String((({ ...data.selector, ...pageSelection.entity }).symbol) ?? ''), String((({ ...data.selector, ...pageSelection.entity }).name) ?? '')].filter(Boolean).join(' ') || 'Coin'))} • Coin • Blockhead</title>
</svelte:head>


<Page>
	<CoinView
		href={
			resolve('/coin/[coinId=stringSegment]', {
				coinId: params.coinId,
			})
		}
		selection={pageSelection}
	/>
</Page>

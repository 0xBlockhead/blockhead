<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { CoinId } from '$/constants/Coin.ts'
	import { AssetInstanceKind } from '$/schema/AssetInstance.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.AssetInstance, data.selector, {
		sources: [
			Source.Constants_Internal,
		],
		fields: {
			symbol: true,
			name: true,
			coinId: true,
			decimals: true,
			$icon: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import AssetInstanceView from '$/views/AssetInstanceView.svelte'
</script>


<svelte:head>
	<title>{(data.title ?? (pageSelection.entity == null ? 'Asset instance' : [String((({ ...data.selector, ...pageSelection.entity }).symbol) ?? ''), String((({ ...data.selector, ...pageSelection.entity }).name) ?? '')].filter(Boolean).join(' ') || 'Asset instance'))} • Asset instance • Blockhead</title>
</svelte:head>


<Page>
	<AssetInstanceView
		href={
			resolve('/network/[network=networkCaip2OrNetworkSlug]/asset/[kind=stringSegment]/[assetKey=stringSegment]', {
				network: params.network,
				kind: params.kind,
				assetKey: params.assetKey,
			})
		}
		selection={pageSelection}
	/>
</Page>

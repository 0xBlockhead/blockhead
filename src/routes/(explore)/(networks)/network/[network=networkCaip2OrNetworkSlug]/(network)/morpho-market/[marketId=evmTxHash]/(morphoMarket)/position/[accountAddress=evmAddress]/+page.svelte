<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.MorphoMarketPosition, {
		$account: {
			$network: data.selector.$network,
			$actor: {
				address: params.accountAddress,
			},
		},
		$market: data.selector,
	}, {
		sources: [
			Source.Morpho_Graphql,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import MorphoMarketPositionView from '$/views/MorphoMarketPositionView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'Morpho market position'} • Morpho market position • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Morpho market position'} • Morpho market position • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<MorphoMarketPositionView
		selection={pageSelection}
	/>
	{/if}
</Page>

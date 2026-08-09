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


	// Components
	import Page from '$/components/Page.svelte'
	import MorphoMarketPositionView from '$/views/MorphoMarketPositionView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? 'Morpho market position'} • Morpho market position • Blockhead</title>
</svelte:head>


<Page>
	<MorphoMarketPositionView
		selection={
			select(EntityType.MorphoMarketPosition, {
				$account: {
					$network: selector.$market.$network,
					$actor: {
						address: params.accountAddress,
					},
				},
				$market: data.selector,
			}, {
				sources: [
					Source.Morpho_Graphql,
				],
			})
		}
	/>
</Page>

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
	import MorphoVaultPositionView from '$/views/MorphoVaultPositionView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? 'Morpho vault position'} • Morpho vault position • Blockhead</title>
</svelte:head>


<Page>
	<MorphoVaultPositionView
		selection={
			select(EntityType.MorphoVaultPosition, {
				$account: {
					$network: selector.$vault.$network,
					$actor: {
						address: params.accountAddress,
					},
				},
				$vault: data.selector,
			}, {
				sources: [
					Source.Morpho_Graphql,
				],
			})
		}
	/>
</Page>

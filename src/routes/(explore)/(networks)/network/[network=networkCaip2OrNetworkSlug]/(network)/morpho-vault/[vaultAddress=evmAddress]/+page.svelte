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
	}: PageProps = $props()

	let pageSelection = $state.raw(
		select(EntityType.MorphoVault, data.selector, {
			sources: [
				Source.Morpho_Graphql,
			],
			fields: {
				name: true,
				symbol: true,
			},
		})
	)
	$effect(() => {
		pageSelection = (
			select(EntityType.MorphoVault, data.selector, {
				sources: [
					Source.Morpho_Graphql,
				],
				fields: {
					name: true,
					symbol: true,
				},
			})
		)
	})


	// Components
	import Page from '$/components/Page.svelte'
	import MorphoVaultView from '$/views/MorphoVaultView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entity == null ? 'Morpho vault' : [pageSelection.entity.name, pageSelection.entity.symbol].filter(Boolean).join(' ') || 'Morpho vault')} • Morpho vault • Blockhead</title>
</svelte:head>


<Page>
	<MorphoVaultView
		selection={pageSelection}
	/>
</Page>

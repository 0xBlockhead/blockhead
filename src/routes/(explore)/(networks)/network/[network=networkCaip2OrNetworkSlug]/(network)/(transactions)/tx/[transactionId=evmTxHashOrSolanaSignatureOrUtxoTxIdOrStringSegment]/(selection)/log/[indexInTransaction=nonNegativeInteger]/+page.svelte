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
		select(EntityType.EvmLog, data.selector, {
			sources: [
				Source.Blockscout_Rest,
			],
		})
	)
	$effect(() => {
		pageSelection = (
			select(EntityType.EvmLog, data.selector, {
				sources: [
					Source.Blockscout_Rest,
				],
			})
		)
	})


	// Components
	import Page from '$/components/Page.svelte'
	import EvmLogView from '$/views/EvmLogView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? ((String(pageSelection.entitySelector.indexInTransaction ?? '') ? 'Log #' + String(pageSelection.entitySelector.indexInTransaction ?? '') : '') || 'EVM log')} • EVM log • Blockhead</title>
</svelte:head>


<Page>
	<EvmLogView
		selection={pageSelection}
	/>
</Page>

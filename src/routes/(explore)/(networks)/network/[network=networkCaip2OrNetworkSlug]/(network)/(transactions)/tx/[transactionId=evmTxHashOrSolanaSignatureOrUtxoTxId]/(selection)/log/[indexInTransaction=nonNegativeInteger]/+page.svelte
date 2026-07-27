<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { ZeroExHex } from '$/schema/ZeroExHex.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.EvmLog, data.selector, {
		sources: [
			Source.Blockscout_Rest,
		],
		fields: {
			$emitter: true,
			$block: true,
			data: true,
			removed: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import EvmLogView from '$/views/EvmLogView.svelte'
</script>


<svelte:head>
	<title>{(data.title ?? (pageSelection.entity == null ? (String(pageSelection.entitySelector.indexInTransaction ?? '') ? 'Log #' + String(pageSelection.entitySelector.indexInTransaction ?? '') : '') || 'EVM log' : (String(pageSelection.entitySelector.indexInTransaction ?? '') ? 'Log #' + String(pageSelection.entitySelector.indexInTransaction ?? '') : '') || 'EVM log'))} • EVM log • Blockhead</title>
</svelte:head>


<Page>
	<EvmLogView
		selection={pageSelection}
	/>
</Page>

<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.EvmRollup, data.selector, {
		fields: {
			name: true,
			type: true,
			category: true,
			hostChain: true,
			$settlementNetwork: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import EvmRollupView from '$/views/EvmRollupView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.projectId ?? '') || 'EVM rollup' : [(pageSelection.entity.name ?? ''), pageSelection.entitySelector.projectId].filter(Boolean).join(' ') || 'EVM rollup')} • EVM rollup • Blockhead</title>
</svelte:head>


<Page>
	<EvmRollupView
		selection={pageSelection}
	/>
</Page>

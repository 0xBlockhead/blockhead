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

	const pageSelection = $derived(select(EntityType.CompoundPosition, data.selector, {
		sources: [
			Source.Compound_Rest,
		],
		fields: {
			baseTokenSymbol: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import CompoundPositionView from '$/views/CompoundPositionView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (pageSelection.entity == null ? 'Compound position' : pageSelection.entity.baseTokenSymbol || 'Compound position')} • Compound position • Blockhead</title>
</svelte:head>


<Page>
	<CompoundPositionView
		selection={pageSelection}
	/>
</Page>

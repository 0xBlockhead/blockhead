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

	const pageSelection = $derived(select(EntityType.CompoundComet, data.selector, {
		sources: [
			Source.Compound_Rest,
		],
		fields: {
			name: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import CompoundCometView from '$/views/CompoundCometView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (pageSelection.entity == null ? 'Compound Comet market' : pageSelection.entity.name || 'Compound Comet market')} • Compound Comet market • Blockhead</title>
</svelte:head>


<Page>
	<CompoundCometView
		selection={pageSelection}
	/>
</Page>

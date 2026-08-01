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

	const pageSelection = $derived(select(EntityType.MevBuilder, data.selector))


	// Components
	import Page from '$/components/Page.svelte'
	import MevBuilderView from '$/views/MevBuilderView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entitySelector.builderPubkey || 'MEV builder')} • MEV builder • Blockhead</title>
</svelte:head>


<Page>
	<MevBuilderView
		selection={pageSelection}
	/>
</Page>

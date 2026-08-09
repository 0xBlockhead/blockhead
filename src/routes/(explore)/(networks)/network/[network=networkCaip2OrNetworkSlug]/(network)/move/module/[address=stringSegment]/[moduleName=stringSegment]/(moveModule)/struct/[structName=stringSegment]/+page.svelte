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
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.MoveStruct, {
		$module: data.selector,
		structName: params.structName,
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import MoveStructView from '$/views/MoveStructView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entitySelector.structName || 'move struct')} • move struct • Blockhead</title>
</svelte:head>


<Page>
	<MoveStructView
		selection={pageSelection}
	/>
</Page>

<!-- Generated from APP.ts. Do not edit by hand. -->

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

	const pageSelection = $derived(select(EntityType.EnsName, data.selector, {
		fields: {
			normalizedName: true,
			node: true,
			labelName: true,
			labelhash: true,
			$parent: true,
			$resolverContract: true,
			$subgraphResolvedActor: true,
			$ownerActor: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import EnsNameView from '$/views/EnsNameView.svelte'
</script>


<svelte:head>
	<title>{(data.title ?? (pageSelection.entitySelector.name || 'ENS name'))} • ENS name • Blockhead</title>
</svelte:head>


<Page>
	<EnsNameView
		selection={pageSelection}
	/>
</Page>

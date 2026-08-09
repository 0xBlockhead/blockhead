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

	const pageSelection = $derived(select(EntityType.AvalancheValidator, data.selector))


	// Components
	import Page from '$/components/Page.svelte'
	import AvalancheValidatorView from '$/views/AvalancheValidatorView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entitySelector.nodeId || 'avalanche validator')} • avalanche validator • Blockhead</title>
</svelte:head>


<Page>
	<AvalancheValidatorView
		selection={pageSelection}
	/>
</Page>

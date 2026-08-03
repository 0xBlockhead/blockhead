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

	const pageSelection = $derived(select(EntityType.EvmUserOperation, data.selector, {
		sources: [
			Source.Blockscout_Rest,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import EvmUserOperationView from '$/views/EvmUserOperationView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entitySelector.hash || 'User operation')} • User operation • Blockhead</title>
</svelte:head>


<Page>
	<EvmUserOperationView
		selection={pageSelection}
	/>
</Page>

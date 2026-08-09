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
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.NearExecutionOutcome, {
		$transaction: data.selector,
		outcomeId: params.outcomeId,
	}, {
		sources: [
			Source.NearRpc_JsonRpc,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import NearExecutionOutcomeView from '$/views/NearExecutionOutcomeView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entitySelector.outcomeId || 'near execution outcome')} • near execution outcome • Blockhead</title>
</svelte:head>


<Page>
	<NearExecutionOutcomeView
		selection={pageSelection}
	/>
</Page>

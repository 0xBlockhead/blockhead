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

	const pageSelection = $derived(select(EntityType.AvailDataSubmission, {
		$network: data.selector,
		source: params.source,
		submissionKey: params.submissionKey,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import AvailDataSubmissionView from '$/views/AvailDataSubmissionView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entitySelector.submissionKey || 'avail data submission')} • avail data submission • Blockhead</title>
</svelte:head>


<Page>
	<AvailDataSubmissionView
		selection={pageSelection}
	/>
</Page>

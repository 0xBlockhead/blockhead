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

	const pageSelection = $derived(select(EntityType.Eip8004ReputationFeedback_Timestamp, {
		$registration: data.selector,
		clientAddress: params.clientAddress,
		feedbackIndex: Number(params.feedbackIndex),
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [params.source],
		fields: {
			value: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import Eip8004ReputationFeedback_TimestampView from '$/views/Eip8004ReputationFeedback_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entity == null ? String(pageSelection.entitySelector.feedbackIndex ?? '') || 'EIP-8004 reputation feedback timestamp' : (pageSelection.entity.value ?? '') || String(pageSelection.entitySelector.feedbackIndex) || 'EIP-8004 reputation feedback timestamp')} • EIP-8004 reputation feedback timestamp • Blockhead</title>
</svelte:head>


<Page>
	<Eip8004ReputationFeedback_TimestampView
		selection={pageSelection}
	/>
</Page>

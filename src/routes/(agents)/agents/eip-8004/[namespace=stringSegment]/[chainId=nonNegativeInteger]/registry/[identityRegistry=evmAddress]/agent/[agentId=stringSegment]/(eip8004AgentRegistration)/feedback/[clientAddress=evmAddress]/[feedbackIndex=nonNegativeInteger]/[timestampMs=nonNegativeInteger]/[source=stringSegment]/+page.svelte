<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { untrack } from 'svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import Eip8004ReputationFeedback_TimestampView from '$/views/Eip8004ReputationFeedback_TimestampView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.Eip8004ReputationFeedback_Timestamp, {
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
				}))}
			<title>{data?.title ?? (pageSelection.entity == null ? String(pageSelection.entitySelector.feedbackIndex ?? '') || 'EIP-8004 reputation feedback timestamp' : (pageSelection.entity.value ?? '') || String(pageSelection.entitySelector.feedbackIndex) || 'EIP-8004 reputation feedback timestamp')} • EIP-8004 reputation feedback timestamp • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'EIP-8004 reputation feedback timestamp'} • EIP-8004 reputation feedback timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.Eip8004ReputationFeedback_Timestamp, {
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
				}))}

		<Eip8004ReputationFeedback_TimestampView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>

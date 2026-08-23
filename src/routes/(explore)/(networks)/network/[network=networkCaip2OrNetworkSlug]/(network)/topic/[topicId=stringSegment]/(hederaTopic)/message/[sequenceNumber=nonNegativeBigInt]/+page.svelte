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
	import HederaTopicMessageView from '$/views/HederaTopicMessageView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.HederaTopicMessage, {
					$topic: data.selector,
					sequenceNumber: BigInt(params.sequenceNumber),
				}))}
			<title>{data?.title ?? 'hedera topic message'} • hedera topic message • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'hedera topic message'} • hedera topic message • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.HederaTopicMessage, {
					$topic: data.selector,
					sequenceNumber: BigInt(params.sequenceNumber),
				}))}

		<HederaTopicMessageView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>

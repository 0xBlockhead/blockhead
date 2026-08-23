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
	import HederaScheduleSignatureView from '$/views/HederaScheduleSignatureView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.HederaScheduleSignature, {
					$schedule: data.selector,
					publicKeyPrefix: params.publicKeyPrefix,
				}))}
			<title>{data?.title ?? 'hedera schedule signature'} • hedera schedule signature • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'hedera schedule signature'} • hedera schedule signature • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.HederaScheduleSignature, {
					$schedule: data.selector,
					publicKeyPrefix: params.publicKeyPrefix,
				}))}

		<HederaScheduleSignatureView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>

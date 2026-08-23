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


	// Components
	import Page from '$/components/Page.svelte'
	import HederaAllowanceView from '$/views/HederaAllowanceView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.HederaAllowance, data.selector)}
		<title>{data?.title ?? (pageSelection.entitySelector.allowanceKind || 'hedera allowance')} • hedera allowance • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'hedera allowance'} • hedera allowance • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.HederaAllowance, data.selector)}

	<HederaAllowanceView
		selection={pageSelection}
	/>
	{/if}
</Page>

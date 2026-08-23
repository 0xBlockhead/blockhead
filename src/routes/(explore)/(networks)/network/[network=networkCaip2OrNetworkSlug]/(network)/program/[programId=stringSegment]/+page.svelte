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
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import SolanaProgramView from '$/views/SolanaProgramView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.SolanaProgram, data.selector))}
			<title>{data?.title ?? (pageSelection.entitySelector.programId || 'solana program')} • solana program • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'solana program'} • solana program • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.SolanaProgram, data.selector))}

		<SolanaProgramView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>

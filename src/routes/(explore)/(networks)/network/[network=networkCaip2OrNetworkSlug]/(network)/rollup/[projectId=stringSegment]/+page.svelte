<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		data,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.EvmRollup, data.selector, {
		fields: {
			name: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import EvmRollupView from '$/views/EvmRollupView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.projectId ?? '') || 'EVM rollup' : [(pageSelection.entity.name ?? ''), pageSelection.entitySelector.projectId].filter(Boolean).join(' ') || 'EVM rollup')} • EVM rollup • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'EVM rollup'} • EVM rollup • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<EvmRollupView
		selection={pageSelection}
	/>
	{/if}
</Page>

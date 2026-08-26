<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		data,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.TallyGovernor, data.selector, {
		sources: [
			Source.Tally,
		],
		fields: {
			name: true,
			organizationName: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import TallyGovernorView from '$/views/TallyGovernorView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.governorId ?? '') || 'Tally governor' : [(pageSelection.entity.name ?? ''), (pageSelection.entity.organizationName ?? '')].filter(Boolean).join(' ') || pageSelection.entitySelector.governorId || 'Tally governor')} • Tally governor • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Tally governor'} • Tally governor • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<TallyGovernorView
		selection={pageSelection}
	/>
	{/if}
</Page>

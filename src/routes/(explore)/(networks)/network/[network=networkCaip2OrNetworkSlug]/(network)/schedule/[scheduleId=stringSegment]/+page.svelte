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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.HederaSchedule, data.selector))


	// Components
	import Page from '$/components/Page.svelte'
	import HederaScheduleView from '$/views/HederaScheduleView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'hedera schedule'} • hedera schedule • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'hedera schedule'} • hedera schedule • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<HederaScheduleView
		selection={pageSelection}
	/>
	{/if}
</Page>

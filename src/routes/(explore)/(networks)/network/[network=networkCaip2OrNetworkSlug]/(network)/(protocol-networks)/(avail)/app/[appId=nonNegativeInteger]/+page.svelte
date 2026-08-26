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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.AvailAppId, data.selector, {
		fields: {
			label: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import AvailAppIdView from '$/views/AvailAppIdView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entity == null ? String(pageSelection.entitySelector.appId ?? '') || 'avail app ID' : (pageSelection.entity.label ?? '') || String(pageSelection.entitySelector.appId) || 'avail app ID')} • avail app ID • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'avail app ID'} • avail app ID • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<AvailAppIdView
		selection={pageSelection}
	/>
	{/if}
</Page>

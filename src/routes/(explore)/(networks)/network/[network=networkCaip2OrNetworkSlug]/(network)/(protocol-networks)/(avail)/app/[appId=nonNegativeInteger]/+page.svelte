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
	import AvailAppIdView from '$/views/AvailAppIdView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.AvailAppId, data.selector, {
				fields: {
					label: true,
				},
			})}
		<title>{data?.title ?? (pageSelection.entity == null ? String(pageSelection.entitySelector.appId ?? '') || 'avail app ID' : (pageSelection.entity.label ?? '') || String(pageSelection.entitySelector.appId) || 'avail app ID')} • avail app ID • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'avail app ID'} • avail app ID • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.AvailAppId, data.selector, {
				fields: {
					label: true,
				},
			})}

	<AvailAppIdView
		selection={pageSelection}
	/>
	{/if}
</Page>

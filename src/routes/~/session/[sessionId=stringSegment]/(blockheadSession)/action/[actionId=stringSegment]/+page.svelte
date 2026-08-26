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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.BlockheadSessionAction, data.selector, {
		sources: [
			Source.Local_Internal,
		],
		fields: {
			actionType: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadSessionActionView from '$/views/BlockheadSessionActionView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entity == null ? 'blockhead session action' : pageSelection.entity.actionType || 'blockhead session action')} • blockhead session action • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'blockhead session action'} • blockhead session action • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<BlockheadSessionActionView
		selection={pageSelection}
	/>
	{/if}
</Page>

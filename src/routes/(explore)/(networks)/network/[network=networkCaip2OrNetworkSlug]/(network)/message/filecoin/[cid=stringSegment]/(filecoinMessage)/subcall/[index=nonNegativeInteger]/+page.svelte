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
		params,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.FilecoinMessageSubcall, {
		$message: data.selector,
		index: Number(params.index),
	}, {
		sources: [
			Source.Filfox_Rest,
			Source.Lotus_JsonRpc,
		],
		fields: {
			method: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import FilecoinMessageSubcallView from '$/views/FilecoinMessageSubcallView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entity == null ? 'filecoin message subcall' : pageSelection.entity.method || 'filecoin message subcall')} • filecoin message subcall • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'filecoin message subcall'} • filecoin message subcall • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<FilecoinMessageSubcallView
		selection={pageSelection}
	/>
	{/if}
</Page>

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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.FilecoinMessageTokenTransfer, {
		$message: data.selector,
		index: Number(params.index),
	}, {
		sources: [
			Source.Filfox_Rest,
		],
		fields: {
			tokenSymbol: true,
			token: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import FilecoinMessageTokenTransferView from '$/views/FilecoinMessageTokenTransferView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entity == null ? 'filecoin message token transfer' : [(pageSelection.entity.tokenSymbol ?? ''), (pageSelection.entity.token ?? '')].filter(Boolean).join(' ') || 'filecoin message token transfer')} • filecoin message token transfer • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'filecoin message token transfer'} • filecoin message token transfer • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<FilecoinMessageTokenTransferView
		selection={pageSelection}
	/>
	{/if}
</Page>

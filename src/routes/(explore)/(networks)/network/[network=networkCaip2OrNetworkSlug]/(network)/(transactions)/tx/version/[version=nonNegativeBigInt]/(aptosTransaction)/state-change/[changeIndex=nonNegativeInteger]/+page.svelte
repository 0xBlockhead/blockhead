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
		params,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.AptosStateChange, {
		$transaction: data.selector,
		changeIndex: Number(params.changeIndex),
	}, {
		fields: {
			changeKind: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import AptosStateChangeView from '$/views/AptosStateChangeView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entity == null ? 'aptos state change' : pageSelection.entity.changeKind || 'aptos state change')} • aptos state change • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'aptos state change'} • aptos state change • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<AptosStateChangeView
		selection={pageSelection}
	/>
	{/if}
</Page>

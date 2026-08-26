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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.IcpCanisterMethod, data.selector))


	// Components
	import Page from '$/components/Page.svelte'
	import IcpCanisterMethodView from '$/views/IcpCanisterMethodView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'ICP canister method'} • ICP canister method • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'ICP canister method'} • ICP canister method • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<IcpCanisterMethodView
		selection={pageSelection}
	/>
	{/if}
</Page>

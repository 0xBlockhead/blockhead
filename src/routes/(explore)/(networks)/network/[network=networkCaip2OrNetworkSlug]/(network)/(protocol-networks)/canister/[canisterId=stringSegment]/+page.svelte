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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.IcpCanister, data.selector))


	// Components
	import Page from '$/components/Page.svelte'
	import IcpCanisterView from '$/views/IcpCanisterView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'ICP canister'} • ICP canister • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'ICP canister'} • ICP canister • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<IcpCanisterView
		selection={pageSelection}
	/>
	{/if}
</Page>

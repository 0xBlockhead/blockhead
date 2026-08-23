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
	import IcpCanisterMetadataView from '$/views/IcpCanisterMetadataView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.IcpCanisterMetadata, data.selector)}
		<title>{data?.title ?? 'ICP canister metadata'} • ICP canister metadata • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'ICP canister metadata'} • ICP canister metadata • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.IcpCanisterMetadata, data.selector)}

	<IcpCanisterMetadataView
		selection={pageSelection}
	/>
	{/if}
</Page>

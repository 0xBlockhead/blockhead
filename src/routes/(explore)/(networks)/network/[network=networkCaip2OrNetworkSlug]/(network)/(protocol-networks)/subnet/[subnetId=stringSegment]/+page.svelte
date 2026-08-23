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
	import IcpSubnetView from '$/views/IcpSubnetView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.IcpSubnet, data.selector)}
		<title>{data?.title ?? 'ICP subnet'} • ICP subnet • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'ICP subnet'} • ICP subnet • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.IcpSubnet, data.selector)}

	<IcpSubnetView
		selection={pageSelection}
	/>
	{/if}
</Page>

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
	import HederaTokenAssociationView from '$/views/HederaTokenAssociationView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.HederaTokenAssociation, data.selector)}
		<title>{data?.title ?? 'hedera token association'} • hedera token association • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'hedera token association'} • hedera token association • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.HederaTokenAssociation, data.selector)}

	<HederaTokenAssociationView
		selection={pageSelection}
	/>
	{/if}
</Page>

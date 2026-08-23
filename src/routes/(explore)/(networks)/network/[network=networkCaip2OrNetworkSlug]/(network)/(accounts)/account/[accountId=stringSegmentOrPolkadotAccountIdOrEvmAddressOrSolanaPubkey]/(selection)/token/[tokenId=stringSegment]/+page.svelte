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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.HederaTokenAssociation, data.selector))


	// Components
	import Page from '$/components/Page.svelte'
	import HederaTokenAssociationView from '$/views/HederaTokenAssociationView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'hedera token association'} • hedera token association • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'hedera token association'} • hedera token association • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<HederaTokenAssociationView
		selection={pageSelection}
	/>
	{/if}
</Page>

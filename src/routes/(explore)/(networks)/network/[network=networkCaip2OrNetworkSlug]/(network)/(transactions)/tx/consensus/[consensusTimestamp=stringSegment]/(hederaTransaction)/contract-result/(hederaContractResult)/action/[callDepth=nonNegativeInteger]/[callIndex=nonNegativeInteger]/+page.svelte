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
		params,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.HederaContractAction, {
		$result: data.selector,
		callDepth: Number(params.callDepth),
		callIndex: Number(params.callIndex),
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import HederaContractActionView from '$/views/HederaContractActionView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'hedera contract action'} • hedera contract action • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'hedera contract action'} • hedera contract action • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<HederaContractActionView
		selection={pageSelection}
	/>
	{/if}
</Page>

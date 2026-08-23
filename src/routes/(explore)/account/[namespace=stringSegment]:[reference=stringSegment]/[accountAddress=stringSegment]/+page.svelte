<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.Account, data.selector, {
		sources: [
			Source.Constants_Internal,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import AccountView from '$/views/AccountView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (`${pageSelection.entitySelector.caip10.namespace}:${pageSelection.entitySelector.caip10.reference}:${pageSelection.entitySelector.caip10.accountAddress}` || 'account')} • account • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'account'} • account • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<AccountView
		selection={pageSelection}
	/>
	{/if}
</Page>

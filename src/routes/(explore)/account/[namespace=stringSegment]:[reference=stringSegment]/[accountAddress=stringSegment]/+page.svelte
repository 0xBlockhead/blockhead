<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { untrack } from 'svelte'


	// State
	let {
		data,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import AccountView from '$/views/AccountView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.Account, data.selector, {
					sources: [
						Source.Constants_Internal,
					],
				}))}
			<title>{data?.title ?? (`${pageSelection.entitySelector.caip10.namespace}:${pageSelection.entitySelector.caip10.reference}:${pageSelection.entitySelector.caip10.accountAddress}` || 'account')} • account • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'account'} • account • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.Account, data.selector, {
					sources: [
						Source.Constants_Internal,
					],
				}))}

		<AccountView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>

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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.ZcashShieldedAction, data.selector))


	// Components
	import Page from '$/components/Page.svelte'
	import ZcashShieldedActionView from '$/views/ZcashShieldedActionView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? ([pageSelection.entitySelector.actionKind, String(pageSelection.entitySelector.indexInTransaction)].filter(Boolean).join(' ') || 'Zcash shielded action')} • Zcash shielded action • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Zcash shielded action'} • Zcash shielded action • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<ZcashShieldedActionView
		selection={pageSelection}
	/>
	{/if}
</Page>

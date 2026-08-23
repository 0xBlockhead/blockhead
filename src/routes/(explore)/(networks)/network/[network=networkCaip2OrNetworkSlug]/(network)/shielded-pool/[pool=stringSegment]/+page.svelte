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
	import ZcashShieldedPoolView from '$/views/ZcashShieldedPoolView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.ZcashShieldedPool, data.selector)}
		<title>{data?.title ?? (pageSelection.entitySelector.pool || 'Zcash shielded pool')} • Zcash shielded pool • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Zcash shielded pool'} • Zcash shielded pool • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.ZcashShieldedPool, data.selector)}

	<ZcashShieldedPoolView
		selection={pageSelection}
	/>
	{/if}
</Page>

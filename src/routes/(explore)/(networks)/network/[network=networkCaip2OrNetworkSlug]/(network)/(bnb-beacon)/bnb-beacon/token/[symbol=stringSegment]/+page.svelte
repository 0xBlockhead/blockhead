<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { untrack } from 'svelte'


	// State
	let {
		data,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import BnbBeaconTokenView from '$/views/BnbBeaconTokenView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.BnbBeaconToken, data.selector))}
			<title>{data?.title ?? (pageSelection.entitySelector.symbol || 'bnb beacon token')} • bnb beacon token • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'bnb beacon token'} • bnb beacon token • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.BnbBeaconToken, data.selector))}

		<BnbBeaconTokenView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>

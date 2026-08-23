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
	import PolkadotValidatorView from '$/views/PolkadotValidatorView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.PolkadotValidator, data.selector))}
			<title>{data?.title ?? (pageSelection.entitySelector.stashAccountId || 'Polkadot validator')} • Polkadot validator • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'Polkadot validator'} • Polkadot validator • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.PolkadotValidator, data.selector))}

		<PolkadotValidatorView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>

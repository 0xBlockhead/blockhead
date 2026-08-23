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
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import StellarEffectView from '$/views/StellarEffectView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.StellarEffect, {
					$network: data.selector,
					effectId: params.effectId,
				}, {
					fields: {
						effectType: true,
					},
				}))}
			<title>{data?.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.effectId ?? '') || 'stellar effect' : pageSelection.entity.effectType || pageSelection.entitySelector.effectId || 'stellar effect')} • stellar effect • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'stellar effect'} • stellar effect • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.StellarEffect, {
					$network: data.selector,
					effectId: params.effectId,
				}, {
					fields: {
						effectType: true,
					},
				}))}

		<StellarEffectView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>

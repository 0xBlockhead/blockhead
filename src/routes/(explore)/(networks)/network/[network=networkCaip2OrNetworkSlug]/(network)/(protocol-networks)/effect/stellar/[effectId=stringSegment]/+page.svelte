<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.StellarEffect, {
		$network: data.selector,
		effectId: params.effectId,
	}, {
		fields: {
			effectType: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import StellarEffectView from '$/views/StellarEffectView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.effectId ?? '') || 'stellar effect' : pageSelection.entity.effectType || pageSelection.entitySelector.effectId || 'stellar effect')} • stellar effect • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'stellar effect'} • stellar effect • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<StellarEffectView
		selection={pageSelection}
	/>
	{/if}
</Page>

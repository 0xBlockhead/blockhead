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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.AvalancheDelegator, {
		$validator: data.selector,
		txId: params.txId,
	}, {
		fields: {
			delegatorAddress: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import AvalancheDelegatorView from '$/views/AvalancheDelegatorView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.txId ?? '') || 'avalanche delegator' : (pageSelection.entity.delegatorAddress ?? '') || pageSelection.entitySelector.txId || 'avalanche delegator')} • avalanche delegator • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'avalanche delegator'} • avalanche delegator • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<AvalancheDelegatorView
		selection={pageSelection}
	/>
	{/if}
</Page>

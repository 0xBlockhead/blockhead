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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.PolkadotValidator_Era, {
		$validator: data.selector,
		eraIndex: BigInt(params.eraIndex),
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import PolkadotValidator_EraView from '$/views/PolkadotValidator_EraView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (String(pageSelection.entitySelector.eraIndex) || 'polkadot validator era')} • polkadot validator era • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'polkadot validator era'} • polkadot validator era • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<PolkadotValidator_EraView
		selection={pageSelection}
	/>
	{/if}
</Page>

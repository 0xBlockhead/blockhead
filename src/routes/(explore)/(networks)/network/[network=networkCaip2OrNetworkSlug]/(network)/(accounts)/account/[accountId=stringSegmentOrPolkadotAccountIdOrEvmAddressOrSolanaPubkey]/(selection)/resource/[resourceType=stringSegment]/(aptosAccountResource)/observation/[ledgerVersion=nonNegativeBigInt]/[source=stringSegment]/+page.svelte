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
		params,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.AptosAccountResource_Timestamp, {
		$resource: data.selector,
		ledgerVersion: BigInt(params.ledgerVersion),
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import AptosAccountResource_TimestampView from '$/views/AptosAccountResource_TimestampView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (String(pageSelection.entitySelector.ledgerVersion) || 'aptos account resource timestamp')} • aptos account resource timestamp • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'aptos account resource timestamp'} • aptos account resource timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<AptosAccountResource_TimestampView
		selection={pageSelection}
	/>
	{/if}
</Page>

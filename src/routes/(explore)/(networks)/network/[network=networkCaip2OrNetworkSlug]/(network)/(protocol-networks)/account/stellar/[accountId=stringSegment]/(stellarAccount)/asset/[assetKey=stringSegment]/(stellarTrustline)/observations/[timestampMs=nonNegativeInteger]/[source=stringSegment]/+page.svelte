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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.StellarTrustline_Timestamp, {
		$trustline: data.selector,
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import StellarTrustline_TimestampView from '$/views/StellarTrustline_TimestampView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'stellar trustline timestamp'} • stellar trustline timestamp • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'stellar trustline timestamp'} • stellar trustline timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<StellarTrustline_TimestampView
		selection={pageSelection}
	/>
	{/if}
</Page>

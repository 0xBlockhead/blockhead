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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.StellarAccountSigner_Timestamp, {
		$signer: data.selector,
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import StellarAccountSigner_TimestampView from '$/views/StellarAccountSigner_TimestampView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'stellar account signer timestamp'} • stellar account signer timestamp • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'stellar account signer timestamp'} • stellar account signer timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<StellarAccountSigner_TimestampView
		selection={pageSelection}
	/>
	{/if}
</Page>

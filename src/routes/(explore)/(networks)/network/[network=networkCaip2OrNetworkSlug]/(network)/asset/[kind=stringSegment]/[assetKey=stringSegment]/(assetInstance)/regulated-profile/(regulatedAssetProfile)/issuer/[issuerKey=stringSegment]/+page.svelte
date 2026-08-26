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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.TrustedIssuer, {
		$profile: data.selector,
		issuerKey: params.issuerKey,
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import TrustedIssuerView from '$/views/TrustedIssuerView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'trusted issuer'} • trusted issuer • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'trusted issuer'} • trusted issuer • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<TrustedIssuerView
		selection={pageSelection}
	/>
	{/if}
</Page>

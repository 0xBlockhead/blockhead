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


	// Components
	import Page from '$/components/Page.svelte'
	import TrustedIssuerView from '$/views/TrustedIssuerView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.TrustedIssuer, {
				$profile: data.selector,
				issuerKey: params.issuerKey,
			})}
		<title>{data?.title ?? 'trusted issuer'} • trusted issuer • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'trusted issuer'} • trusted issuer • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.TrustedIssuer, {
				$profile: data.selector,
				issuerKey: params.issuerKey,
			})}

	<TrustedIssuerView
		selection={pageSelection}
	/>
	{/if}
</Page>

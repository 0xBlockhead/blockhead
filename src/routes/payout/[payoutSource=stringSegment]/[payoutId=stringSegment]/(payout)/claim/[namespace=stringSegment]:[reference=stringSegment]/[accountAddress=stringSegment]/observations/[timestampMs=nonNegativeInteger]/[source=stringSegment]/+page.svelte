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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.PayoutClaim_Timestamp, {
		$payout: data.selector,
		$account: {
			caip10: {
				namespace: params.namespace,
				reference: params.reference,
				accountAddress: params.accountAddress,
			},
		},
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import PayoutClaim_TimestampView from '$/views/PayoutClaim_TimestampView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'payout claim timestamp'} • payout claim timestamp • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'payout claim timestamp'} • payout claim timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<PayoutClaim_TimestampView
		selection={pageSelection}
	/>
	{/if}
</Page>

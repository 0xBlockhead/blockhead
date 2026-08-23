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
	import BlockheadWalletRequest_TimestampView from '$/views/BlockheadWalletRequest_TimestampView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.BlockheadWalletRequest_Timestamp, {
				$walletRequest: data.selector,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			}, {
				sources: [params.source],
				fields: {
					status: true,
				},
			})}
		<title>{data?.title ?? (pageSelection.entity == null ? 'blockhead wallet request timestamp' : pageSelection.entity.status || 'blockhead wallet request timestamp')} • blockhead wallet request timestamp • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'blockhead wallet request timestamp'} • blockhead wallet request timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.BlockheadWalletRequest_Timestamp, {
				$walletRequest: data.selector,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			}, {
				sources: [params.source],
				fields: {
					status: true,
				},
			})}

	<BlockheadWalletRequest_TimestampView
		selection={pageSelection}
	/>
	{/if}
</Page>

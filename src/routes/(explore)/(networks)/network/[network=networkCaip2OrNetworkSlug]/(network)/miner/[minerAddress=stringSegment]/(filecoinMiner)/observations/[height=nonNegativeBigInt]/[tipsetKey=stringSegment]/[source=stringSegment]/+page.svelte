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
	import FilecoinMiner_TimestampView from '$/views/FilecoinMiner_TimestampView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.FilecoinMiner_Timestamp, {
				$miner: data.selector,
				height: BigInt(params.height),
				tipsetKey: params.tipsetKey,
				source: params.source,
			}, {
				sources: [params.source],
				fields: {
					timestampMs: true,
				},
			})}
		<title>{data?.title ?? (pageSelection.entity == null ? 'filecoin miner timestamp' : String(pageSelection.entity.timestampMs) || 'filecoin miner timestamp')} • filecoin miner timestamp • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'filecoin miner timestamp'} • filecoin miner timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.FilecoinMiner_Timestamp, {
				$miner: data.selector,
				height: BigInt(params.height),
				tipsetKey: params.tipsetKey,
				source: params.source,
			}, {
				sources: [params.source],
				fields: {
					timestampMs: true,
				},
			})}

	<FilecoinMiner_TimestampView
		selection={pageSelection}
	/>
	{/if}
</Page>

<script lang="ts">
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import { getAppClient } from '$/routes/applicationClient.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'
	import CctpMessageView from '$/views/CctpMessageView.svelte'
	import OracleFeed_RoundView from '$/views/OracleFeed_RoundView.svelte'
	import UniswapV3Pool_BlockView from '$/views/UniswapV3Pool_BlockView.svelte'

	const select = getAppClient().select
	const block = select(EntityType.UniswapV3Pool_Block, {
		$pool: { $network: { caip2: { namespace: 'eip155', reference: '1' } }, poolAddress: '0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640' },
		blockNumber: 20_000_001n,
	}, { sources: [Source.Voltaire_JsonRpc] })
	const round = select(EntityType.OracleFeed_Round, {
		$oracleFeed: { $network: { caip2: { namespace: 'eip155', reference: '1' } }, address: '0x5f4ec3df9cbd43714fe2740f5e3616155c5b8419' },
		roundId: 42n,
	}, { sources: [Source.ChainlinkDataFeeds_Contracts] })
	const message = select(EntityType.CctpMessage, { sourceDomain: 0, nonce: '888' }, { sources: [Source.CircleCctpIris] })
	let loadMeasurements = $state({ block: false, round: false, message: false })
</script>

<section aria-label="Uniswap block identity">
	<button onclick={() => { loadMeasurements.block = true }}>Load measurements</button>
	<UniswapV3Pool_BlockView selection={block} layout={EntityLayout.Value} />
	{#if loadMeasurements.block}
		<ResourceBoundary resource={block({ fields: { tick: true } })}>
			{#snippet children(entity)}{entity.tick}{/snippet}
		</ResourceBoundary>
	{/if}
</section>

<section aria-label="Oracle round identity">
	<button onclick={() => { loadMeasurements.round = true }}>Load measurements</button>
	<OracleFeed_RoundView selection={round} layout={EntityLayout.Value} />
	{#if loadMeasurements.round}
		<ResourceBoundary resource={round({ fields: { answer: true } })}>
			{#snippet children(entity)}{entity.answer}{/snippet}
		</ResourceBoundary>
	{/if}
</section>

<section aria-label="CCTP message identity">
	<button onclick={() => { loadMeasurements.message = true }}>Load measurements</button>
	<CctpMessageView selection={message} layout={EntityLayout.Value} />
	{#if loadMeasurements.message}
		<ResourceBoundary resource={message({ fields: { messageHash: true } })}>
			{#snippet children(entity)}{entity.messageHash}{/snippet}
		</ResourceBoundary>
	{/if}
</section>

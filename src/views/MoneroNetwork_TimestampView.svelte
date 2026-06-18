<script lang="ts">
	// Types/constants
	import type { EntitySelector } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	// State
	let {
		selector,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
	}: {
		selector: EntitySelector<typeof schema, EntityType.MoneroNetwork_Timestamp>
		layout?: EntityLayout
		open?: boolean
	} = $props()

	const snapshot = $derived(select(EntityType.MoneroNetwork_Timestamp,
		selector,
		({ sources: [
				Source.MoneroDaemonRpc_JsonRpc,
			], fields: { height: true, targetHeight: true, topBlockHash: true, difficulty: true, wideDifficulty: true, cumulativeDifficulty: true, wideCumulativeDifficulty: true, blockSizeLimit: true, blockSizeMedian: true, blockWeightLimit: true, blockWeightMedian: true, databaseSize: true, freeSpace: true, greyPeerlistSize: true, whitePeerlistSize: true, incomingConnections: true, outgoingConnections: true, txCount: true, txPoolSize: true, altBlocksCount: true, targetSeconds: true, rpcConnections: true, mainnet: true, nettype: true, offline: true, synchronized: true, wasBootstrapEverUsed: true, version: true, status: true } }),
	))


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.MoneroNetwork_Timestamp}
	entitySelector={selector}
	bind:open
	{layout}
>
	{#snippet Value()}
		<ResourceBoundary
			resource={snapshot}
			placeholderText="Loading Monero network snapshot..."
		>
			{#snippet children(snapshot)}
				{#if snapshot.fields.height !== undefined}
					<NumberValue value={snapshot.fields.height} />
				{:else if snapshot.fields.txPoolSize !== undefined}
					<NumberValue value={snapshot.fields.txPoolSize} />
					in pool
				{:else}
					<Timestamp timestamp={selector.timestampMs} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={snapshot}
			placeholderText="Loading Monero network snapshot..."
		>
			{#snippet children(snapshot)}
				<dl data-column-item="center">
					{#if snapshot.fields.height !== undefined}
						<div>
							<dt>Height</dt>
							<dd><NumberValue value={snapshot.fields.height} /></dd>
						</div>
					{/if}

					{#if snapshot.fields.synchronized !== undefined}
						<div>
							<dt>Sync</dt>
							<dd>{snapshot.fields.synchronized ? 'Synchronized' : 'Syncing'}</dd>
						</div>
					{/if}

					{#if snapshot.fields.txPoolSize !== undefined}
						<div>
							<dt>Tx pool</dt>
							<dd><NumberValue value={snapshot.fields.txPoolSize} /></dd>
						</div>
					{/if}

					{#if snapshot.fields.difficulty !== undefined}
						<div>
							<dt>Difficulty</dt>
							<dd><NumberValue value={snapshot.fields.wideDifficulty ?? snapshot.fields.difficulty} /></dd>
						</div>
					{/if}

					{#if open && snapshot.fields.topBlockHash != null}
						<div>
							<dt>Top block</dt>
							<dd>
								<TruncatedValue
									value={snapshot.fields.topBlockHash}
									format={TruncatedValueFormat.Abbr}
								/>
							</dd>
						</div>
					{/if}

					{#if open && snapshot.fields.targetHeight !== undefined && snapshot.fields.targetHeight !== 0n}
						<div>
							<dt>Target height</dt>
							<dd><NumberValue value={snapshot.fields.targetHeight} /></dd>
						</div>
					{/if}

					{#if open && snapshot.fields.txCount !== undefined}
						<div>
							<dt>Transactions</dt>
							<dd><NumberValue value={snapshot.fields.txCount} /></dd>
						</div>
					{/if}

					{#if open && snapshot.fields.incomingConnections !== undefined}
						<div>
							<dt>Connections</dt>
							<dd>
								<NumberValue value={snapshot.fields.incomingConnections} />
								in /
								<NumberValue value={snapshot.fields.outgoingConnections ?? 0} />
								out
							</dd>
						</div>
					{/if}

					{#if open && snapshot.fields.whitePeerlistSize !== undefined}
						<div>
							<dt>Peerlist</dt>
							<dd>
								<NumberValue value={snapshot.fields.whitePeerlistSize} />
								white /
								<NumberValue value={snapshot.fields.greyPeerlistSize ?? 0} />
								grey
							</dd>
						</div>
					{/if}

					{#if open && snapshot.fields.blockWeightLimit !== undefined}
						<div>
							<dt>Block weight</dt>
							<dd>
								<NumberValue value={snapshot.fields.blockWeightMedian ?? 0} />
								median /
								<NumberValue value={snapshot.fields.blockWeightLimit} />
								limit
							</dd>
						</div>
					{/if}

					{#if open && snapshot.fields.databaseSize !== undefined}
						<div>
							<dt>Database</dt>
							<dd><NumberValue value={snapshot.fields.databaseSize} /> bytes</dd>
						</div>
					{/if}

					{#if open && snapshot.fields.targetSeconds !== undefined}
						<div>
							<dt>Target</dt>
							<dd><NumberValue value={snapshot.fields.targetSeconds} /> s</dd>
						</div>
					{/if}

					{#if open && snapshot.fields.nettype != null}
						<div>
							<dt>Network type</dt>
							<dd>{snapshot.fields.nettype}</dd>
						</div>
					{/if}

					{#if open && snapshot.fields.status != null}
						<div>
							<dt>Status</dt>
							<dd>{snapshot.fields.status}</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>

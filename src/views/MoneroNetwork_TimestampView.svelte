<script lang="ts">
	// Types/constants
	import type { EntityId } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'


	// State
	let {
		entityId,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
	}: {
		entityId: EntityId<typeof schema, EntityType.MoneroNetwork_Timestamp>
		layout?: EntityLayout
		open?: boolean
	} = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const snapshot = useEntity(
		EntityType.MoneroNetwork_Timestamp,
		entityId,
		{
			$: [
				Source.MoneroDaemonRpc_JsonRpc,
			],
			height: {},
			targetHeight: {},
			topBlockHash: {},
			difficulty: {},
			wideDifficulty: {},
			cumulativeDifficulty: {},
			wideCumulativeDifficulty: {},
			blockSizeLimit: {},
			blockSizeMedian: {},
			blockWeightLimit: {},
			blockWeightMedian: {},
			databaseSize: {},
			freeSpace: {},
			greyPeerlistSize: {},
			whitePeerlistSize: {},
			incomingConnections: {},
			outgoingConnections: {},
			txCount: {},
			txPoolSize: {},
			altBlocksCount: {},
			targetSeconds: {},
			rpcConnections: {},
			mainnet: {},
			nettype: {},
			offline: {},
			synchronized: {},
			wasBootstrapEverUsed: {},
			version: {},
			status: {},
		},
	)


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.MoneroNetwork_Timestamp}
	{entityId}
	bind:open
	{layout}
>
	{#snippet Title()}
		<Timestamp timestamp={entityId.timestampMs} />
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={snapshot}
			placeholderText="Loading Monero network snapshot..."
		>
			{#snippet children(snapshot)}
				<dl data-column-item="center">
					{#if snapshot.height !== undefined}
						<div>
							<dt>Height</dt>
							<dd><NumberValue value={snapshot.height} /></dd>
						</div>
					{/if}

					{#if snapshot.synchronized !== undefined}
						<div>
							<dt>Sync</dt>
							<dd>{snapshot.synchronized ? 'Synchronized' : 'Syncing'}</dd>
						</div>
					{/if}

					{#if snapshot.txPoolSize !== undefined}
						<div>
							<dt>Tx pool</dt>
							<dd><NumberValue value={snapshot.txPoolSize} /></dd>
						</div>
					{/if}

					{#if snapshot.difficulty !== undefined}
						<div>
							<dt>Difficulty</dt>
							<dd><NumberValue value={snapshot.wideDifficulty ?? snapshot.difficulty} /></dd>
						</div>
					{/if}

					{#if open && snapshot.topBlockHash != null}
						<div>
							<dt>Top block</dt>
							<dd>
								<TruncatedValue
									value={snapshot.topBlockHash}
									format={TruncatedValueFormat.Abbr}
								/>
							</dd>
						</div>
					{/if}

					{#if open && snapshot.targetHeight !== undefined && snapshot.targetHeight !== 0n}
						<div>
							<dt>Target height</dt>
							<dd><NumberValue value={snapshot.targetHeight} /></dd>
						</div>
					{/if}

					{#if open && snapshot.txCount !== undefined}
						<div>
							<dt>Transactions</dt>
							<dd><NumberValue value={snapshot.txCount} /></dd>
						</div>
					{/if}

					{#if open && snapshot.incomingConnections !== undefined}
						<div>
							<dt>Connections</dt>
							<dd>
								<NumberValue value={snapshot.incomingConnections} />
								in /
								<NumberValue value={snapshot.outgoingConnections ?? 0} />
								out
							</dd>
						</div>
					{/if}

					{#if open && snapshot.whitePeerlistSize !== undefined}
						<div>
							<dt>Peerlist</dt>
							<dd>
								<NumberValue value={snapshot.whitePeerlistSize} />
								white /
								<NumberValue value={snapshot.greyPeerlistSize ?? 0} />
								grey
							</dd>
						</div>
					{/if}

					{#if open && snapshot.blockWeightLimit !== undefined}
						<div>
							<dt>Block weight</dt>
							<dd>
								<NumberValue value={snapshot.blockWeightMedian ?? 0} />
								median /
								<NumberValue value={snapshot.blockWeightLimit} />
								limit
							</dd>
						</div>
					{/if}

					{#if open && snapshot.databaseSize !== undefined}
						<div>
							<dt>Database</dt>
							<dd><NumberValue value={snapshot.databaseSize} /> bytes</dd>
						</div>
					{/if}

					{#if open && snapshot.targetSeconds !== undefined}
						<div>
							<dt>Target</dt>
							<dd><NumberValue value={snapshot.targetSeconds} /> s</dd>
						</div>
					{/if}

					{#if open && snapshot.nettype != null}
						<div>
							<dt>Network type</dt>
							<dd>{snapshot.nettype}</dd>
						</div>
					{/if}

					{#if open && snapshot.status != null}
						<div>
							<dt>Status</dt>
							<dd>{snapshot.status}</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>

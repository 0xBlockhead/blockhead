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
		entityId: EntityId<typeof schema, EntityType.PolkadotNetwork_Timestamp>
		layout?: EntityLayout
		open?: boolean
	} = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const snapshot = useEntity(
		EntityType.PolkadotNetwork_Timestamp,
		entityId,
		{
			$: [
				Source.Polkadot_JsonRpc,
			],
			finalizedBlockNumber: {},
			finalizedBlockHash: {},
			finalizedExtrinsicCount: {},
			runtimeSpecName: {},
			runtimeSpecVersion: {},
			transactionVersion: {},
			stateVersion: {},
			peerCount: {},
			isSyncing: {},
			shouldHavePeers: {},
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
	entityType={EntityType.PolkadotNetwork_Timestamp}
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
			placeholderText="Loading Polkadot network snapshot…"
		>
			{#snippet children(snapshot)}
				<dl data-column-item="center">
					{#if snapshot.finalizedBlockNumber !== undefined}
						<div>
							<dt>Finalized block</dt>
							<dd><NumberValue value={snapshot.finalizedBlockNumber} /></dd>
						</div>
					{/if}

					{#if snapshot.runtimeSpecVersion !== undefined}
						<div>
							<dt>Runtime</dt>
							<dd>{snapshot.runtimeSpecName} #{snapshot.runtimeSpecVersion}</dd>
						</div>
					{/if}

					{#if snapshot.peerCount !== undefined}
						<div>
							<dt>Peers</dt>
							<dd><NumberValue value={snapshot.peerCount} /></dd>
						</div>
					{/if}

					{#if snapshot.isSyncing !== undefined}
						<div>
							<dt>Syncing</dt>
							<dd>{snapshot.isSyncing ? 'Yes' : 'No'}</dd>
						</div>
					{/if}

					{#if open && snapshot.finalizedBlockHash != null}
						<div>
							<dt>Finalized hash</dt>
							<dd>
								<TruncatedValue
									value={snapshot.finalizedBlockHash}
									format={TruncatedValueFormat.Abbr}
								/>
							</dd>
						</div>
					{/if}

					{#if open && snapshot.finalizedExtrinsicCount !== undefined}
						<div>
							<dt>Extrinsics</dt>
							<dd><NumberValue value={snapshot.finalizedExtrinsicCount} /></dd>
						</div>
					{/if}

					{#if open && snapshot.transactionVersion !== undefined}
						<div>
							<dt>Transaction version</dt>
							<dd><NumberValue value={snapshot.transactionVersion} /></dd>
						</div>
					{/if}

					{#if open && snapshot.stateVersion !== undefined}
						<div>
							<dt>State version</dt>
							<dd><NumberValue value={snapshot.stateVersion} /></dd>
						</div>
					{/if}

					{#if open && snapshot.shouldHavePeers !== undefined}
						<div>
							<dt>Peer expectation</dt>
							<dd>{snapshot.shouldHavePeers ? 'Required' : 'Optional'}</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>

<script lang="ts">
	// Types/constants
	import type { EntityId } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { subscribe } from '$/routes/+layout.svelte'
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

	const snapshot = subscribe(EntityType.PolkadotNetwork_Timestamp,
		entityId,
		({ sources: [
				Source.Polkadot_JsonRpc,
			], fields: { finalizedBlockNumber: true, finalizedBlockHash: true, finalizedExtrinsicCount: true, runtimeSpecName: true, runtimeSpecVersion: true, transactionVersion: true, stateVersion: true, peerCount: true, isSyncing: true, shouldHavePeers: true } }),
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
	{#snippet Value()}
		<ResourceBoundary
			resource={snapshot}
			placeholderText="Loading Polkadot network snapshot…"
		>
			{#snippet children(snapshot)}
				{#if snapshot.fields.finalizedBlockNumber !== undefined}
					<NumberValue value={snapshot.fields.finalizedBlockNumber} />
				{:else if snapshot.fields.peerCount !== undefined}
					<NumberValue value={snapshot.fields.peerCount} />
					peers
				{:else}
					<Timestamp timestamp={entityId.timestampMs} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={snapshot}
			placeholderText="Loading Polkadot network snapshot…"
		>
			{#snippet children(snapshot)}
				<dl data-column-item="center">
					{#if snapshot.fields.finalizedBlockNumber !== undefined}
						<div>
							<dt>Finalized block</dt>
							<dd><NumberValue value={snapshot.fields.finalizedBlockNumber} /></dd>
						</div>
					{/if}

					{#if snapshot.fields.runtimeSpecVersion !== undefined}
						<div>
							<dt>Runtime</dt>
							<dd>{snapshot.fields.runtimeSpecName} #{snapshot.fields.runtimeSpecVersion}</dd>
						</div>
					{/if}

					{#if snapshot.fields.peerCount !== undefined}
						<div>
							<dt>Peers</dt>
							<dd><NumberValue value={snapshot.fields.peerCount} /></dd>
						</div>
					{/if}

					{#if snapshot.fields.isSyncing !== undefined}
						<div>
							<dt>Syncing</dt>
							<dd>{snapshot.fields.isSyncing ? 'Yes' : 'No'}</dd>
						</div>
					{/if}

					{#if open && snapshot.fields.finalizedBlockHash != null}
						<div>
							<dt>Finalized hash</dt>
							<dd>
								<TruncatedValue
									value={snapshot.fields.finalizedBlockHash}
									format={TruncatedValueFormat.Abbr}
								/>
							</dd>
						</div>
					{/if}

					{#if open && snapshot.fields.finalizedExtrinsicCount !== undefined}
						<div>
							<dt>Extrinsics</dt>
							<dd><NumberValue value={snapshot.fields.finalizedExtrinsicCount} /></dd>
						</div>
					{/if}

					{#if open && snapshot.fields.transactionVersion !== undefined}
						<div>
							<dt>Transaction version</dt>
							<dd><NumberValue value={snapshot.fields.transactionVersion} /></dd>
						</div>
					{/if}

					{#if open && snapshot.fields.stateVersion !== undefined}
						<div>
							<dt>State version</dt>
							<dd><NumberValue value={snapshot.fields.stateVersion} /></dd>
						</div>
					{/if}

					{#if open && snapshot.fields.shouldHavePeers !== undefined}
						<div>
							<dt>Peer expectation</dt>
							<dd>{snapshot.fields.shouldHavePeers ? 'Required' : 'Optional'}</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>

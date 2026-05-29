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
		entityId: EntityId<typeof schema, EntityType.TronNetwork_Timestamp>
		layout?: EntityLayout
		open?: boolean
	} = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const snapshot = useEntity(
		EntityType.TronNetwork_Timestamp,
		entityId,
		{
			$: [
				Source.TronGrid_Rest,
			],
			latestBlockHeight: {},
			latestBlockHash: {},
			latestBlockTimeMs: {},
			latestBlockTransactionCount: {},
			witnessCount: {},
			activeWitnessCount: {},
			nodeBlockHeight: {},
			solidityBlockHeight: {},
			currentPeerCount: {},
			maintenanceIntervalMs: {},
			transactionFeeSun: {},
			createAccountFeeSun: {},
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
	entityType={EntityType.TronNetwork_Timestamp}
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
			placeholderText="Loading TRON network snapshot..."
		>
			{#snippet children(snapshot)}
				<dl data-column-item="center">
					{#if snapshot.latestBlockHeight !== undefined}
						<div>
							<dt>Latest block</dt>
							<dd><NumberValue value={snapshot.latestBlockHeight} /></dd>
						</div>
					{/if}

					{#if snapshot.activeWitnessCount !== undefined}
						<div>
							<dt>Active witnesses</dt>
							<dd><NumberValue value={snapshot.activeWitnessCount} /></dd>
						</div>
					{/if}

					{#if snapshot.currentPeerCount !== undefined}
						<div>
							<dt>Peers</dt>
							<dd><NumberValue value={snapshot.currentPeerCount} /></dd>
						</div>
					{/if}

					{#if snapshot.latestBlockTransactionCount !== undefined}
						<div>
							<dt>Transactions</dt>
							<dd><NumberValue value={snapshot.latestBlockTransactionCount} /></dd>
						</div>
					{/if}

					{#if open && snapshot.latestBlockHash != null}
						<div>
							<dt>Latest hash</dt>
							<dd>
								<TruncatedValue
									value={snapshot.latestBlockHash}
									format={TruncatedValueFormat.Abbr}
								/>
							</dd>
						</div>
					{/if}

					{#if open && snapshot.latestBlockTimeMs !== undefined}
						<div>
							<dt>Block time</dt>
							<dd><Timestamp timestamp={snapshot.latestBlockTimeMs} /></dd>
						</div>
					{/if}

					{#if open && snapshot.witnessCount !== undefined}
						<div>
							<dt>Witnesses</dt>
							<dd><NumberValue value={snapshot.witnessCount} /></dd>
						</div>
					{/if}

					{#if open && snapshot.nodeBlockHeight !== undefined}
						<div>
							<dt>Node block</dt>
							<dd><NumberValue value={snapshot.nodeBlockHeight} /></dd>
						</div>
					{/if}

					{#if open && snapshot.solidityBlockHeight !== undefined}
						<div>
							<dt>Solidity block</dt>
							<dd><NumberValue value={snapshot.solidityBlockHeight} /></dd>
						</div>
					{/if}

					{#if open && snapshot.maintenanceIntervalMs !== undefined}
						<div>
							<dt>Maintenance interval</dt>
							<dd><NumberValue value={snapshot.maintenanceIntervalMs} /> ms</dd>
						</div>
					{/if}

					{#if open && snapshot.transactionFeeSun !== undefined}
						<div>
							<dt>Transaction fee</dt>
							<dd><NumberValue value={snapshot.transactionFeeSun} /> sun</dd>
						</div>
					{/if}

					{#if open && snapshot.createAccountFeeSun !== undefined}
						<div>
							<dt>Create account fee</dt>
							<dd><NumberValue value={snapshot.createAccountFeeSun} /> sun</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>

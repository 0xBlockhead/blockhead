<script lang="ts">
	// Types/constants
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	// State
	let {
		selection,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
	}: {
		selection: EntityProxyResource<typeof schema, EntityType.TronNetwork_Timestamp>
		layout?: EntityLayout
		open?: boolean
	} = $props()


	const snapshot = $derived(selection(
		({ sources: [
				Source.TronGrid_Rest,
			], fields: { latestBlockHeight: true, latestBlockHash: true, latestBlockTimeMs: true, latestBlockTransactionCount: true, witnessCount: true, activeWitnessCount: true, nodeBlockHeight: true, solidityBlockHeight: true, currentPeerCount: true, maintenanceIntervalMs: true, transactionFeeSun: true, createAccountFeeSun: true } }),
	))


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.TronNetwork_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{layout}
>
	{#snippet Value()}
		<ResourceBoundary
			resource={snapshot}
			placeholderText="Loading TRON network snapshot..."
		>
			{#snippet children(snapshot)}
				{#if snapshot.fields.latestBlockHeight !== undefined}
					<NumberValue value={snapshot.fields.latestBlockHeight} />
				{:else if snapshot.fields.activeWitnessCount !== undefined}
					<NumberValue value={snapshot.fields.activeWitnessCount} />
					witnesses
				{:else}
					<Timestamp timestamp={selection.entitySelector.timestampMs} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={snapshot}
			placeholderText="Loading TRON network snapshot..."
		>
			{#snippet children(snapshot)}
				<dl data-column-item="center">
					{#if snapshot.fields.latestBlockHeight !== undefined}
						<div>
							<dt>Latest block</dt>
							<dd><NumberValue value={snapshot.fields.latestBlockHeight} /></dd>
						</div>
					{/if}

					{#if snapshot.fields.activeWitnessCount !== undefined}
						<div>
							<dt>Active witnesses</dt>
							<dd><NumberValue value={snapshot.fields.activeWitnessCount} /></dd>
						</div>
					{/if}

					{#if snapshot.fields.currentPeerCount !== undefined}
						<div>
							<dt>Peers</dt>
							<dd><NumberValue value={snapshot.fields.currentPeerCount} /></dd>
						</div>
					{/if}

					{#if snapshot.fields.latestBlockTransactionCount !== undefined}
						<div>
							<dt>Transactions</dt>
							<dd><NumberValue value={snapshot.fields.latestBlockTransactionCount} /></dd>
						</div>
					{/if}

					{#if open && snapshot.fields.latestBlockHash != null}
						<div>
							<dt>Latest hash</dt>
							<dd>
								<TruncatedValue
									value={snapshot.fields.latestBlockHash}
									format={TruncatedValueFormat.Abbr}
								/>
							</dd>
						</div>
					{/if}

					{#if open && snapshot.fields.latestBlockTimeMs !== undefined}
						<div>
							<dt>Block time</dt>
							<dd><Timestamp timestamp={snapshot.fields.latestBlockTimeMs} /></dd>
						</div>
					{/if}

					{#if open && snapshot.fields.witnessCount !== undefined}
						<div>
							<dt>Witnesses</dt>
							<dd><NumberValue value={snapshot.fields.witnessCount} /></dd>
						</div>
					{/if}

					{#if open && snapshot.fields.nodeBlockHeight !== undefined}
						<div>
							<dt>Node block</dt>
							<dd><NumberValue value={snapshot.fields.nodeBlockHeight} /></dd>
						</div>
					{/if}

					{#if open && snapshot.fields.solidityBlockHeight !== undefined}
						<div>
							<dt>Solidity block</dt>
							<dd><NumberValue value={snapshot.fields.solidityBlockHeight} /></dd>
						</div>
					{/if}

					{#if open && snapshot.fields.maintenanceIntervalMs !== undefined}
						<div>
							<dt>Maintenance interval</dt>
							<dd><NumberValue value={snapshot.fields.maintenanceIntervalMs} /> ms</dd>
						</div>
					{/if}

					{#if open && snapshot.fields.transactionFeeSun !== undefined}
						<div>
							<dt>Transaction fee</dt>
							<dd><NumberValue value={snapshot.fields.transactionFeeSun} /> sun</dd>
						</div>
					{/if}

					{#if open && snapshot.fields.createAccountFeeSun !== undefined}
						<div>
							<dt>Create account fee</dt>
							<dd><NumberValue value={snapshot.fields.createAccountFeeSun} /> sun</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>

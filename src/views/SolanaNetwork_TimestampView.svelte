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
		entityId: EntityId<typeof schema, EntityType.SolanaNetwork_Timestamp>
		layout?: EntityLayout
		open?: boolean
	} = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const snapshot = useEntity(
		EntityType.SolanaNetwork_Timestamp,
		entityId,
		{
			$: [
				Source.Solana_JsonRpc,
			],
			absoluteSlot: {},
			blockHeight: {},
			epoch: {},
			slotIndex: {},
			slotsInEpoch: {},
			transactionCount: {},
			currentValidatorCount: {},
			delinquentValidatorCount: {},
			totalActivatedStakeLamports: {},
			solanaCoreVersion: {},
			featureSet: {},
			health: {},
		},
	)


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.SolanaNetwork_Timestamp}
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
			placeholderText="Loading Solana network snapshot…"
		>
			{#snippet children(snapshot)}
				<dl data-column-item="center">
					{#if snapshot.absoluteSlot !== undefined}
						<div>
							<dt>Finalized slot</dt>
							<dd><NumberValue value={snapshot.absoluteSlot} /></dd>
						</div>
					{/if}

					{#if snapshot.epoch !== undefined}
						<div>
							<dt>Epoch</dt>
							<dd><NumberValue value={snapshot.epoch} /></dd>
						</div>
					{/if}

					{#if snapshot.slotIndex !== undefined && snapshot.slotsInEpoch !== undefined}
						<div>
							<dt>Epoch progress</dt>
							<dd><NumberValue value={snapshot.slotIndex} /> / <NumberValue value={snapshot.slotsInEpoch} /></dd>
						</div>
					{/if}

					{#if snapshot.currentValidatorCount !== undefined}
						<div>
							<dt>Current validators</dt>
							<dd><NumberValue value={snapshot.currentValidatorCount} /></dd>
						</div>
					{/if}

					{#if snapshot.delinquentValidatorCount !== undefined}
						<div>
							<dt>Delinquent validators</dt>
							<dd><NumberValue value={snapshot.delinquentValidatorCount} /></dd>
						</div>
					{/if}

					{#if open && snapshot.blockHeight !== undefined}
						<div>
							<dt>Block height</dt>
							<dd><NumberValue value={snapshot.blockHeight} /></dd>
						</div>
					{/if}

					{#if open && snapshot.transactionCount !== undefined}
						<div>
							<dt>Transactions</dt>
							<dd><NumberValue value={snapshot.transactionCount} /></dd>
						</div>
					{/if}

					{#if open && snapshot.totalActivatedStakeLamports !== undefined}
						<div>
							<dt>Activated stake</dt>
							<dd><NumberValue value={snapshot.totalActivatedStakeLamports} /> lamports</dd>
						</div>
					{/if}

					{#if open && snapshot.solanaCoreVersion != null}
						<div>
							<dt>Core version</dt>
							<dd>{snapshot.solanaCoreVersion}</dd>
						</div>
					{/if}

					{#if open && snapshot.featureSet !== undefined}
						<div>
							<dt>Feature set</dt>
							<dd><NumberValue value={snapshot.featureSet} /></dd>
						</div>
					{/if}

					{#if open && snapshot.health != null}
						<div>
							<dt>Health</dt>
							<dd>{snapshot.health}</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>

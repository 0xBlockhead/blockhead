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
		selection: EntityProxyResource<typeof schema, EntityType.SolanaNetwork_Timestamp>
		layout?: EntityLayout
		open?: boolean
	} = $props()


	const snapshot = $derived(selection(
		({ sources: [
				Source.Solana_JsonRpc,
			], fields: { absoluteSlot: true, blockHeight: true, epoch: true, slotIndex: true, slotsInEpoch: true, transactionCount: true, currentValidatorCount: true, delinquentValidatorCount: true, totalActivatedStakeLamports: true, solanaCoreVersion: true, featureSet: true, health: true } }),
	))


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.SolanaNetwork_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{layout}
>
	{#snippet Value()}
		<ResourceBoundary
			resource={snapshot}
			placeholderText="Loading Solana network snapshot…"
		>
			{#snippet children(snapshot)}
				{#if snapshot.absoluteSlot !== undefined}
					<NumberValue value={snapshot.absoluteSlot} />
				{:else if snapshot.epoch !== undefined}
					<NumberValue value={snapshot.epoch} />
					epoch
				{:else}
					<Timestamp timestamp={selection.entitySelector.timestampMs} />
				{/if}
			{/snippet}
		</ResourceBoundary>
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

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
		entityId: EntityId<typeof schema, EntityType.NearNetwork_Timestamp>
		layout?: EntityLayout
		open?: boolean
	} = $props()

	const snapshot = subscribe(EntityType.NearNetwork_Timestamp,
		entityId,
		({ sources: [
				Source.NearRpc_JsonRpc,
			], fields: { headHeight: true, headHash: true, epochId: true, epochHeight: true, epochStartHeight: true, chunkCount: true, gasPriceYoctoNear: true, currentValidatorCount: true, nextValidatorCount: true, currentProposalCount: true, protocolVersion: true, latestProtocolVersion: true, nodeVersion: true, syncing: true } }),
	)


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.NearNetwork_Timestamp}
	{entityId}
	bind:open
	{layout}
>
	{#snippet Value()}
		<ResourceBoundary
			resource={snapshot}
			placeholderText="Loading NEAR network snapshot..."
		>
			{#snippet children(snapshot)}
				{#if snapshot.fields.headHeight !== undefined}
					<NumberValue value={snapshot.fields.headHeight} />
				{:else if snapshot.fields.gasPriceYoctoNear !== undefined}
					<NumberValue value={snapshot.fields.gasPriceYoctoNear} />
					yoctoNEAR
				{:else}
					<Timestamp timestamp={entityId.timestampMs} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={snapshot}
			placeholderText="Loading NEAR network snapshot..."
		>
			{#snippet children(snapshot)}
				<dl data-column-item="center">
					{#if snapshot.fields.headHeight !== undefined}
						<div>
							<dt>Head height</dt>
							<dd><NumberValue value={snapshot.fields.headHeight} /></dd>
						</div>
					{/if}

					{#if snapshot.fields.chunkCount !== undefined}
						<div>
							<dt>Chunks</dt>
							<dd><NumberValue value={snapshot.fields.chunkCount} /></dd>
						</div>
					{/if}

					{#if snapshot.fields.currentValidatorCount !== undefined}
						<div>
							<dt>Validators</dt>
							<dd><NumberValue value={snapshot.fields.currentValidatorCount} /></dd>
						</div>
					{/if}

					{#if snapshot.fields.gasPriceYoctoNear !== undefined}
						<div>
							<dt>Gas price</dt>
							<dd><NumberValue value={snapshot.fields.gasPriceYoctoNear} /> yoctoNEAR</dd>
						</div>
					{/if}

					{#if open && snapshot.fields.headHash != null}
						<div>
							<dt>Head hash</dt>
							<dd>
								<TruncatedValue
									value={snapshot.fields.headHash}
									format={TruncatedValueFormat.Abbr}
								/>
							</dd>
						</div>
					{/if}

					{#if open && snapshot.fields.epochHeight !== undefined}
						<div>
							<dt>Epoch height</dt>
							<dd><NumberValue value={snapshot.fields.epochHeight} /></dd>
						</div>
					{/if}

					{#if open && snapshot.fields.epochStartHeight !== undefined}
						<div>
							<dt>Epoch start</dt>
							<dd><NumberValue value={snapshot.fields.epochStartHeight} /></dd>
						</div>
					{/if}

					{#if open && snapshot.fields.nextValidatorCount !== undefined}
						<div>
							<dt>Next validators</dt>
							<dd><NumberValue value={snapshot.fields.nextValidatorCount} /></dd>
						</div>
					{/if}

					{#if open && snapshot.fields.currentProposalCount !== undefined}
						<div>
							<dt>Current proposals</dt>
							<dd><NumberValue value={snapshot.fields.currentProposalCount} /></dd>
						</div>
					{/if}

					{#if open && snapshot.fields.protocolVersion !== undefined}
						<div>
							<dt>Protocol version</dt>
							<dd><NumberValue value={snapshot.fields.protocolVersion} /></dd>
						</div>
					{/if}

					{#if open && snapshot.fields.latestProtocolVersion !== undefined}
						<div>
							<dt>Latest protocol</dt>
							<dd><NumberValue value={snapshot.fields.latestProtocolVersion} /></dd>
						</div>
					{/if}

					{#if open && snapshot.fields.nodeVersion != null}
						<div>
							<dt>Node version</dt>
							<dd>{snapshot.fields.nodeVersion}</dd>
						</div>
					{/if}

					{#if open && snapshot.fields.syncing !== undefined}
						<div>
							<dt>Sync</dt>
							<dd>{snapshot.fields.syncing ? 'Syncing' : 'Synchronized'}</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>

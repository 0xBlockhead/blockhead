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
		selection: EntityProxyResource<typeof schema, EntityType.NearNetwork_Timestamp>
		layout?: EntityLayout
		open?: boolean
	} = $props()


	const snapshot = $derived(selection(
		({ sources: [
				Source.NearRpc_JsonRpc,
			], fields: { headHeight: true, headHash: true, epochId: true, epochHeight: true, epochStartHeight: true, chunkCount: true, gasPriceYoctoNear: true, currentValidatorCount: true, nextValidatorCount: true, currentProposalCount: true, protocolVersion: true, latestProtocolVersion: true, nodeVersion: true, syncing: true } }),
	))


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.NearNetwork_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{layout}
>
	{#snippet Value()}
		<ResourceBoundary
			resource={snapshot}
			placeholderText="Loading NEAR network snapshot..."
		>
			{#snippet children(snapshot)}
				{#if snapshot.headHeight !== undefined}
					<NumberValue value={snapshot.headHeight} />
				{:else if snapshot.gasPriceYoctoNear !== undefined}
					<NumberValue value={snapshot.gasPriceYoctoNear} />
					yoctoNEAR
				{:else}
					<Timestamp timestamp={selection.entitySelector.timestampMs} />
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
					{#if snapshot.headHeight !== undefined}
						<div>
							<dt>Head height</dt>
							<dd><NumberValue value={snapshot.headHeight} /></dd>
						</div>
					{/if}

					{#if snapshot.chunkCount !== undefined}
						<div>
							<dt>Chunks</dt>
							<dd><NumberValue value={snapshot.chunkCount} /></dd>
						</div>
					{/if}

					{#if snapshot.currentValidatorCount !== undefined}
						<div>
							<dt>Validators</dt>
							<dd><NumberValue value={snapshot.currentValidatorCount} /></dd>
						</div>
					{/if}

					{#if snapshot.gasPriceYoctoNear !== undefined}
						<div>
							<dt>Gas price</dt>
							<dd><NumberValue value={snapshot.gasPriceYoctoNear} /> yoctoNEAR</dd>
						</div>
					{/if}

					{#if open && snapshot.headHash != null}
						<div>
							<dt>Head hash</dt>
							<dd>
								<TruncatedValue
									value={snapshot.headHash}
									format={TruncatedValueFormat.Abbr}
								/>
							</dd>
						</div>
					{/if}

					{#if open && snapshot.epochHeight !== undefined}
						<div>
							<dt>Epoch height</dt>
							<dd><NumberValue value={snapshot.epochHeight} /></dd>
						</div>
					{/if}

					{#if open && snapshot.epochStartHeight !== undefined}
						<div>
							<dt>Epoch start</dt>
							<dd><NumberValue value={snapshot.epochStartHeight} /></dd>
						</div>
					{/if}

					{#if open && snapshot.nextValidatorCount !== undefined}
						<div>
							<dt>Next validators</dt>
							<dd><NumberValue value={snapshot.nextValidatorCount} /></dd>
						</div>
					{/if}

					{#if open && snapshot.currentProposalCount !== undefined}
						<div>
							<dt>Current proposals</dt>
							<dd><NumberValue value={snapshot.currentProposalCount} /></dd>
						</div>
					{/if}

					{#if open && snapshot.protocolVersion !== undefined}
						<div>
							<dt>Protocol version</dt>
							<dd><NumberValue value={snapshot.protocolVersion} /></dd>
						</div>
					{/if}

					{#if open && snapshot.latestProtocolVersion !== undefined}
						<div>
							<dt>Latest protocol</dt>
							<dd><NumberValue value={snapshot.latestProtocolVersion} /></dd>
						</div>
					{/if}

					{#if open && snapshot.nodeVersion != null}
						<div>
							<dt>Node version</dt>
							<dd>{snapshot.nodeVersion}</dd>
						</div>
					{/if}

					{#if open && snapshot.syncing !== undefined}
						<div>
							<dt>Sync</dt>
							<dd>{snapshot.syncing ? 'Syncing' : 'Synchronized'}</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>

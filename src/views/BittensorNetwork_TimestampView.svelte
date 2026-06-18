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
		selector: EntitySelector<typeof schema, EntityType.BittensorNetwork_Timestamp>
		layout?: EntityLayout
		open?: boolean
	} = $props()

	const snapshot = $derived(select(EntityType.BittensorNetwork_Timestamp,
		selector,
		({ sources: [
				Source.Bittensor_JsonRpc,
			], fields: { finalizedBlockNumber: true, finalizedBlockHash: true, runtimeSpecName: true, runtimeSpecVersion: true, runtimeImplVersion: true, peerCount: true, isSyncing: true, shouldHavePeers: true, subnetCount: true, subnetsInfoByteLength: true, dynamicInfoByteLength: true, metagraphsByteLength: true } }),
	))


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.BittensorNetwork_Timestamp}
	entitySelector={selector}
	bind:open
	{layout}
>
	{#snippet Value()}
		<ResourceBoundary
			resource={snapshot}
			placeholderText="Loading Bittensor network snapshot…"
		>
			{#snippet children(snapshot)}
				{#if snapshot.fields.finalizedBlockNumber !== undefined}
					<NumberValue value={snapshot.fields.finalizedBlockNumber} />
				{:else if snapshot.fields.subnetCount !== undefined}
					<NumberValue value={snapshot.fields.subnetCount} />
					subnets
				{:else}
					<Timestamp timestamp={selector.timestampMs} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={snapshot}
			placeholderText="Loading Bittensor network snapshot…"
		>
			{#snippet children(snapshot)}
				<dl data-column-item="center">
					{#if snapshot.fields.finalizedBlockNumber !== undefined}
						<div>
							<dt>Finalized block</dt>
							<dd><NumberValue value={snapshot.fields.finalizedBlockNumber} /></dd>
						</div>
					{/if}

					{#if snapshot.fields.subnetCount !== undefined}
						<div>
							<dt>Subnets</dt>
							<dd><NumberValue value={snapshot.fields.subnetCount} /></dd>
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

					{#if open && snapshot.fields.isSyncing !== undefined}
						<div>
							<dt>Syncing</dt>
							<dd>{snapshot.fields.isSyncing ? 'Yes' : 'No'}</dd>
						</div>
					{/if}

					{#if open && snapshot.fields.subnetsInfoByteLength !== undefined}
						<div>
							<dt>Subnet info bytes</dt>
							<dd><NumberValue value={snapshot.fields.subnetsInfoByteLength} /></dd>
						</div>
					{/if}

					{#if open && snapshot.fields.dynamicInfoByteLength !== undefined}
						<div>
							<dt>Dynamic info bytes</dt>
							<dd><NumberValue value={snapshot.fields.dynamicInfoByteLength} /></dd>
						</div>
					{/if}

					{#if open && snapshot.fields.metagraphsByteLength !== undefined}
						<div>
							<dt>Metagraph bytes</dt>
							<dd><NumberValue value={snapshot.fields.metagraphsByteLength} /></dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>

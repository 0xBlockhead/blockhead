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
		entityId: EntityId<typeof schema, EntityType.BittensorNetwork_Timestamp>
		layout?: EntityLayout
		open?: boolean
	} = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const snapshot = useEntity(
		EntityType.BittensorNetwork_Timestamp,
		entityId,
		{
			$: [
				Source.Bittensor_JsonRpc,
			],
			finalizedBlockNumber: {},
			finalizedBlockHash: {},
			runtimeSpecName: {},
			runtimeSpecVersion: {},
			runtimeImplVersion: {},
			peerCount: {},
			isSyncing: {},
			shouldHavePeers: {},
			subnetCount: {},
			subnetsInfoByteLength: {},
			dynamicInfoByteLength: {},
			metagraphsByteLength: {},
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
	entityType={EntityType.BittensorNetwork_Timestamp}
	{entityId}
	bind:open
	{layout}
>
	{#snippet Value()}
		<ResourceBoundary
			resource={snapshot}
			placeholderText="Loading Bittensor network snapshot…"
		>
			{#snippet children(snapshot)}
				{#if snapshot.finalizedBlockNumber !== undefined}
					<NumberValue value={snapshot.finalizedBlockNumber} />
				{:else if snapshot.subnetCount !== undefined}
					<NumberValue value={snapshot.subnetCount} />
					subnets
				{:else}
					<Timestamp timestamp={entityId.timestampMs} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Title()}
		{@render Value()}
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={snapshot}
			placeholderText="Loading Bittensor network snapshot…"
		>
			{#snippet children(snapshot)}
				<dl data-column-item="center">
					{#if snapshot.finalizedBlockNumber !== undefined}
						<div>
							<dt>Finalized block</dt>
							<dd><NumberValue value={snapshot.finalizedBlockNumber} /></dd>
						</div>
					{/if}

					{#if snapshot.subnetCount !== undefined}
						<div>
							<dt>Subnets</dt>
							<dd><NumberValue value={snapshot.subnetCount} /></dd>
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

					{#if open && snapshot.isSyncing !== undefined}
						<div>
							<dt>Syncing</dt>
							<dd>{snapshot.isSyncing ? 'Yes' : 'No'}</dd>
						</div>
					{/if}

					{#if open && snapshot.subnetsInfoByteLength !== undefined}
						<div>
							<dt>Subnet info bytes</dt>
							<dd><NumberValue value={snapshot.subnetsInfoByteLength} /></dd>
						</div>
					{/if}

					{#if open && snapshot.dynamicInfoByteLength !== undefined}
						<div>
							<dt>Dynamic info bytes</dt>
							<dd><NumberValue value={snapshot.dynamicInfoByteLength} /></dd>
						</div>
					{/if}

					{#if open && snapshot.metagraphsByteLength !== undefined}
						<div>
							<dt>Metagraph bytes</dt>
							<dd><NumberValue value={snapshot.metagraphsByteLength} /></dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>

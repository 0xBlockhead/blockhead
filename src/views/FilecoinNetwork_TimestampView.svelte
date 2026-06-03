<script lang="ts">
	// Types/constants
	import type { EntityId } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'


	// Context
	import { useEntity } from '$/collections/$queries.svelte.ts'
	// State
	let {
		entityId,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
	}: {
		entityId: EntityId<typeof schema, EntityType.FilecoinNetwork_Timestamp>
		layout?: EntityLayout
		open?: boolean
	} = $props()

	const snapshot = useEntity(
		EntityType.FilecoinNetwork_Timestamp,
		entityId,
		{
			$: [
				Source.Lotus_JsonRpc,
			],
			headHeight: {},
			headTipsetKey: {},
			headBlockCount: {},
			headTimestampMs: {},
			networkVersion: {},
			lotusVersion: {},
			lotusAgent: {},
			blockDelaySeconds: {},
			totalRawBytePower: {},
			totalQualityAdjustedPower: {},
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
	entityType={EntityType.FilecoinNetwork_Timestamp}
	{entityId}
	bind:open
	{layout}
>
	{#snippet Value()}
		<ResourceBoundary
			resource={snapshot}
			placeholderText="Loading Filecoin network snapshot..."
		>
			{#snippet children(snapshot)}
				{#if snapshot.headHeight !== undefined}
					<NumberValue value={snapshot.headHeight} />
				{:else if snapshot.networkVersion !== undefined}
					<NumberValue value={snapshot.networkVersion} />
				{:else}
					<Timestamp timestamp={entityId.timestampMs} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={snapshot}
			placeholderText="Loading Filecoin network snapshot..."
		>
			{#snippet children(snapshot)}
				<dl data-column-item="center">
					{#if snapshot.headHeight !== undefined}
						<div>
							<dt>Head height</dt>
							<dd><NumberValue value={snapshot.headHeight} /></dd>
						</div>
					{/if}

					{#if snapshot.headBlockCount !== undefined}
						<div>
							<dt>Head blocks</dt>
							<dd><NumberValue value={snapshot.headBlockCount} /></dd>
						</div>
					{/if}

					{#if snapshot.networkVersion !== undefined}
						<div>
							<dt>Network version</dt>
							<dd><NumberValue value={snapshot.networkVersion} /></dd>
						</div>
					{/if}

					{#if snapshot.totalQualityAdjustedPower !== undefined}
						<div>
							<dt>Quality-adjusted power</dt>
							<dd><NumberValue value={snapshot.totalQualityAdjustedPower} /></dd>
						</div>
					{/if}

					{#if open && snapshot.headTipsetKey != null}
						<div>
							<dt>Head key</dt>
							<dd>
								<TruncatedValue
									value={snapshot.headTipsetKey}
									format={TruncatedValueFormat.Abbr}
								/>
							</dd>
						</div>
					{/if}

					{#if open && snapshot.headTimestampMs !== undefined}
						<div>
							<dt>Head time</dt>
							<dd><Timestamp timestamp={snapshot.headTimestampMs} /></dd>
						</div>
					{/if}

					{#if open && snapshot.lotusVersion != null}
						<div>
							<dt>Lotus</dt>
							<dd>{snapshot.lotusAgent} {snapshot.lotusVersion}</dd>
						</div>
					{/if}

					{#if open && snapshot.blockDelaySeconds !== undefined}
						<div>
							<dt>Block delay</dt>
							<dd><NumberValue value={snapshot.blockDelaySeconds} /> s</dd>
						</div>
					{/if}

					{#if open && snapshot.totalRawBytePower !== undefined}
						<div>
							<dt>Raw byte power</dt>
							<dd><NumberValue value={snapshot.totalRawBytePower} /></dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>

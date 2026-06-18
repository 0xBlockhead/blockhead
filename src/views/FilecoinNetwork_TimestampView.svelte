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
		selector: EntitySelector<typeof schema, EntityType.FilecoinNetwork_Timestamp>
		layout?: EntityLayout
		open?: boolean
	} = $props()

	const snapshot = $derived(
		select(
			EntityType.FilecoinNetwork_Timestamp,
			selector,
			{
				sources: [
					Source.Lotus_JsonRpc,
				],
				fields: {
					headHeight: true,
					headTipsetKey: true,
					headBlockCount: true,
					headTimestampMs: true,
					networkVersion: true,
					lotusVersion: true,
					lotusAgent: true,
					blockDelaySeconds: true,
					totalRawBytePower: true,
					totalQualityAdjustedPower: true,
				},
			},
		),
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
	entitySelector={selector}
	bind:open
	{layout}
>
	{#snippet Value()}
		<ResourceBoundary
			resource={snapshot}
			placeholderText="Loading Filecoin network snapshot..."
		>
			{#snippet children(snapshot)}
				{#if snapshot.fields.headHeight !== undefined}
					<NumberValue value={snapshot.fields.headHeight} />
				{:else if snapshot.fields.networkVersion !== undefined}
					<NumberValue value={snapshot.fields.networkVersion} />
				{:else}
					<Timestamp timestamp={selector.timestampMs} />
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
					{#if snapshot.fields.headHeight !== undefined}
						<div>
							<dt>Head height</dt>
							<dd><NumberValue value={snapshot.fields.headHeight} /></dd>
						</div>
					{/if}

					{#if snapshot.fields.headBlockCount !== undefined}
						<div>
							<dt>Head blocks</dt>
							<dd><NumberValue value={snapshot.fields.headBlockCount} /></dd>
						</div>
					{/if}

					{#if snapshot.fields.networkVersion !== undefined}
						<div>
							<dt>Network version</dt>
							<dd><NumberValue value={snapshot.fields.networkVersion} /></dd>
						</div>
					{/if}

					{#if snapshot.fields.totalQualityAdjustedPower !== undefined}
						<div>
							<dt>Quality-adjusted power</dt>
							<dd><NumberValue value={snapshot.fields.totalQualityAdjustedPower} /></dd>
						</div>
					{/if}

					{#if open && snapshot.fields.headTipsetKey != null}
						<div>
							<dt>Head key</dt>
							<dd>
								<TruncatedValue
									value={snapshot.fields.headTipsetKey}
									format={TruncatedValueFormat.Abbr}
								/>
							</dd>
						</div>
					{/if}

					{#if open && snapshot.fields.headTimestampMs !== undefined}
						<div>
							<dt>Head time</dt>
							<dd><Timestamp timestamp={snapshot.fields.headTimestampMs} /></dd>
						</div>
					{/if}

					{#if open && snapshot.fields.lotusVersion != null}
						<div>
							<dt>Lotus</dt>
							<dd>{snapshot.fields.lotusAgent} {snapshot.fields.lotusVersion}</dd>
						</div>
					{/if}

					{#if open && snapshot.fields.blockDelaySeconds !== undefined}
						<div>
							<dt>Block delay</dt>
							<dd><NumberValue value={snapshot.fields.blockDelaySeconds} /> s</dd>
						</div>
					{/if}

					{#if open && snapshot.fields.totalRawBytePower !== undefined}
						<div>
							<dt>Raw byte power</dt>
							<dd><NumberValue value={snapshot.fields.totalRawBytePower} /></dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>

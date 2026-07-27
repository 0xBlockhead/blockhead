<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.Network_Activity_Day> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.SpaceAndTime_MakeInfinite,
		],
	}))
	const networkActivityDay = $derived(viewSelection({
		fields: {
			transactionCount: true,
			trustModel: true,
		},
	}))
	const titleFallback = $derived(String(pendingEntity.dayStartTimestampMs ?? '') || 'network activity day')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.Network_Activity_Day}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href ?? (
			selection.entitySelector.source === 'SpaceAndTime_MakeInfinite' ?
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/activity/day/[dayStartTimestampMs=nonNegativeInteger]',
					{
						network: (
							'caip2' in selection.entitySelector.$network ?
								String(caip2StringFromValue(selection.entitySelector.$network.caip2))
							:
								String(selection.entitySelector.$network.slug)
						),
						dayStartTimestampMs: String(selection.entitySelector.dayStartTimestampMs),
					}
				)
			:
				undefined
		)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<Timestamp timestamp={Number(pendingEntity.dayStartTimestampMs)} />
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={networkActivityDay}>
			{#snippet children(entity)}
				<NumberValue
					value={entity.transactionCount}
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={networkActivityDay}>
			{#snippet children(entity)}
				<span data-text="muted">
					{entity.trustModel}
				</span>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			A completed UTC day of provider-reported network activity aggregates.
		</p>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Day start</dt>
				<dd>
					<Timestamp timestamp={Number(pendingEntity.dayStartTimestampMs)} />
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					{pendingEntity.source}
				</dd>
			</div>

			<div>
				<dt>Block count</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									blockCount: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<NumberValue
								value={entity.blockCount}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Transaction count</dt>
				<dd>
					<ResourceBoundary
						resource={networkActivityDay}
					>
						{#snippet children(entity)}
							<NumberValue
								value={entity.transactionCount}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>End block number</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									endBlockNumber: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<NumberValue
								value={entity.endBlockNumber}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Indexed through</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									indexedThroughTimestampMs: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<Timestamp timestamp={Number(entity.indexedThroughTimestampMs)} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Resolved at</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									resolvedAtMs: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<Timestamp timestamp={Number(entity.resolvedAtMs)} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Trust model</dt>
				<dd>
					<ResourceBoundary
						resource={networkActivityDay}
					>
						{#snippet children(entity)}
							{entity.trustModel}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>

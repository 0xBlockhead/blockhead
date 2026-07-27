<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.BlockheadStateChannel_Timestamp> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Local_Internal,
		],
	}))
	const blockheadStateChannelTimestamp = $derived(viewSelection({
		fields: {
			totalDeposited: true,
			balance0: true,
			balance1: true,
			turnNum: true,
			status: true,
		},
	}))
	const titleFallback = $derived(String(pendingEntity.timestampMs ?? '') || 'blockhead state channel timestamp')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import BlockheadStateChannelView from '$/views/BlockheadStateChannelView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadStateChannel_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<Timestamp timestamp={Number(pendingEntity.timestampMs)} />
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={blockheadStateChannelTimestamp}>
			{#snippet children(entity)}
				{entity.status || String(pendingEntity.timestampMs) || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			{pendingEntity.source}
		</span>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>channel</dt>
				<dd>
					<BlockheadStateChannelView
						selection={select(EntityType.BlockheadStateChannel, selection.entitySelector.$channel)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Timestamp</dt>
				<dd>
					<Timestamp timestamp={Number(pendingEntity.timestampMs)} />
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					{pendingEntity.source}
				</dd>
			</div>

			<div>
				<dt>status</dt>
				<dd>
					<ResourceBoundary
						resource={blockheadStateChannelTimestamp}
					>
						{#snippet children(entity)}
							{entity.status}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>total deposited</dt>
				<dd>
					<ResourceBoundary
						resource={blockheadStateChannelTimestamp}
					>
						{#snippet children(entity)}
							{String(entity.totalDeposited)}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>balance0</dt>
				<dd>
					<ResourceBoundary
						resource={blockheadStateChannelTimestamp}
					>
						{#snippet children(entity)}
							{String(entity.balance0)}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>balance1</dt>
				<dd>
					<ResourceBoundary
						resource={blockheadStateChannelTimestamp}
					>
						{#snippet children(entity)}
							{String(entity.balance1)}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>turn num</dt>
				<dd>
					<ResourceBoundary
						resource={blockheadStateChannelTimestamp}
					>
						{#snippet children(entity)}
							{String(entity.turnNum)}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>

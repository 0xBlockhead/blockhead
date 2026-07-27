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
	}: EntitySelectionViewProps<EntityType.BlockheadStateChannelState> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Local_Internal,
		],
	}))
	const blockheadStateChannelState = $derived(viewSelection({
		fields: {
			intent: true,
			allocations: true,
			signatures: true,
			isFinal: true,
			timestamp: true,
		},
	}))
	const titleFallback = $derived(String(pendingEntity.version ?? '') || 'blockhead state channel state')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BlockheadStateChannelView from '$/views/BlockheadStateChannelView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadStateChannelState}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{String(pendingEntity.version ?? '') || 'blockhead state channel state'}
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={blockheadStateChannelState}>
			{#snippet children(entity)}
				{String(entity.isFinal) || String(pendingEntity.version) || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadStateChannelState}>
			{#snippet children(entity)}
				<span data-text="muted">
					<Timestamp timestamp={Number(entity.timestamp)} />
				</span>
			{/snippet}
		</ResourceBoundary>
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
				<dt>version</dt>
				<dd>
					{String(pendingEntity.version)}
				</dd>
			</div>

			<div>
				<dt>state data</dt>
				<dd>
					{pendingEntity.stateData}
				</dd>
			</div>

			<div>
				<dt>intent</dt>
				<dd>
					<ResourceBoundary
						resource={blockheadStateChannelState}
					>
						{#snippet children(entity)}
							{String(entity.intent)}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>allocations</dt>
				<dd>
					<ResourceBoundary
						resource={blockheadStateChannelState}
					>
						{#snippet children(entity)}
							{entity.allocations.map((allocation) => `${allocation.destination}:${allocation.token}:${allocation.amount}`).join(', ')}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>signatures</dt>
				<dd>
					<ResourceBoundary
						resource={blockheadStateChannelState}
					>
						{#snippet children(entity)}
							<TruncatedValue value={entity.signatures.join(', ')} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>is final</dt>
				<dd>
					<ResourceBoundary
						resource={blockheadStateChannelState}
					>
						{#snippet children(entity)}
							{entity.isFinal ? 'Yes' : 'No'}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>timestamp</dt>
				<dd>
					<ResourceBoundary
						resource={blockheadStateChannelState}
					>
						{#snippet children(entity)}
							<Timestamp timestamp={Number(entity.timestamp)} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>

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

	const blockheadStateChannelTimestamp = $derived(selection({
		sources: selection.sources ?? [
			Source.Local_Internal,
		],
	})({
		fields: {
			totalDeposited: true,
			balance0: true,
			balance1: true,
			turnNum: true,
			status: true,
		},
	}))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import BlockheadStateChannelView from '$/views/BlockheadStateChannelView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadStateChannel_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? String(selection.entitySelector.timestampMs)}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<Timestamp timestamp={selection.entitySelector.timestampMs} />
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={blockheadStateChannelTimestamp}>
			{#snippet children(entity)}
				{entity.status || String(selection.entitySelector.timestampMs)}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			{selection.entitySelector.source}
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
					/>
				</dd>
			</div>

			<div>
				<dt>Timestamp</dt>
				<dd>
					<Timestamp timestamp={selection.entitySelector.timestampMs} />
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					{selection.entitySelector.source}
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
							{entity.totalDeposited}
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
							{entity.balance0}
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
							{entity.balance1}
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
							{entity.turnNum}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>

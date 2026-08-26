<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.BlockheadStateChannelState>, 'prefetched'> = $props()

	const blockheadStateChannelState = $derived(selection({
		sources: selection.sources ?? [
			Source.Local_Internal,
		],
		fields: {
			intent: true,
			allocations: true,
			signatures: true,
			isFinal: true,
			timestamp: true,
		},
	}))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import BlockheadStateChannelView from '$/views/BlockheadStateChannelView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadStateChannelState}
	entitySelector={selection.entitySelector}
	title={title ?? String(selection.entitySelector.version)}
	href={
		href === undefined ?
			resolve(
				'/~/channel/[channelId=stringSegment]/(blockheadStateChannel)/state/[version=nonNegativeInteger]/[stateData=stringSegment]',
				{
					channelId: selection.entitySelector.$channel.id,
					version: String(selection.entitySelector.version),
					stateData: selection.entitySelector.stateData,
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<ResourceBoundary resource={blockheadStateChannelState}>
			{#snippet children(entity)}
				{String(entity.isFinal)}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadStateChannelState}>
			{#snippet children(entity)}
				<span data-text="muted">
					<Timestamp timestamp={entity.timestamp} />
				</span>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
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
				<dt>version</dt>
				<dd>
					{selection.entitySelector.version}
				</dd>
			</div>

			<div>
				<dt>state data</dt>
				<dd>
					{selection.entitySelector.stateData}
				</dd>
			</div>

			<div>
				<dt>intent</dt>
				<dd>
					<ResourceBoundary
						resource={blockheadStateChannelState}
					>
						{#snippet children(entity)}
							{entity.intent}
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
							{entity.signatures.join(', ')}
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
							<Timestamp timestamp={entity.timestamp} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>

<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
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
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType._GlobalSwarmAccess_Timestamp> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Constants_Internal,
			Source.Swarm_Rest,
		],
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import GlobalSwarmAccessView from '$/views/_GlobalSwarmAccessView.svelte'
</script>


<EntityView
	entityType={EntityType._GlobalSwarmAccess_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? 'global Swarm access timestamp'}
	href={
		href === undefined ?
			resolve(
				'/(swarm)/swarm/(swarmProtocol)/access/(globalSwarmAccess)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
				{
					timestampMs: String(selection.entitySelector.timestampMs),
					source: selection.entitySelector.source,
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<GlobalSwarmAccessView
			selection={select(EntityType._GlobalSwarmAccess, selection.entitySelector.$hub)}
			href={null}
			layout={EntityLayout.Title}
			open={false}
		/>
	{/snippet}

	{#snippet Value()}
		<Timestamp timestamp={selection.entitySelector.timestampMs} />
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Hub</dt>
				<dd>
					<GlobalSwarmAccessView
						selection={select(EntityType._GlobalSwarmAccess, selection.entitySelector.$hub)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
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

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							declaredAccessEndpointCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const declaredAccessEndpointCount = entity.declaredAccessEndpointCount}
					{#if declaredAccessEndpointCount != null}
						<div>
							<dt>Declared access endpoints</dt>
							<dd>
								<NumberValue
									value={declaredAccessEndpointCount}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							reachableAccessEndpointCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const reachableAccessEndpointCount = entity.reachableAccessEndpointCount}
					{#if reachableAccessEndpointCount != null}
						<div>
							<dt>Reachable access endpoints</dt>
							<dd>
								<NumberValue
									value={reachableAccessEndpointCount}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							observedResourceCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const observedResourceCount = entity.observedResourceCount}
					{#if observedResourceCount != null}
						<div>
							<dt>Observed resources</dt>
							<dd>
								<NumberValue
									value={observedResourceCount}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							seededExampleCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const seededExampleCount = entity.seededExampleCount}
					{#if seededExampleCount != null}
						<div>
							<dt>Seeded examples</dt>
							<dd>
								<NumberValue
									value={seededExampleCount}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							reachable: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const reachable = entity.reachable}
					{#if reachable != null}
						<div>
							<dt>Reachable</dt>
							<dd>
								{reachable ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>

<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'


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
	}: Omit<EntitySelectionViewProps<EntityType.GitRefObservation_Timestamp>, 'prefetched'> = $props()

	const ref = $derived(selection.entitySelector.$ref)
	const gitRefObservationTimestamp = $derived(selection({
		fields: {
			targetObjectId: true,
		},
	}))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import GitRefView from '$/views/GitRefView.svelte'
</script>


<EntityView
	entityType={EntityType.GitRefObservation_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? String(selection.entitySelector.timestampMs)}
	href={
		href === undefined ?
			(
				ref.$repository.repositoryId !== undefined ?
					resolve(
						'/git/repository/id/[repositoryId=stringSegment]/(gitRepository)/ref/[refName=stringSegment]/(gitRef)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
						{
							repositoryId: ref.$repository.repositoryId,
							refName: ref.refName,
							timestampMs: String(selection.entitySelector.timestampMs),
							source: selection.entitySelector.source,
						}
					)
				:
					undefined
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<Timestamp timestamp={selection.entitySelector.timestampMs} />
	{/snippet}

	{#snippet Value()}
		{selection.entitySelector.source || String(selection.entitySelector.timestampMs)}
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={gitRefObservationTimestamp}>
			{#snippet children(entity)}
				{@const targetObjectId = entity.targetObjectId}
				{#if targetObjectId != null}
					<span data-text="muted">
						<TruncatedValue value={targetObjectId} />
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>ref</dt>
				<dd>
					<GitRefView
						selection={select(EntityType.GitRef, selection.entitySelector.$ref)}
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

			<ResourceBoundary
				resource={gitRefObservationTimestamp}
			>
				{#snippet children(entity)}
					{@const targetObjectId = entity.targetObjectId}
					{#if targetObjectId != null}
						<div>
							<dt>target object ID</dt>
							<dd>
								<TruncatedValue value={targetObjectId} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							peeledObjectId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const peeledObjectId = entity.peeledObjectId}
					{#if peeledObjectId != null}
						<div>
							<dt>peeled object ID</dt>
							<dd>
								<TruncatedValue value={peeledObjectId} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							advertised: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const advertised = entity.advertised}
					{#if advertised != null}
						<div>
							<dt>advertised</dt>
							<dd>
								{advertised ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>

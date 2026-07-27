<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { ZeroExHex } from '$/schema/ZeroExHex.ts'


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
	}: EntitySelectionViewProps<EntityType.GitRefObservation_Timestamp> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const gitRefObservationTimestamp = $derived(selection({
		fields: {
			targetObjectId: true,
		},
	}))
	const titleFallback = $derived(String(pendingEntity.timestampMs ?? '') || 'Git ref observation timestamp')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import GitRefView from '$/views/GitRefView.svelte'
</script>


<EntityView
	entityType={EntityType.GitRefObservation_Timestamp}
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
		{(pendingEntity.source ?? '') || String(pendingEntity.timestampMs ?? '') || titleFallback}
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={gitRefObservationTimestamp}>
			{#snippet children(entity)}
				{@const targetObjectId0 = entity.targetObjectId}
				{#if targetObjectId0 != null}
					<span data-text="muted">
						<TruncatedValue value={String(targetObjectId0)} />
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>ref</dt>
				<dd>
					<GitRefView
						selection={select(EntityType.GitRef, selection.entitySelector.$ref)}
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

			<ResourceBoundary
				resource={gitRefObservationTimestamp}
			>
				{#snippet children(entity)}
					{@const targetObjectId = entity.targetObjectId}
					{#if targetObjectId != null}
						<div>
							<dt>target object ID</dt>
							<dd>
								<TruncatedValue value={String(targetObjectId)} />
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
								<TruncatedValue value={String(peeledObjectId)} />
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

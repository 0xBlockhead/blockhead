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
	}: EntitySelectionViewProps<EntityType.GitRef> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const gitRef = $derived(selection({
		fields: {
			refKind: true,
			targetObjectId: true,
		},
	}))
	const titleFallback = $derived((pendingEntity.refName ?? '') || 'Git ref')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import GitRefObservation_TimestampsView from '$/views/GitRefObservation_TimestampsView.svelte'
	import GitRepositoryView from '$/views/GitRepositoryView.svelte'
</script>


<EntityView
	entityType={EntityType.GitRef}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{(pendingEntity.refName ?? '') || 'Git ref'}
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={gitRef}>
			{#snippet children(entity)}
				{entity.refKind || pendingEntity.refName || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={gitRef}>
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
				<dt>repository</dt>
				<dd>
					<GitRepositoryView
						selection={select(EntityType.GitRepository, selection.entitySelector.$repository)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>ref name</dt>
				<dd>
					{pendingEntity.refName}
				</dd>
			</div>

			<div>
				<dt>ref kind</dt>
				<dd>
					<ResourceBoundary
						resource={gitRef}
					>
						{#snippet children(entity)}
							{entity.refKind}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={gitRef}
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
							symbolicTarget: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const symbolicTarget = entity.symbolicTarget}
					{#if symbolicTarget != null}
						<div>
							<dt>symbolic target</dt>
							<dd>
								{symbolicTarget}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const gitRefGitRefObservationTimestampsViewObservationsResource = selection.$$observations}
		<ResourceBoundary
			resource={gitRefGitRefObservationTimestampsViewObservationsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<GitRefObservation_TimestampsView
						selection={gitRefGitRefObservationTimestampsViewObservationsResource}
						countResource={gitRefGitRefObservationTimestampsViewObservationsResource.count}
						title='observations'
						id='observations'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>

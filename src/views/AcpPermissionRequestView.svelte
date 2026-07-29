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
	}: EntitySelectionViewProps<EntityType.AcpPermissionRequest> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.AcpLocal_JsonRpc,
		],
	}))
	const acpPermissionRequest = $derived(viewSelection({
		fields: {
			requestKind: true,
			decision: true,
		},
	}))
	const titleFallback = $derived(selection.entitySelector.requestId || 'ACP permission request')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import AcpSessionView from '$/views/AcpSessionView.svelte'
</script>


<EntityView
	entityType={EntityType.AcpPermissionRequest}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{selection.entitySelector.requestId || 'ACP permission request'}
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={acpPermissionRequest}>
			{#snippet children(entity)}
				{entity.requestKind || selection.entitySelector.requestId || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={acpPermissionRequest}>
			{#snippet children(entity)}
				{@const decision = entity.decision}
				{#if decision != null}
					<span data-text="muted">
						{decision}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>session</dt>
				<dd>
					<AcpSessionView
						selection={select(EntityType.AcpSession, selection.entitySelector.$session)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>request ID</dt>
				<dd>
					{selection.entitySelector.requestId}
				</dd>
			</div>

			<div>
				<dt>request kind</dt>
				<dd>
					<ResourceBoundary
						resource={acpPermissionRequest}
					>
						{#snippet children(entity)}
							{entity.requestKind}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={acpPermissionRequest}
			>
				{#snippet children(entity)}
					{@const decision = entity.decision}
					{#if decision != null}
						<div>
							<dt>decision</dt>
							<dd>
								{decision}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							createdAt: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const createdAt = entity.createdAt}
					{#if createdAt != null}
						<div>
							<dt>Created</dt>
							<dd>
								<Timestamp timestamp={createdAt} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							resolvedAt: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedAt = entity.resolvedAt}
					{#if resolvedAt != null}
						<div>
							<dt>resolved AT</dt>
							<dd>
								<Timestamp timestamp={resolvedAt} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>

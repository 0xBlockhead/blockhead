<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { UrlString } from '$/schema/UrlString.ts'


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
	}: EntitySelectionViewProps<EntityType.A2aAgentService> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [],
	}))
	const a2aAgentService = $derived(viewSelection({
		fields: {
			transportKind: true,
		},
	}))
	const titleFallback = $derived(String(pendingEntity.endpointUrl ?? '') || 'A2A agent service')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import A2aTasksView from '$/views/A2aTasksView.svelte'
	import A2aAgentService_TimestampsView from '$/views/A2aAgentService_TimestampsView.svelte'
	import A2aAgentCardView from '$/views/A2aAgentCardView.svelte'
</script>


<EntityView
	entityType={EntityType.A2aAgentService}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{String(pendingEntity.endpointUrl ?? '') || 'A2A agent service'}
	{/snippet}

	{#snippet Value()}
		{(pendingEntity.protocolBinding ?? '') || String(pendingEntity.endpointUrl ?? '') || titleFallback}
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={a2aAgentService}>
			{#snippet children(entity)}
				{@const transportKind0 = entity.transportKind}
				{#if transportKind0 != null}
					<span data-text="muted">
						{transportKind0}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>card</dt>
				<dd>
					<A2aAgentCardView
						selection={select(EntityType.A2aAgentCard, selection.entitySelector.$card)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>protocol binding</dt>
				<dd>
					{pendingEntity.protocolBinding}
				</dd>
			</div>

			<div>
				<dt>endpoint URL</dt>
				<dd>
					<a
						href={String(pendingEntity.endpointUrl)}
						target="_blank"
						rel="noreferrer noopener"
					>
						<TruncatedValue value={String(pendingEntity.endpointUrl)} />
					</a>
				</dd>
			</div>

			<ResourceBoundary
				resource={a2aAgentService}
			>
				{#snippet children(entity)}
					{@const transportKind = entity.transportKind}
					{#if transportKind != null}
						<div>
							<dt>transport kind</dt>
							<dd>
								{transportKind}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							authKind: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const authKind = entity.authKind}
					{#if authKind != null}
						<div>
							<dt>auth kind</dt>
							<dd>
								{authKind}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const a2aAgentServiceA2aTasksViewTasksResource = selection.$$tasks}
		<ResourceBoundary
			resource={a2aAgentServiceA2aTasksViewTasksResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<A2aTasksView
						selection={a2aAgentServiceA2aTasksViewTasksResource}
						countResource={a2aAgentServiceA2aTasksViewTasksResource.count}
						title='tasks'
						id='tasks'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const a2aAgentServiceA2aAgentServiceTimestampsViewTimestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={a2aAgentServiceA2aAgentServiceTimestampsViewTimestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<A2aAgentService_TimestampsView
						selection={a2aAgentServiceA2aAgentServiceTimestampsViewTimestampsResource}
						countResource={a2aAgentServiceA2aAgentServiceTimestampsViewTimestampsResource.count}
						title='timestamps'
						id='timestamps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>

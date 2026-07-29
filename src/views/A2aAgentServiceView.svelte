<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'


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

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [],
	}))
	const a2aAgentService = $derived(viewSelection({
		fields: {
			transportKind: true,
		},
	}))
	const titleFallback = $derived(selection.entitySelector.endpointUrl || 'A2A agent service')


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
		{selection.entitySelector.endpointUrl || 'A2A agent service'}
	{/snippet}

	{#snippet Value()}
		{selection.entitySelector.protocolBinding || selection.entitySelector.endpointUrl || titleFallback}
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={a2aAgentService}>
			{#snippet children(entity)}
				{@const transportKind = entity.transportKind}
				{#if transportKind != null}
					<span data-text="muted">
						{transportKind}
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
					{selection.entitySelector.protocolBinding}
				</dd>
			</div>

			<div>
				<dt>endpoint URL</dt>
				<dd>
					<a
						href={selection.entitySelector.endpointUrl}
						target="_blank"
						rel="noreferrer noopener"
					>
						<TruncatedValue value={selection.entitySelector.endpointUrl} />
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
		{@const tasksResource = selection.$$tasks}
		<ResourceBoundary
			resource={tasksResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<A2aTasksView
						selection={tasksResource}
						countResource={tasksResource.count}
						title='tasks'
						id='tasks'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const timestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={timestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<A2aAgentService_TimestampsView
						selection={timestampsResource}
						countResource={timestampsResource.count}
						title='timestamps'
						id='timestamps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>

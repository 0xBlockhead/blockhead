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
	}: EntitySelectionViewProps<EntityType.A2aMessage> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [],
	}))
	const a2aMessage = $derived(viewSelection({
		fields: {
			role: true,
			createdAt: true,
		},
	}))
	const titleFallback = $derived((pendingEntity.messageId ?? '') || 'A2A message')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import A2aMessagePartsView from '$/views/A2aMessagePartsView.svelte'
	import A2aTaskView from '$/views/A2aTaskView.svelte'
</script>


<EntityView
	entityType={EntityType.A2aMessage}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{(pendingEntity.messageId ?? '') || 'A2A message'}
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={a2aMessage}>
			{#snippet children(entity)}
				{entity.role || pendingEntity.messageId || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={a2aMessage}>
			{#snippet children(entity)}
				{@const createdAt0 = entity.createdAt}
				{#if createdAt0 != null}
					<span data-text="muted">
						<Timestamp timestamp={Number(createdAt0)} />
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>task</dt>
				<dd>
					<A2aTaskView
						selection={select(EntityType.A2aTask, selection.entitySelector.$task)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>message ID</dt>
				<dd>
					{pendingEntity.messageId}
				</dd>
			</div>

			<div>
				<dt>role</dt>
				<dd>
					<ResourceBoundary
						resource={a2aMessage}
					>
						{#snippet children(entity)}
							{entity.role}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							contextId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const contextId = entity.contextId}
					{#if contextId != null}
						<div>
							<dt>context ID</dt>
							<dd>
								{contextId}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={a2aMessage}
			>
				{#snippet children(entity)}
					{@const createdAt = entity.createdAt}
					{#if createdAt != null}
						<div>
							<dt>Created</dt>
							<dd>
								<Timestamp timestamp={Number(createdAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const a2aMessageA2aMessagePartsViewPartsResource = selection.$$parts}
		<ResourceBoundary
			resource={a2aMessageA2aMessagePartsViewPartsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<A2aMessagePartsView
						selection={a2aMessageA2aMessagePartsViewPartsResource}
						countResource={a2aMessageA2aMessagePartsViewPartsResource.count}
						title='parts'
						id='parts'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>

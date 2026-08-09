<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.A2aTask_Timestamp>, 'prefetched'> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [],
	}))
	const a2aTaskTimestamp = $derived(viewSelection({
		fields: {
			state: true,
			error: true,
		},
	}))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import A2aTaskView from '$/views/A2aTaskView.svelte'
</script>


<EntityView
	entityType={EntityType.A2aTask_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? String(selection.entitySelector.timestampMs)}
	href={
		href === undefined ?
			(
				'taskId' in selection.entitySelector.$task ?
					resolve(
						'/(agents)/agents/a2a/task/[taskId=stringSegment]/(a2aTask)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
						{
							taskId: selection.entitySelector.$task.taskId,
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
		<ResourceBoundary resource={a2aTaskTimestamp}>
			{#snippet children(entity)}
				{(entity.state ?? '') || String(selection.entitySelector.timestampMs)}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={a2aTaskTimestamp}>
			{#snippet children(entity)}
				{@const error = entity.error}
				{#if error != null}
					<span data-text="muted">
						{error}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>task</dt>
				<dd>
					<A2aTaskView
						selection={select(EntityType.A2aTask, selection.entitySelector.$task)}
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
				resource={a2aTaskTimestamp}
			>
				{#snippet children(entity)}
					{@const state = entity.state}
					{#if state != null}
						<div>
							<dt>state</dt>
							<dd>
								{state}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							statusMessage: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const statusMessage = entity.statusMessage}
					{#if statusMessage != null}
						<div>
							<dt>status message</dt>
							<dd>
								{statusMessage}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={a2aTaskTimestamp}
			>
				{#snippet children(entity)}
					{@const error = entity.error}
					{#if error != null}
						<div>
							<dt>error</dt>
							<dd>
								{error}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>

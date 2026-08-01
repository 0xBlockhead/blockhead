<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
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
	}: EntitySelectionViewProps<EntityType.A2aTaskEvent> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [],
	}))
	const a2aTaskEvent = $derived(viewSelection({
		fields: {
			eventKind: true,
			timestampMs: true,
		},
	}))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import A2aTaskView from '$/views/A2aTaskView.svelte'
	import A2aArtifactView from '$/views/A2aArtifactView.svelte'
</script>


<EntityView
	entityType={EntityType.A2aTaskEvent}
	entitySelector={selection.entitySelector}
	title={title ?? String(selection.entitySelector.sequence)}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<ResourceBoundary resource={a2aTaskEvent}>
			{#snippet children(entity)}
				{entity.eventKind || String(selection.entitySelector.sequence)}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={a2aTaskEvent}>
			{#snippet children(entity)}
				{@const timestampMs = entity.timestampMs}
				{#if timestampMs != null}
					<span data-text="muted">
						<Timestamp timestamp={timestampMs} />
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
					/>
				</dd>
			</div>

			<div>
				<dt>sequence</dt>
				<dd>
					{selection.entitySelector.sequence}
				</dd>
			</div>

			<div>
				<dt>event kind</dt>
				<dd>
					<ResourceBoundary
						resource={a2aTaskEvent}
					>
						{#snippet children(entity)}
							{entity.eventKind}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={a2aTaskEvent}
			>
				{#snippet children(entity)}
					{@const timestampMs = entity.timestampMs}
					{#if timestampMs != null}
						<div>
							<dt>Timestamp</dt>
							<dd>
								<Timestamp timestamp={timestampMs} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							state: true,
						},
					})
				}
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
							final: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const final = entity.final}
					{#if final != null}
						<div>
							<dt>final</dt>
							<dd>
								{final ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$artifact}
			>
				{#snippet children(a2aArtifact)}
					{#if a2aArtifact != null}
						<div>
							<dt>artifact</dt>
							<dd>
								<A2aArtifactView
									selection={select(EntityType.A2aArtifact, a2aArtifact[EntityMetaKey.Selector])}
									prefetched={a2aArtifact}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>

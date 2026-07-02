<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
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
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadSession>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.BlockheadSession>>
			title?: string
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'collapsible'
			| 'showTypeAnnotation'
		>
	> = $props()

	const blockheadSession = $derived(selection({
		sources: [
			Source.Local_Internal,
		],
		fields: {
			name: true,
			status: true,
			createdAt: true,
			updatedAt: true,
			...(open && {
				lockedAt: true,
				$latestSimulation: true,
				simulationCount: true,
				$$actions: true,
				$$intentInvocations: true,
				$$simulations: true,
			}),
		},
	}))
	const titleFallback = $derived([String((({ ...selection.entitySelector, ...prefetched }).name) ?? '')].filter(Boolean).join(' ') || [String((selection.entitySelector.id) ?? '')].filter(Boolean).join(' ') || 'session')
	const viewDomId = $derived('blockhead-session-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadSession}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{[String((({ ...selection.entitySelector, ...prefetched }).name) ?? '')].filter(Boolean).join(' ') || title || [String((selection.entitySelector.id) ?? '')].filter(Boolean).join(' ') || 'session'}
		{:else}
			<ResourceBoundary resource={blockheadSession}>
				{#snippet Pending()}
					{[String((({ ...selection.entitySelector, ...prefetched }).name) ?? '')].filter(Boolean).join(' ') || title || [String((selection.entitySelector.id) ?? '')].filter(Boolean).join(' ') || 'session'}
				{/snippet}

				{#snippet children(entity)}
					{[String((entity.name) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{[String((({ ...selection.entitySelector, ...prefetched }).status) ?? '')].filter(Boolean).join(' ') || [String((({ ...selection.entitySelector, ...prefetched }).name) ?? '')].filter(Boolean).join(' ') || title || [String((selection.entitySelector.id) ?? '')].filter(Boolean).join(' ') || 'session'}
		{:else}
			<ResourceBoundary resource={blockheadSession}>
				{#snippet Pending()}
					{[String((({ ...selection.entitySelector, ...prefetched }).status) ?? '')].filter(Boolean).join(' ') || [String((({ ...selection.entitySelector, ...prefetched }).name) ?? '')].filter(Boolean).join(' ') || title || [String((selection.entitySelector.id) ?? '')].filter(Boolean).join(' ') || 'session'}
				{/snippet}

				{#snippet children(entity)}
					{[String((entity.status) ?? '')].filter(Boolean).join(' ') || [String((entity.name) ?? '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const updatedAt0 = prefetched.updatedAt}
			{#if updatedAt0 !== undefined && updatedAt0 !== null}
				<span data-text="muted">
					<Timestamp timestamp={Number(updatedAt0)} />
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={blockheadSession}>
				{#snippet Pending()}
					{@const updatedAt0 = prefetched.updatedAt}
					{#if updatedAt0 !== undefined && updatedAt0 !== null}
						<span data-text="muted">
							<Timestamp timestamp={Number(updatedAt0)} />
						</span>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const updatedAt0 = entity.updatedAt}
					{#if updatedAt0 !== undefined && updatedAt0 !== null}
						<span data-text="muted">
							<Timestamp timestamp={Number(updatedAt0)} />
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Created</dt>
				<dd>
					<ResourceBoundary resource={blockheadSession}>
						{#snippet Pending()}
							{@const createdAt = prefetched.createdAt ?? selection.entitySelector.createdAt}
							{#if createdAt !== undefined && createdAt !== null}
								<Timestamp timestamp={Number(createdAt)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const createdAt = entity.createdAt ?? selection.entitySelector.createdAt ?? prefetched.createdAt}
							{#if createdAt !== undefined && createdAt !== null}
								<Timestamp timestamp={Number(createdAt)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary resource={blockheadSession}>
				{#snippet Pending()}
					{@const lockedAt = prefetched.lockedAt ?? selection.entitySelector.lockedAt}
					{#if lockedAt !== undefined && lockedAt !== null}
						<div>
							<dt>Locked</dt>
							<dd>
								<Timestamp timestamp={Number(lockedAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const lockedAt = entity.lockedAt ?? selection.entitySelector.lockedAt ?? prefetched.lockedAt}
					{#if lockedAt !== undefined && lockedAt !== null}
						<div>
							<dt>Locked</dt>
							<dd>
								<Timestamp timestamp={Number(lockedAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary resource={blockheadSession}>
				{#snippet Pending()}
					{@const simulationCount = prefetched.simulationCount ?? selection.entitySelector.simulationCount}
					{#if simulationCount !== undefined && simulationCount !== null}
						<div>
							<dt>Simulation count</dt>
							<dd>
								{String((simulationCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const simulationCount = entity.simulationCount ?? selection.entitySelector.simulationCount ?? prefetched.simulationCount}
					{#if simulationCount !== undefined && simulationCount !== null}
						<div>
							<dt>Simulation count</dt>
							<dd>
								{String((simulationCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>

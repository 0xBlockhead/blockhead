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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadPanelTree>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.BlockheadPanelTree>>
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

	const blockheadPanelTree = $derived(selection({
		sources: [
			Source.Local_Internal,
		],
	}))
	const titleFallback = $derived([String((({ ...selection.entitySelector, ...prefetched }).id) ?? '')].filter(Boolean).join(' ') || 'dashboard')
	const viewDomId = $derived('blockhead-panel-tree-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadPanelTree}
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
			{@const id0 = ({ ...selection.entitySelector, ...prefetched }).id}
			{#if id0 !== undefined && id0 !== null}
				<TruncatedValue value={String(id0)} />
			{/if}
		{:else}
			<ResourceBoundary resource={blockheadPanelTree}>
				{#snippet Pending()}
					{@const id0 = ({ ...selection.entitySelector, ...prefetched }).id}
					{#if id0 !== undefined && id0 !== null}
						<TruncatedValue value={String(id0)} />
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const id0 = ({ ...selection.entitySelector, ...prefetched, ...entity }).id}
					{#if id0 !== undefined && id0 !== null}
						<TruncatedValue value={String(id0)} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{['Dashboard'].filter(Boolean).join(' ') || [String((({ ...selection.entitySelector, ...prefetched }).id) ?? '')].filter(Boolean).join(' ') || title || 'dashboard'}
		{:else}
			<ResourceBoundary resource={blockheadPanelTree}>
				{#snippet Pending()}
					{['Dashboard'].filter(Boolean).join(' ') || [String((({ ...selection.entitySelector, ...prefetched }).id) ?? '')].filter(Boolean).join(' ') || title || 'dashboard'}
				{/snippet}

				{#snippet children(entity)}
					{['Dashboard'].filter(Boolean).join(' ') || [String((entity.id) ?? '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntityView>

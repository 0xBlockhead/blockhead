<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
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
			selection: EntityProxyResource<typeof schema, EntityType._GlobalEvmAbiCatalog>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType._GlobalEvmAbiCatalog>>
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

	const pendingEntity = $derived(({ ...prefetched[EntityMetaKey.Selector], ...selection.entitySelector, ...prefetched }))
	const globalEvmAbiCatalog = $derived(selection({
		sources: [
			Source.Local_Internal,
		],
	}))
	const titleFallback = $derived('global EVM ABI catalog')
	const viewDomId = $derived('-global-evm-abi-catalog-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import EvmSelectorsView from '$/views/EvmSelectorsView.svelte'
	import EvmTopicsView from '$/views/EvmTopicsView.svelte'
	import EvmErrorsView from '$/views/EvmErrorsView.svelte'
	import GlobalEvmAbiCatalog_TimestampsView from '$/views/_GlobalEvmAbiCatalog_TimestampsView.svelte'
</script>


<EntityView
	entityType={EntityType._GlobalEvmAbiCatalog}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={globalEvmAbiCatalog}>
			{#snippet Pending()}
				{title || 'global EVM ABI catalog'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={globalEvmAbiCatalog}>
			{#snippet Pending()}
				{[String((pendingEntity.scope) ?? '')].filter(Boolean).join(' ') || title || 'global EVM ABI catalog'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.scope) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<CollapsibleTabs
				id={viewDomId + '-carousel-evm-abi-signatures'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'evm-abi-selectors',
							label: 'Selectors',
						},
						{
							id: 'evm-abi-topics',
							label: 'Topics',
						},
						{
							id: 'evm-abi-errors',
							label: 'Errors',
						},
					]
				}
				data-card
				class='network-view-collapsible-signatures'
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({})}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Signatures</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionEvmAbiSelectors({ id, label, open })}
					<EvmSelectorsView
						selection={
							selection.$$observedSelectors({
								sources: [
									Source.Local_Internal,
								],
								count: true,
							})
						}
						href={resolve('/evm/selectors')}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No EVM selectors in this catalog window.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionEvmAbiTopics({ id, label, open })}
					<EvmTopicsView
						selection={
							selection.$$observedTopics({
								sources: [
									Source.Local_Internal,
								],
								count: true,
							})
						}
						href={resolve('/evm/topics')}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No EVM topics in this catalog window.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionEvmAbiErrors({ id, label, open })}
					<EvmErrorsView
						selection={
							selection.$$observedErrors({
								sources: [
									Source.Local_Internal,
								],
								count: true,
							})
						}
						href={resolve('/evm/errors')}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No EVM errors in this catalog window.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>

			<CollapsibleTabs
				id={viewDomId + '-carousel-evm-abi-observations'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'evm-abi-timestamps',
							label: 'Observations',
						},
					]
				}
				data-card
				class='network-view-collapsible-observations'
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({})}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Observations</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionEvmAbiTimestamps({ id, label, open })}
					<GlobalEvmAbiCatalog_TimestampsView
						selection={
							selection.$$timestamps({
								sources: [
									Source.Local_Internal,
								],
								count: true,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No EVM ABI catalog observations.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>
		{/if}
	{/snippet}
</EntityView>

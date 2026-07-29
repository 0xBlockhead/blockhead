<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'


	// State
	let {
		selection,
		prefetched = {},
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType._GlobalEvmAbiCatalog> = $props()

	const titleFallback = 'global EVM ABI catalog'
	const viewDomId = $derived('-global-evm-abi-catalog-' + encodeURIComponent(stringify(selection.entitySelector)))


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
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		global EVM ABI catalog
	{/snippet}

	{#snippet Value()}
		{selection.entitySelector.scope || titleFallback}
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
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
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Signatures</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionEvmAbiSelectors({ id, label, open })}
				<EvmSelectorsView
					selection={selection.$$observedSelectors}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					emptyText='No EVM selectors in this catalog window.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionEvmAbiTopics({ id, label, open })}
				<EvmTopicsView
					selection={selection.$$observedTopics}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					emptyText='No EVM topics in this catalog window.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionEvmAbiErrors({ id, label, open })}
				<EvmErrorsView
					selection={selection.$$observedErrors}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					emptyText='No EVM errors in this catalog window.'
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
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Observations</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionEvmAbiTimestamps({ id, label, open })}
				<GlobalEvmAbiCatalog_TimestampsView
					selection={selection.$$timestamps}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					emptyText='No EVM ABI catalog observations.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>

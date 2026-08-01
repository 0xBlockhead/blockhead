<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'


	// State
	let {
		selection,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType._GlobalEvmAbiCatalog>, 'prefetched'> = $props()

	const viewDomId = $derived('-global-evm-abi-catalog-' + encodeURIComponent(stringify(selection.entitySelector)))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import EvmSelectorsView from '$/views/EvmSelectorsView.svelte'
	import EvmTopicsView from '$/views/EvmTopicsView.svelte'
	import EvmErrorsView from '$/views/EvmErrorsView.svelte'
	import GlobalEvmAbiCatalog_TimestampsView from '$/views/_GlobalEvmAbiCatalog_TimestampsView.svelte'
</script>


<EntityView
	entityType={EntityType._GlobalEvmAbiCatalog}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		{selection.entitySelector.scope}
	{/snippet}

	{#snippet Details()}
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

			{#snippet SectionEvmAbiSelectors({ id, label })}
				<EvmSelectorsView
					selection={selection.$$observedSelectors}
					collapsible={false}
					title={label}
					emptyText='No EVM selectors in this catalog window.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionEvmAbiTopics({ id, label })}
				<EvmTopicsView
					selection={selection.$$observedTopics}
					collapsible={false}
					title={label}
					emptyText='No EVM topics in this catalog window.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionEvmAbiErrors({ id, label })}
				<EvmErrorsView
					selection={selection.$$observedErrors}
					collapsible={false}
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

			{#snippet SectionEvmAbiTimestamps({ id, label })}
				<GlobalEvmAbiCatalog_TimestampsView
					selection={selection.$$timestamps}
					collapsible={false}
					title={label}
					emptyText='No EVM ABI catalog observations.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>

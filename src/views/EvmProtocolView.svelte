<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'
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
	}: EntitySelectionViewProps<EntityType.EvmProtocol> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Constants_Internal,
		],
	}))
	const evmProtocol = $derived(viewSelection({
		fields: {
			protocolName: true,
			registryName: true,
			relationshipModel: true,
		},
	}))
	const titleFallback = $derived((prefetched.protocolName ?? '') || 'EVM protocol')
	const viewDomId = $derived('evm-protocol-' + encodeURIComponent(stringify(selection.entitySelector)))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import EvmSelectorsView from '$/views/EvmSelectorsView.svelte'
	import EvmTopicsView from '$/views/EvmTopicsView.svelte'
	import EvmErrorsView from '$/views/EvmErrorsView.svelte'
</script>


<EntityView
	entityType={EntityType.EvmProtocol}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			(
				selection.entitySelector.scope === 'EvmProtocol' ?
					resolve('/(explore)/(protocols)/evm')
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
		<ResourceBoundary resource={evmProtocol}>
			{#snippet children(entity)}
				{entity.protocolName || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={evmProtocol}>
			{#snippet children(entity)}
				{entity.registryName || entity.protocolName || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Protocol name</dt>
				<dd>
					<ResourceBoundary
						resource={evmProtocol}
					>
						{#snippet children(entity)}
							{entity.protocolName}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Registry name name</dt>
				<dd>
					<ResourceBoundary
						resource={evmProtocol}
					>
						{#snippet children(entity)}
							{entity.registryName}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Connection model</dt>
				<dd>
					<ResourceBoundary
						resource={evmProtocol}
					>
						{#snippet children(entity)}
							{entity.relationshipModel}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Home URL</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									homeUrl: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<a
								href={entity.homeUrl}
								target="_blank"
								rel="noreferrer noopener"
							>
								<TruncatedValue value={entity.homeUrl} />
							</a>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							docsUrl: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const docsUrl = entity.docsUrl}
					{#if docsUrl != null}
						<div>
							<dt>Docs URL</dt>
							<dd>
								<a
									href={docsUrl}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={docsUrl} />
								</a>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details()}
		<CollapsibleTabs
			id={viewDomId + '-carousel-evm-protocol-signatures'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'evm-protocol-selectors',
						label: 'Selectors',
					},
					{
						id: 'evm-protocol-topics',
						label: 'Topics',
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

			{#snippet SectionEvmProtocolSelectors({ id, label, open })}
				<EvmSelectorsView
					selection={selection.$$evmSelectors}
					href={
						selection.entitySelector.scope === 'EvmProtocol' ?
							resolve('/(explore)/(protocols)/evm/(evmProtocol)/(selectors)/selectors')
						:
							undefined
					}
					collapsible={false}
					title={label}
					emptyText='No EVM selectors in this observed.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionEvmProtocolTopics({ id, label, open })}
				<EvmTopicsView
					selection={selection.$$evmTopics}
					href={
						selection.entitySelector.scope === 'EvmProtocol' ?
							resolve('/(explore)/(protocols)/evm/(evmProtocol)/(topics)/topics')
						:
							undefined
					}
					collapsible={false}
					title={label}
					emptyText='No EVM topics in this observed.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>

		<CollapsibleTabs
			id={viewDomId + '-carousel-evm-protocol-errors'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'evm-protocol-error-list',
						label: 'Errors',
					},
				]
			}
			data-card
			class='network-view-collapsible-errors'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Errors</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionEvmProtocolErrorList({ id, label, open })}
				<EvmErrorsView
					selection={selection.$$evmErrors}
					href={
						selection.entitySelector.scope === 'EvmProtocol' ?
							resolve('/(explore)/(protocols)/evm/(evmProtocol)/(errors)/errors')
						:
							undefined
					}
					collapsible={false}
					title={label}
					emptyText='No EVM errors in this observed.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>

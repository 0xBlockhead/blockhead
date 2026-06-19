<script lang="ts">
	// Types/constants
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import { stringify } from 'devalue'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { resolve } from '$app/paths'


	// State
	let {
		selection,
		href = resolve('/evm'),
		open = $bindable(true),
		collapsible = true,
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.EvmProtocol>
			href?: string
			open?: boolean
			collapsible?: boolean
		},
		never
	> = $props()


	const protocol = $derived(selection({
			sources: [
				Source.Constants_Internal,
				Source.Local_Internal,
			],
		},
	))
	
	
	
	
	
	const evmTopics = $derived(protocol.$$evmTopics({ limit: 4096 }))
	const evmSelectors = $derived(protocol.$$evmSelectors)
	const evmErrors = $derived(protocol.$$evmErrors)


	const entityViewDetailCarouselScrollProps = {
		'data-row': 'start align-start',
		style: '--carousel-basis: 40ch',
	} as const


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import EvmErrorsView from '$/views/EvmErrorsView.svelte'
	import EvmSelectorsView from '$/views/EvmSelectorsView.svelte'
	import EvmTopicsView from '$/views/EvmTopicsView.svelte'
</script>


<EntityView
	entityType={EntityType.EvmProtocol}
	entitySelector={selection.entitySelector}
	href={href}
	bind:open
	{collapsible}
	{...EntityViewProps}
	title="EVM"
>
	{#snippet Value()}
		{selection.entitySelector.scope}
	{/snippet}

	{#snippet Title()}
		EVM
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			EVM catalogs index log topics, four-byte function selectors, and revert error selectors from the local OpenChain-style directory.
		</p>
		<p>
			Row detail resolves live signatures via OpenChain; calldata decoding is available on a separate route.
		</p>
	{/snippet}

	{#snippet Content({})}
		<dl data-column-item="center">
			<ResourceBoundary resource={protocol.registryLabel} placeholderText="Loading EVM registry…">
				{#snippet children(registryLabel)}
					{#if registryLabel}
						<div><dt>Registry</dt><dd>{registryLabel}</dd></div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={protocol.protocolName} placeholderText="Loading EVM protocol…">
				{#snippet children(protocolName)}
					{#if protocolName}
						<div><dt>Protocol</dt><dd>{protocolName}</dd></div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			{#if open}
				<ResourceBoundary resource={evmTopics} placeholderText="Loading topics…">
					{#snippet children(evmTopics)}
						<div><dt>Topics</dt><dd>{String(evmTopics.values.length)}</dd></div>
					{/snippet}
				</ResourceBoundary>

				<ResourceBoundary resource={evmSelectors} placeholderText="Loading selectors…">
					{#snippet children(evmSelectors)}
						<div><dt>Selectors</dt><dd>{String(evmSelectors.values.length)}</dd></div>
					{/snippet}
				</ResourceBoundary>

				<ResourceBoundary resource={evmErrors} placeholderText="Loading errors…">
					{#snippet children(evmErrors)}
						<div><dt>Errors</dt><dd>{String(evmErrors.values.length)}</dd></div>
					{/snippet}
				</ResourceBoundary>

				<ResourceBoundary resource={protocol.homeUrl} placeholderText="Loading home URL…">
					{#snippet children(homeUrl)}
						{#if homeUrl}
							<div><dt>Home</dt><dd>{homeUrl}</dd></div>
						{/if}
					{/snippet}
				</ResourceBoundary>

				<ResourceBoundary resource={protocol.docsUrl} placeholderText="Loading docs URL…">
					{#snippet children(docsUrl)}
						{#if docsUrl}
							<div><dt>Docs</dt><dd>{docsUrl}</dd></div>
						{/if}
					{/snippet}
				</ResourceBoundary>

				<ResourceBoundary resource={protocol.topology} placeholderText="Loading topology…">
					{#snippet children(topology)}
						{#if topology}
							<div><dt>Topology</dt><dd>{topology}</dd></div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}
		</dl>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		{@const protocolSelectorKey = stringify(selection.entitySelector)}
		<CollapsibleTabs
			sectionIdPrefix={protocolSelectorKey}
			sections={[
				{ id: 'topics', label: 'Topics' },
				{ id: 'selectors', label: 'Selectors' },
				{ id: 'errors', label: 'Errors' },
			]}
			id={`${protocolSelectorKey}:catalogs`}
			data-card
			scrollContainerProps={entityViewDetailCarouselScrollProps}
		>
			{#snippet Summary({ open: _summaryOpen })}
				<header
					data-row-item="flexible"
					data-row="wrap gap-4"
				>
					<HeadingComponent>
						EVM catalogs
					</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionTopics({ id: _topicsId, label: _topicsLabel })}
				<EvmTopicsView
					CollapsibleProps={{ canToggle: false }}
					href={resolve('/evm/topics')}
					selection={selection.$$evmTopics}
					id={`${protocolSelectorKey}:topics`}
					open={true}
				/>
			{/snippet}

			{#snippet SectionSelectors({ id: _selectorsId, label: _selectorsLabel })}
				<EvmSelectorsView
					CollapsibleProps={{ canToggle: false }}
					href={resolve('/evm/selectors')}
					selection={selection.$$evmSelectors}
					id={`${protocolSelectorKey}:selectors`}
					open={true}
				/>
			{/snippet}

			{#snippet SectionErrors({ id: _errorsId, label: _errorsLabel })}
				<EvmErrorsView
					CollapsibleProps={{ canToggle: false }}
					href={resolve('/evm/errors')}
					selection={selection.$$evmErrors}
					id={`${protocolSelectorKey}:errors`}
					open={true}
				/>
			{/snippet}
	</CollapsibleTabs>

		<CollapsibleTabs
			sectionIdPrefix={protocolSelectorKey}
			sections={[
				{ id: 'decoder', label: 'Decoder' },
			]}
			id={`${protocolSelectorKey}:tools`}
			data-card
			scrollContainerProps={entityViewDetailCarouselScrollProps}
		>
			{#snippet Summary({ open: _summaryOpen })}
				<header
					data-row-item="flexible"
					data-row="wrap gap-4"
				>
					<HeadingComponent>
						Tools
					</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionDecoder({ id: _decoderId, label: _decoderLabel })}
				<div data-card data-column>
					<header data-row="wrap align-center gap-2">
						<HeadingComponent>
							Calldata decoder
						</HeadingComponent>
					</header>
					<p>
						Paste transaction input or event log hex to resolve selectors and topics via OpenChain, then decode ABI arguments.
					</p>
					<a href={resolve('/evm/calldata-decoder')}>
						Open calldata decoder
					</a>
				</div>
			{/snippet}
	</CollapsibleTabs>

	{/snippet}
</EntityView>

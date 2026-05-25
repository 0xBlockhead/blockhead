<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import { stringify } from 'devalue'


	// Context
	import { resolve } from '$app/paths'


	// Props
	let {
		entityId,
		href = resolve(
			'/evm',
			entityId,
		),
					open = $bindable(true),
		collapsible = true,
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.EvmProtocol>
			href?: string
			open?: boolean
		},
		never
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const protocol = useEntity(
		EntityType.EvmProtocol,
		entityId,
		{
			$: [
				Source.Constants_Internal,
				Source.Local_Internal,
			],
			protocolName: {},
			registryLabel: {},
			...(open ?
				{
					homeUrl: {},
					docsUrl: {},
					topology: {},
					$$evmTopics: {},
					$$evmSelectors: {},
					$$evmErrors: {},
				}
			:
				{}),
		},
	)

	const entityViewDetailCarouselScrollProps = {
		'data-row': 'start align-start',
		style: '--carousel-basis: 40ch',
	} as const


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import EvmErrorsView from '$/views/EvmErrorsView.svelte'
	import EvmSelectorsView from '$/views/EvmSelectorsView.svelte'
	import EvmTopicsView from '$/views/EvmTopicsView.svelte'
</script>


<EntityView
	entityType={EntityType.EvmProtocol}
	{entityId}
	href={href}
	bind:open
	{collapsible}
	{...EntityViewProps}
	title="EVM"
>
	{#snippet Value()}
		{entityId.scope}
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

	{#snippet Content({ title: _title, href: _href })}
		<dl data-column-item="center">
			<ResourceBoundary
				resource={protocol}
				placeholderText="Loading EVM protocol…"
			>
				{#snippet children(loadedProtocol)}
					{#if loadedProtocol.registryLabel}
						<div>
							<dt>Registry</dt>
							<dd>{loadedProtocol.registryLabel}</dd>
						</div>
					{:else if loadedProtocol.protocolName}
						<div>
							<dt>Protocol</dt>
							<dd>{loadedProtocol.protocolName}</dd>
						</div>
					{/if}

					{#if open}
						<div>
							<dt>Topics</dt>
							<dd>{String(protocol.$$evmTopics?.length ?? 0)}</dd>
						</div>
						<div>
							<dt>Selectors</dt>
							<dd>{String(protocol.$$evmSelectors?.length ?? 0)}</dd>
						</div>
						<div>
							<dt>Errors</dt>
							<dd>{String(protocol.$$evmErrors?.length ?? 0)}</dd>
						</div>

						{#if loadedProtocol.homeUrl}
							<div>
								<dt>Home</dt>
								<dd>
									<a href={loadedProtocol.homeUrl}>{loadedProtocol.homeUrl}</a>
								</dd>
							</div>
						{/if}

						{#if loadedProtocol.docsUrl}
							<div>
								<dt>Docs</dt>
								<dd>
									<a href={loadedProtocol.docsUrl}>{loadedProtocol.docsUrl}</a>
								</dd>
							</div>
						{/if}

						{#if loadedProtocol.topology}
							<div>
								<dt>Topology</dt>
								<dd>{loadedProtocol.topology}</dd>
							</div>
						{/if}
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		{@const protocolIdKey = stringify(entityId)}
		<EntityDetails
			entityType={EntityType.EvmProtocol}
			{entityId}
		/>
		<div
			class="entity-view-detail-carousels"
			data-column="gap-3"
		>
			<CollapsibleTabs
				id={`${protocolIdKey}:catalogs`}
				{...{ 'data-card': '' }}
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

				{#snippet Markers({ open: _markersOpen })}
					<a
						data-scroll-marker-label="Topics"
						href={`#${protocolIdKey}:topics`}
					>Topics</a>
					<a
						data-scroll-marker-label="Selectors"
						href={`#${protocolIdKey}:selectors`}
					>Selectors</a>
					<a
						data-scroll-marker-label="Errors"
						href={`#${protocolIdKey}:errors`}
					>Errors</a>
				{/snippet}

				{#snippet body({ open: _sectionOpen })}
					<section
						id={`${protocolIdKey}:topics`}
						data-scroll-marker-label="Topics"
					>
						<EvmTopicsView
							href={resolve('/evm/topics')}
							entityFieldReference={{
								entityType: EntityType.EvmProtocol,
								entityId,
								fieldName: '$$evmTopics',
							}}
							id={`${protocolIdKey}:topics`}
							open={_sectionOpen}
						/>
					</section>

					<section
						id={`${protocolIdKey}:selectors`}
						data-scroll-marker-label="Selectors"
					>
						<EvmSelectorsView
							href={resolve('/evm/selectors')}
							entityFieldReference={{
								entityType: EntityType.EvmProtocol,
								entityId,
								fieldName: '$$evmSelectors',
							}}
							id={`${protocolIdKey}:selectors`}
							open={_sectionOpen}
						/>
					</section>

					<section
						id={`${protocolIdKey}:errors`}
						data-scroll-marker-label="Errors"
					>
						<EvmErrorsView
							href={resolve('/evm/errors')}
							entityFieldReference={{
								entityType: EntityType.EvmProtocol,
								entityId,
								fieldName: '$$evmErrors',
							}}
							id={`${protocolIdKey}:errors`}
							open={_sectionOpen}
						/>
					</section>
				{/snippet}
			</CollapsibleTabs>

			<CollapsibleTabs
				id={`${protocolIdKey}:tools`}
				{...{ 'data-card': '' }}
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

				{#snippet Markers({ open: _markersOpen })}
					<a
						data-scroll-marker-label="Decoder"
						href={`#${protocolIdKey}:decoder`}
					>Decoder</a>
				{/snippet}

				{#snippet body({ open: _sectionOpen })}
					<section
						id={`${protocolIdKey}:decoder`}
						data-scroll-marker-label="Decoder"
						data-card
						data-column
					>
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
					</section>
				{/snippet}
			</CollapsibleTabs>
		</div>

	{/snippet}
</EntityView>

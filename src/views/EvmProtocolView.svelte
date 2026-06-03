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
	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { resolve } from '$app/paths'


	// State
	let {
		entityId,
		href = resolve('/evm'),
		open = $bindable(true),
		collapsible = true,
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.EvmProtocol>
			href?: string
			open?: boolean
			collapsible?: boolean
		},
		never
	> = $props()

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

	{#snippet Content({})}
		<dl data-column-item="center">
			<ResourceBoundary
				resource={protocol}
				placeholderText="Loading EVM protocol…"
			>
				{#snippet children(protocol)}
					{#if protocol.registryLabel}
						<div>
							<dt>Registry</dt>
							<dd>{protocol.registryLabel}</dd>
						</div>
					{:else if protocol.protocolName}
						<div>
							<dt>Protocol</dt>
							<dd>{protocol.protocolName}</dd>
						</div>
					{/if}

					{#if open}
						<div>
							<dt>Topics</dt>
							<dd>{String(protocol.$$evmTopics?.length ?? 0)}</dd>
						</div>
					{/if}

					{#if open}
						<div>
							<dt>Selectors</dt>
							<dd>{String(protocol.$$evmSelectors?.length ?? 0)}</dd>
						</div>
					{/if}

					{#if open}
						<div>
							<dt>Errors</dt>
							<dd>{String(protocol.$$evmErrors?.length ?? 0)}</dd>
						</div>
					{/if}

					{#if open && protocol.homeUrl}
						<div>
							<dt>Home</dt>
							<dd>
								<a href={protocol.homeUrl}>{protocol.homeUrl}</a>
							</dd>
						</div>
					{/if}

					{#if open && protocol.docsUrl}
						<div>
							<dt>Docs</dt>
							<dd>
								<a href={protocol.docsUrl}>{protocol.docsUrl}</a>
							</dd>
						</div>
					{/if}

					{#if open && protocol.topology}
						<div>
							<dt>Topology</dt>
							<dd>{protocol.topology}</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		{@const protocolIdKey = stringify(entityId)}
		<CollapsibleTabs
			sectionIdPrefix={protocolIdKey}
			sections={[
				{ id: 'topics', label: 'Topics' },
				{ id: 'selectors', label: 'Selectors' },
				{ id: 'errors', label: 'Errors' },
			]}
			id={`${protocolIdKey}:catalogs`}
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
					entityFieldReference={{
						entityType: EntityType.EvmProtocol,
						entityId,
						fieldName: '$$evmTopics',
					}}
					id={`${protocolIdKey}:topics`}
					open={true}
				/>
			{/snippet}

			{#snippet SectionSelectors({ id: _selectorsId, label: _selectorsLabel })}
				<EvmSelectorsView
					CollapsibleProps={{ canToggle: false }}
					href={resolve('/evm/selectors')}
					entityFieldReference={{
						entityType: EntityType.EvmProtocol,
						entityId,
						fieldName: '$$evmSelectors',
					}}
					id={`${protocolIdKey}:selectors`}
					open={true}
				/>
			{/snippet}

			{#snippet SectionErrors({ id: _errorsId, label: _errorsLabel })}
				<EvmErrorsView
					CollapsibleProps={{ canToggle: false }}
					href={resolve('/evm/errors')}
					entityFieldReference={{
						entityType: EntityType.EvmProtocol,
						entityId,
						fieldName: '$$evmErrors',
					}}
					id={`${protocolIdKey}:errors`}
					open={true}
				/>
			{/snippet}
	</CollapsibleTabs>

		<CollapsibleTabs
			sectionIdPrefix={protocolIdKey}
			sections={[
				{ id: 'decoder', label: 'Decoder' },
			]}
			id={`${protocolIdKey}:tools`}
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

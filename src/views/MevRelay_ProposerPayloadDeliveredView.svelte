<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
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
		'/(explore)/(networks)/network/[networkId]',
		{ networkId: String(entityId.$network.chainId) },
	),
		layout,
		open = $bindable(true),
		collapsible = true,
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.MevRelay_ProposerPayloadDelivered>
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'href'
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const mevRelayProposerPayloadDelivered = useEntity(
		EntityType.MevRelay_ProposerPayloadDelivered,
		entityId,
		{
			$: [Source.MevRelay_Rest],
			builderPubkey: {},
			value: {},
			blockNumber: {},
			...(open && {
				$executionBlock: {},
			}),
		},
	)


	// (Derived)
	const payloadIdKey = $derived(
		stringify(entityId),
	)


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import Heading from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Tooltip from '$/components/Tooltip.svelte'
	import EvmBlockView from '$/views/EvmBlockView.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.MevRelay_ProposerPayloadDelivered}
	{entityId}
	href={href}
	{layout}
	bind:open
	title={`Slot ${String(entityId.slot)}`}
	{...EntityViewProps}
>
	{#snippet Value()}
		<span>
			{entityId.slot}
		</span>
	{/snippet}

	{#snippet Heading()}

		<span>
			{entityId.slot}
		</span>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			MEV-Boost-style relays intermediate auctions between block builders and proposing validators; published traces record which builder execution payload won a given consensus slot.
		</p>
		<p>
			Relay schemas vary: some include the accepted EL block hash or height with the bid, others list only bid value and builder pubkey until cross-linked elsewhere.
		</p>
	{/snippet}

	{#snippet Title()}
		<span>
			{entityId.relayHost}
		</span>
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<dl data-column-item="center">
			{#if loadedMevRelayProposerPayloadDelivered.value !== undefined}
				<div>
					<dt>Delivered bid value (wei)</dt>
					<dd>
						<ResourceBoundary
							placeholderText="Loading builder bid…"
							resource={mevRelayProposerPayloadDelivered}
						>
							{#snippet children(loadedMevRelayProposerPayloadDelivered)}
								<NumberValue value={loadedMevRelayProposerPayloadDelivered.value} />
								wei
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if loadedMevRelayProposerPayloadDelivered.builderPubkey !== undefined}
				<div>
					<dt>Builder pubkey</dt>
					<dd>
						<ResourceBoundary
							placeholderText="Loading builder bid…"
							resource={mevRelayProposerPayloadDelivered}
						>
							{#snippet children(loadedMevRelayProposerPayloadDelivered)}
								<TruncatedValue
									format={TruncatedValueFormat.Abbr}
									startLength={10}
									endLength={8}
									value={loadedMevRelayProposerPayloadDelivered.builderPubkey}
								/>
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if (
				mevRelayProposerPayloadDelivered.value === undefined
				&& mevRelayProposerPayloadDelivered.builderPubkey === undefined
			)}
				<div>
					<dt>Builder bid</dt>
					<dd>
						<ResourceBoundary
							placeholderText="Loading builder bid…"
							resource={mevRelayProposerPayloadDelivered}
						>
							{#snippet children(_readyData)}
								<p data-text="muted">
									No bid / builder pubkey fields yet.
								</p>
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}
		</dl>
	{/snippet}

	{#snippet Details({ open: _detailsOpen })}
		<EntityDetails
			entityType={EntityType.MevRelay_ProposerPayloadDelivered}
			{entityId}
		/>
		<div
			class="entity-view-detail-carousels"
			data-column="gap-3"
			data-carousel-basis="40ch"
		>
			<CollapsibleTabs
				id={`${payloadIdKey}:carousel-payload`}
				{...{ 'data-card': '' }}
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({
					open: _isOpen,
				})}
					<header
						data-row-item="flexible"
						data-row="wrap gap-4"
					>
						<Heading>
							Block
						</Heading>
						<Tooltip contentProps={{ side: 'top' }}>
							{#snippet Content()}
								<p>
									The execution block ties the winning relay bid to a specific EL block header the builder committed for that validator duty.
								</p>
								<p>
									When the trace omits that linkage, only bid-side fields (value, builder identity) are available until matched out of band.
								</p>
							{/snippet}
							<abbr
								class="entity-heading-tip"
								aria-label="Execution block notes"
							>ⓘ</abbr>
						</Tooltip>
					</header>
				{/snippet}

				{#snippet Markers({ open: _markersOpen })}
					<a
						data-scroll-marker-label="Block"
						href={`#${payloadIdKey}:mev-included-block`}
					>Block</a>
				{/snippet}

				{#snippet body({ open: _bodyOpen })}
					<section
						data-scroll-marker-label="Block"
						id={`${payloadIdKey}:mev-included-block`}
					>
						<ResourceBoundary
							resource={mevRelayProposerPayloadDelivered}
							placeholderText="Loading block…"
						>
							{#snippet children(loadedMevRelayProposerPayloadDelivered)}
								{#if (
									open
									&& mevRelayProposerPayloadDelivered.$executionBlock !== undefined
								)}
									<EvmBlockView
									entityId={loadedMevRelayProposerPayloadDelivered.$executionBlock[EntityMetaKey.Id]}
									id={`${String(entityId.$network.chainId)}:${String(mevRelayProposerPayloadDelivered.$executionBlock[EntityMetaKey.Id].blockNumber)}:mev-exec-block`}
									layout={EntityLayout.Summary}
									/>
								{:else if open}
									<div data-row="wrap align-center gap-2">
									<mevRelayProposerPayloadDelivered data-text="muted">
									No execution block linked yet.
									</mevRelayProposerPayloadDelivered>
									<Tooltip contentProps={{ side: 'top' }}>
									{#snippet Content()}
									<mevRelayProposerPayloadDelivered>Resolving the included EL header for a proposer-delivered (MEV-Boost) payload can lag until the relay or indexers tie bid metadata to an execution block.</mevRelayProposerPayloadDelivered>
									{/snippet}
									<abbr
									class="entity-heading-tip"
									aria-label="Execution block resolution"
									>ⓘ</abbr>
									</Tooltip>
									</div>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</section>
				{/snippet}
			</CollapsibleTabs>
		</div>

	{/snippet}
</EntityView>


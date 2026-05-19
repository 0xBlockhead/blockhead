<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'


	// Context
	import { resolve } from '$app/paths'


	// Props
	let {
		children,
		entityId,
		href,
		layout,
		open = $bindable(true),
		...entityViewRest
	}: WithRest<
		{
			children?: Snippet
			entityId: EntityId<typeof schema, EntityType.MevRelay_ProposerPayloadDelivered>
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Omit<
			ComponentProps<typeof EntityView>,
			| 'entityType'
			| 'entityId'
			| 'href'
			| 'layout'
			| 'open'
			| 'title'
			| 'Details'
			| 'TypeAnnotationTooltip'
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const payloadIdKey = $derived(
		stringify(entityId),
	)

	const payloadLive = useEntity(
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


	const defaultHref = resolve(
		'/(explore)/(networks)/network/[networkId]',
		{ networkId: String(entityId.$network.chainId) },
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
	href={href ?? defaultHref}
	{layout}
	bind:open
	title={`Slot ${String(entityId.slot)}`}
	{...entityViewRest}
>
	{#snippet Heading()}

		<span data-text="font-monospace">
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

	{#snippet Id()}
		<span data-text="font-monospace">
			{entityId.relayHost}
		</span>
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<ResourceBoundary
			placeholderText="Loading builder bid…"
			resource={payloadLive}
		>
			{#snippet children(p)}
				{#if p.value !== undefined || p.builderPubkey !== undefined}
					<dl data-column-item="center">
						{#if p.value !== undefined}
							<div>
								<dt>Delivered bid value (wei)</dt>
								<dd>
									<NumberValue value={p.value} /> wei
								</dd>
							</div>
						{/if}

						{#if p.builderPubkey !== undefined}
							<div>
								<dt>Builder pubkey</dt>
								<dd>
									<TruncatedValue
										format={TruncatedValueFormat.Abbr}
										startLength={10}
										endLength={8}
										value={p.builderPubkey}
									/>
								</dd>
							</div>
						{/if}
					</dl>
				{:else}
					<p data-text="muted">
						No bid / builder pubkey fields loaded yet.
					</p>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details()}
		<EntityDetails
			entityType={EntityType.MevRelay_ProposerPayloadDelivered}
			{entityId}
		/>

		<div
			class="entity-view-detail-carousels"
			data-column="gap-3"
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

				{#snippet Markers()}
					<a
						data-scroll-marker-label="Block"
						href={`#${payloadIdKey}:mev-included-block`}
					>Block</a>
				{/snippet}

				{#snippet children(_ctx)}
					<section
						data-scroll-marker-label="Block"
						id={`${payloadIdKey}:mev-included-block`}
					>
						<ResourceBoundary
							resource={payloadLive}
							placeholderText="Loading block…"
						>
							{#snippet children(p)}
								{#if open}
									{#if p.$executionBlock !== undefined}
										<EvmBlockView
											entityId={p.$executionBlock[EntityMetaKey.Id]}
											href={resolve(
												'/(explore)/(networks)/network/[networkId]/(network)/(blocks)/block/[blockNumber]',
												{
													networkId: String(entityId.$network.chainId),
													blockNumber: String(p.$executionBlock[EntityMetaKey.Id].blockNumber),
												},
											)}
											id={`${String(entityId.$network.chainId)}:${String(p.$executionBlock[EntityMetaKey.Id].blockNumber)}:mev-exec-block`}
											layout={EntityLayout.Summary}
											open={false}
										/>
									{:else}
										<div data-row="wrap align-center gap-2">
											<p data-text="muted">
												No execution block linked yet.
											</p>
											<Tooltip contentProps={{ side: 'top' }}>
												{#snippet Content()}
													<p>Resolving the included EL header for a proposer-delivered (MEV-Boost) payload can lag until the relay or indexers tie bid metadata to an execution block.</p>
												{/snippet}
												<abbr
													class="entity-heading-tip"
													aria-label="Execution block resolution"
												>ⓘ</abbr>
											</Tooltip>
										</div>
									{/if}
								{/if}
							{/snippet}
						</ResourceBoundary>
					</section>
				{/snippet}
			</CollapsibleTabs>
		</div>

		{#if children}
			{@render children()}
		{/if}
	{/snippet}
</EntityView>


<style>
	.entity-view-detail-carousels :global(.collapsible-tabs-scroll[data-scroll-container]) {
		&[data-scroll-container] {
			--scrollContainer-sizeBlock: calc(80cqb - 6rem);
			max-block-size: var(--scrollContainer-sizeBlock);

			&[data-scroll-container~='layout-carousel'] {
				--carousel-basis: 40ch;
			}
		}
	}
</style>

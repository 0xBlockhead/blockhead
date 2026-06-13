<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import { stringify } from 'devalue'


	// Context
	import { resolve } from '$app/paths'
	import { subscribe } from '$/routes/+layout.svelte'


	// State
	let {
		entityId,
		href = resolve('/(explore)/(networks)/network/[caip2Namespace=caip2Namespace]:[caip2Reference=caip2Reference]', {
			caip2Namespace: entityId.$network.caip2.namespace,
			caip2Reference: entityId.$network.caip2.reference,
		}),
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
			collapsible?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'showTypeAnnotation'
		>
	> = $props()

	const mevRelayProposerPayloadDelivered = subscribe(EntityType.MevRelay_ProposerPayloadDelivered,
		entityId,
		({ sources: [Source.MevRelay_Rest], fields: { builderPubkey: true, value: true, blockNumber: true, ...(open && ({ $executionBlock: true })) } }),
	)


	// (Derived)
	const payloadIdKey = $derived(
		stringify(entityId),
	)


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
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

	{#snippet Title()}
		<span>
			{entityId.slot}
		</span>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			MEV-Boost-style relays intermediate auctions between block builders and proposing validators; published traces record which builder execution payload won a given consensus slot.
		</p>
		<p>
			Relay schemas vary: some include the accepted EL block hash or height with the bid, others deliveredPayloads only bid value and builder pubkey until cross-linked elsewhere.
		</p>
	{/snippet}

	{#snippet Content({})}
		<ResourceBoundary
			placeholderText="Loading builder bid…"
			resource={mevRelayProposerPayloadDelivered}
		>
			{#snippet children(mevRelayProposerPayloadDelivered)}
				<dl data-column-item="center">
					{#if mevRelayProposerPayloadDelivered.fields.value !== undefined}
						<div>
							<dt>Value</dt>
							<dd>
								<NumberValue value={mevRelayProposerPayloadDelivered.fields.value} />
								wei
							</dd>
						</div>
					{/if}

					{#if mevRelayProposerPayloadDelivered.fields.builderPubkey !== undefined}
						<div>
							<dt>Builder pubkey</dt>
							<dd>
								<TruncatedValue
									format={TruncatedValueFormat.Abbr}
									startLength={10}
									endLength={8}
									value={mevRelayProposerPayloadDelivered.fields.builderPubkey}
								/>
							</dd>
						</div>
					{/if}

					{#if (
						mevRelayProposerPayloadDelivered.fields.value === undefined
						&& mevRelayProposerPayloadDelivered.fields.builderPubkey === undefined
					)}
						<div>
							<dt>Builder bid</dt>
							<dd>
								<p data-text="muted">
									No bid / builder pubkey fields yet.
								</p>
							</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details({ open })}
		<CollapsibleTabs
			id={`${payloadIdKey}:carousel-payload`}
			sectionIdPrefix={payloadIdKey}
			sections={[
				{ id: 'mev-included-block', label: 'Block' },
				] as const}
				data-card
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

				{#snippet SectionMevIncludedBlock()}
					<ResourceBoundary
						resource={mevRelayProposerPayloadDelivered}
						placeholderText="Loading block…"
					>
						{#snippet children(mevRelayProposerPayloadDelivered)}
							{#if (
								open
								&& mevRelayProposerPayloadDelivered.fields.$executionBlock !== undefined
							)}
								<EvmBlockView
									entityId={mevRelayProposerPayloadDelivered.fields.$executionBlock[EntityMetaKey.Id]}
									layout={EntityLayout.Summary}
								/>
							{:else if open}
								<div data-row="wrap align-center gap-2">
									<p data-text="muted">
										No execution block linked yet.
									</p>
									<Tooltip contentProps={{ side: 'top' }}>
										{#snippet Content()}
											<p>
												Resolving the included EL header for a proposer-delivered (MEV-Boost) payload can lag until the relay or indexers tie bid metadata to an execution block.
											</p>
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
			{/snippet}
		</CollapsibleTabs>

	{/snippet}
</EntityView>

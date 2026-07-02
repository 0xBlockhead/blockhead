<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityProxyField } from '$/client/$proxy.svelte.ts'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { ZeroExHex } from '$/schema/ZeroExHex.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


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
			selection: EntityProxyResource<typeof schema, EntityType.MevRelay_ProposerPayloadDelivered>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.MevRelay_ProposerPayloadDelivered>>
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

	const mevRelayProposerPayloadDelivered = $derived(selection({
		fields: {
			value: true,
			$builder: true,
			blockNumber: true,
			builderPubkey: true,
			$executionBlock: true,
		},
	}))
	const titleFallback = $derived(['Slot ' + String((({ ...selection.entitySelector, ...prefetched }).slot) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).value) ?? '') + ' wei'].filter(Boolean).join(' ') || 'MEV relay proposer payload delivered')
	const viewDomId = $derived('mev-relay-proposer-payload-delivered-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import EvmBlockView from '$/views/EvmBlockView.svelte'
	import EvmNetworkView from '$/views/EvmNetworkView.svelte'
	import MevBuilderView from '$/views/MevBuilderView.svelte'
</script>


<EntityView
	entityType={EntityType.MevRelay_ProposerPayloadDelivered}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/mev/payload/[relayHost]/[slot=nonNegativeInteger]/[blockHash]', {
			caip2: `${String(({ ...selection.entitySelector, ...prefetched }).$network.caip2.namespace)}:${String(({ ...selection.entitySelector, ...prefetched }).$network.caip2.reference)}`,
			relayHost: String(({ ...selection.entitySelector, ...prefetched }).relayHost),
			slot: String(({ ...selection.entitySelector, ...prefetched }).slot),
			blockHash: String(({ ...selection.entitySelector, ...prefetched }).blockHash),
		})
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{['Slot ' + String((({ ...selection.entitySelector, ...prefetched }).slot) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).value) ?? '') + ' wei'].filter(Boolean).join(' ') || title || 'MEV relay proposer payload delivered'}
		{:else}
			<ResourceBoundary resource={mevRelayProposerPayloadDelivered}>
				{#snippet Pending()}
					{['Slot ' + String((({ ...selection.entitySelector, ...prefetched }).slot) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).value) ?? '') + ' wei'].filter(Boolean).join(' ') || title || 'MEV relay proposer payload delivered'}
				{/snippet}

				{#snippet children(entity)}
					{['Slot ' + String((entity.slot) ?? ''), String((entity.value) ?? '') + ' wei'].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const value0 = ({ ...selection.entitySelector, ...prefetched }).value}
			{#if value0 !== undefined && value0 !== null}
				<NumberValue value={Number(value0)} />

				<span> wei</span>
			{/if}
		{:else}
			<ResourceBoundary resource={mevRelayProposerPayloadDelivered}>
				{#snippet Pending()}
					{@const value0 = ({ ...selection.entitySelector, ...prefetched }).value}
					{#if value0 !== undefined && value0 !== null}
						<NumberValue value={Number(value0)} />

						<span> wei</span>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const value0 = ({ ...selection.entitySelector, ...prefetched, ...entity }).value}
					{#if value0 !== undefined && value0 !== null}
						<NumberValue value={Number(value0)} />

						<span> wei</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.MevBuilder, false>('$builder')}
			>
				{#snippet children(mevBuilder)}
					{#if mevBuilder != null}
						<span data-text="muted">
							<MevBuilderView
								selection={select(EntityType.MevBuilder, mevBuilder.entitySelector)}
								prefetched={mevBuilder}
								href={
									resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/mev/builder/[builderPubkey]', {
										caip2: `${String(mevBuilder.entitySelector.$network.caip2.namespace)}:${String(mevBuilder.entitySelector.$network.caip2.reference)}`,
										builderPubkey: String(mevBuilder.entitySelector.builderPubkey),
									})
								}
								layout={EntityLayout.Title}
								open={false}
							/>
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{:else}
			<ResourceBoundary resource={mevRelayProposerPayloadDelivered}>
				{#snippet Pending()}
					<ResourceBoundary
						resource={selection[EntityProxyField]<EntityType.MevBuilder, false>('$builder')}
					>
						{#snippet children(mevBuilder)}
							{#if mevBuilder != null}
								<span data-text="muted">
									<MevBuilderView
										selection={select(EntityType.MevBuilder, mevBuilder.entitySelector)}
										prefetched={mevBuilder}
										href={
											resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/mev/builder/[builderPubkey]', {
												caip2: `${String(mevBuilder.entitySelector.$network.caip2.namespace)}:${String(mevBuilder.entitySelector.$network.caip2.reference)}`,
												builderPubkey: String(mevBuilder.entitySelector.builderPubkey),
											})
										}
										layout={EntityLayout.Title}
										open={false}
									/>
								</span>
							{/if}
						{/snippet}
					</ResourceBoundary>
				{/snippet}

				{#snippet children(entity)}
					<ResourceBoundary
						resource={selection[EntityProxyField]<EntityType.MevBuilder, false>('$builder')}
					>
						{#snippet children(mevBuilder)}
							{#if mevBuilder != null}
								<span data-text="muted">
									<MevBuilderView
										selection={select(EntityType.MevBuilder, mevBuilder.entitySelector)}
										prefetched={mevBuilder}
										href={
											resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/mev/builder/[builderPubkey]', {
												caip2: `${String(mevBuilder.entitySelector.$network.caip2.namespace)}:${String(mevBuilder.entitySelector.$network.caip2.reference)}`,
												builderPubkey: String(mevBuilder.entitySelector.builderPubkey),
											})
										}
										layout={EntityLayout.Title}
										open={false}
									/>
								</span>
							{/if}
						{/snippet}
					</ResourceBoundary>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Relay host</dt>
				<dd>
					<ResourceBoundary resource={mevRelayProposerPayloadDelivered}>
						{#snippet Pending()}
							{@const relayHost = prefetched.relayHost ?? selection.entitySelector.relayHost}
							{#if relayHost !== undefined && relayHost !== null}
								{String((relayHost) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const relayHost = entity.relayHost ?? selection.entitySelector.relayHost ?? prefetched.relayHost}
							{#if relayHost !== undefined && relayHost !== null}
								{String((relayHost) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Block hash</dt>
				<dd>
					<ResourceBoundary resource={mevRelayProposerPayloadDelivered}>
						{#snippet Pending()}
							{@const blockHash = prefetched.blockHash ?? selection.entitySelector.blockHash}
							{#if blockHash !== undefined && blockHash !== null}
								<TruncatedValue value={String(blockHash)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const blockHash = entity.blockHash ?? selection.entitySelector.blockHash ?? prefetched.blockHash}
							{#if blockHash !== undefined && blockHash !== null}
								<TruncatedValue value={String(blockHash)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary resource={mevRelayProposerPayloadDelivered}>
				{#snippet Pending()}
					{@const blockNumber = prefetched.blockNumber ?? selection.entitySelector.blockNumber}
					{#if blockNumber !== undefined && blockNumber !== null}
						<div>
							<dt>Block number</dt>
							<dd>
								<NumberValue value={Number(blockNumber)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const blockNumber = entity.blockNumber ?? selection.entitySelector.blockNumber ?? prefetched.blockNumber}
					{#if blockNumber !== undefined && blockNumber !== null}
						<div>
							<dt>Block number</dt>
							<dd>
								<NumberValue value={Number(blockNumber)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary resource={mevRelayProposerPayloadDelivered}>
				{#snippet Pending()}
					{@const builderPubkey = prefetched.builderPubkey ?? selection.entitySelector.builderPubkey}
					{#if builderPubkey !== undefined && builderPubkey !== null}
						<div>
							<dt>Builder public key</dt>
							<dd>
								<TruncatedValue value={String(builderPubkey)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const builderPubkey = entity.builderPubkey ?? selection.entitySelector.builderPubkey ?? prefetched.builderPubkey}
					{#if builderPubkey !== undefined && builderPubkey !== null}
						<div>
							<dt>Builder public key</dt>
							<dd>
								<TruncatedValue value={String(builderPubkey)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.EvmBlock, false>('$executionBlock')}
			>
				{#snippet children(evmBlock)}
					{#if evmBlock != null}
						<div>
							<dt>Execution block</dt>
							<dd>
								<EvmBlockView
									selection={select(EntityType.EvmBlock, evmBlock.entitySelector)}
									prefetched={evmBlock}
									href={
										resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(blocks)/block/[blockNumber=evmBlockNumber]', {
											caip2: `${String(evmBlock.entitySelector.$network.caip2.namespace)}:${String(evmBlock.entitySelector.$network.caip2.reference)}`,
											blockNumber: String(evmBlock.entitySelector.blockNumber),
										})
									}
									layout={EntityLayout.Title}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Network</dt>
				<dd>
					<EvmNetworkView
						selection={select(EntityType.EvmNetwork, selection.entitySelector.$network)}
						href={
							(selection.entitySelector.$network?.caip2 != null && selection.entitySelector.$network?.caip2?.namespace != null && selection.entitySelector.$network?.caip2?.reference != null ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]', {
								caip2: `${String(selection.entitySelector.$network.caip2.namespace)}:${String(selection.entitySelector.$network.caip2.reference)}`,
							}) : selection.entitySelector.$network?.slug != null ? resolve('/(explore)/(networks)/network/[networkSlug=eip155NetworkSlug]', {
								networkSlug: String(selection.entitySelector.$network.slug),
							}) : undefined)
						}
						layout={EntityLayout.Title}
						open={false}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>

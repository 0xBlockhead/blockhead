<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import { EntityProxyField, type EntityProxyData, type EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
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

	const pendingEntity = $derived(({ ...prefetched[EntityMetaKey.Selector], ...selection.entitySelector, ...prefetched }))
	const mevRelayProposerPayloadDelivered = $derived(selection({
		fields: {
			value: true,
			$builder: true,
		},
	}))
	const titleFallback = $derived([(String((selection.entitySelector.slot ?? prefetched.slot) ?? '') ? 'Slot ' + String((selection.entitySelector.slot ?? prefetched.slot) ?? '') : ''), (String((prefetched.value) ?? '') ? String((prefetched.value) ?? '') + ' wei' : '')].filter(Boolean).join(' ') || 'MEV relay proposer payload delivered')
	const viewDomId = $derived('mev-relay-proposer-payload-delivered-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import MevBuilderView from '$/views/MevBuilderView.svelte'
	import EvmBlockView from '$/views/EvmBlockView.svelte'
	import EvmNetworkView from '$/views/EvmNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.MevRelay_ProposerPayloadDelivered}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (pendingEntity.$network !== undefined && pendingEntity.$network.caip2 !== undefined && pendingEntity.$network.caip2.namespace !== undefined && pendingEntity.$network !== undefined && pendingEntity.$network.caip2 !== undefined && pendingEntity.$network.caip2.reference !== undefined && pendingEntity.relayHost !== undefined && pendingEntity.slot !== undefined && pendingEntity.blockHash !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/mev/payload/[relayHost]/[slot=nonNegativeInteger]/[blockHash]', {
			caip2: `${String(pendingEntity.$network.caip2.namespace ?? '')}:${String(pendingEntity.$network.caip2.reference ?? '')}`,
			relayHost: String(pendingEntity.relayHost ?? ''),
			slot: String(pendingEntity.slot ?? ''),
			blockHash: String(pendingEntity.blockHash ?? ''),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={mevRelayProposerPayloadDelivered}>
			{#snippet Pending()}
				{[(String((selection.entitySelector.slot ?? prefetched.slot) ?? '') ? 'Slot ' + String((selection.entitySelector.slot ?? prefetched.slot) ?? '') : ''), (String((prefetched.value) ?? '') ? String((prefetched.value) ?? '') + ' wei' : '')].filter(Boolean).join(' ') || title || 'MEV relay proposer payload delivered'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[(String((resolvedEntity.slot) ?? '') ? 'Slot ' + String((resolvedEntity.slot) ?? '') : ''), (String((resolvedEntity.value) ?? '') ? String((resolvedEntity.value) ?? '') + ' wei' : '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={mevRelayProposerPayloadDelivered}>
			{#snippet Pending()}
				{@const value0 = prefetched.value}
				{#if value0 !== undefined && value0 !== null}
					<NumberValue value={Number(value0)} />

					<span> wei</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const value0 = resolvedEntity.value}
				{#if value0 !== undefined && value0 !== null}
					<NumberValue value={Number(value0)} />

					<span> wei</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={mevRelayProposerPayloadDelivered}>
			{#snippet Pending()}
				<ResourceBoundary
					resource={selection[EntityProxyField]<EntityType.MevBuilder, false>('$builder')}
				>
					{#snippet children(mevBuilder)}
						{#if mevBuilder != null && mevBuilder[EntityMetaKey.Selector] != null}
							<span data-text="muted">
								<MevBuilderView
									selection={select(EntityType.MevBuilder, mevBuilder[EntityMetaKey.Selector])}
									prefetched={mevBuilder}
									href={
										(({ ...mevBuilder[EntityMetaKey.Selector], ...mevBuilder }).$network !== undefined && ({ ...mevBuilder[EntityMetaKey.Selector], ...mevBuilder }).$network.caip2 !== undefined && ({ ...mevBuilder[EntityMetaKey.Selector], ...mevBuilder }).$network.caip2.namespace !== undefined && ({ ...mevBuilder[EntityMetaKey.Selector], ...mevBuilder }).$network !== undefined && ({ ...mevBuilder[EntityMetaKey.Selector], ...mevBuilder }).$network.caip2 !== undefined && ({ ...mevBuilder[EntityMetaKey.Selector], ...mevBuilder }).$network.caip2.reference !== undefined && ({ ...mevBuilder[EntityMetaKey.Selector], ...mevBuilder }).builderPubkey !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/mev/builder/[builderPubkey]', {
											caip2: `${String(({ ...mevBuilder[EntityMetaKey.Selector], ...mevBuilder }).$network.caip2.namespace ?? '')}:${String(({ ...mevBuilder[EntityMetaKey.Selector], ...mevBuilder }).$network.caip2.reference ?? '')}`,
											builderPubkey: String(({ ...mevBuilder[EntityMetaKey.Selector], ...mevBuilder }).builderPubkey ?? ''),
										}) : undefined)
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
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<ResourceBoundary
					resource={selection[EntityProxyField]<EntityType.MevBuilder, false>('$builder')}
				>
					{#snippet children(mevBuilder)}
						{#if mevBuilder != null && mevBuilder[EntityMetaKey.Selector] != null}
							<span data-text="muted">
								<MevBuilderView
									selection={select(EntityType.MevBuilder, mevBuilder[EntityMetaKey.Selector])}
									prefetched={mevBuilder}
									href={
										(({ ...mevBuilder[EntityMetaKey.Selector], ...mevBuilder }).$network !== undefined && ({ ...mevBuilder[EntityMetaKey.Selector], ...mevBuilder }).$network.caip2 !== undefined && ({ ...mevBuilder[EntityMetaKey.Selector], ...mevBuilder }).$network.caip2.namespace !== undefined && ({ ...mevBuilder[EntityMetaKey.Selector], ...mevBuilder }).$network !== undefined && ({ ...mevBuilder[EntityMetaKey.Selector], ...mevBuilder }).$network.caip2 !== undefined && ({ ...mevBuilder[EntityMetaKey.Selector], ...mevBuilder }).$network.caip2.reference !== undefined && ({ ...mevBuilder[EntityMetaKey.Selector], ...mevBuilder }).builderPubkey !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/mev/builder/[builderPubkey]', {
											caip2: `${String(({ ...mevBuilder[EntityMetaKey.Selector], ...mevBuilder }).$network.caip2.namespace ?? '')}:${String(({ ...mevBuilder[EntityMetaKey.Selector], ...mevBuilder }).$network.caip2.reference ?? '')}`,
											builderPubkey: String(({ ...mevBuilder[EntityMetaKey.Selector], ...mevBuilder }).builderPubkey ?? ''),
										}) : undefined)
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
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Relay host</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									relayHost: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const relayHost = selection.entitySelector.relayHost ?? prefetched.relayHost}
							{#if relayHost !== undefined && relayHost !== null}
								{String((relayHost) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const relayHost = resolvedEntity.relayHost}
							{#if relayHost !== undefined && relayHost !== null}
								{String((relayHost) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Slot</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									slot: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const slot = selection.entitySelector.slot ?? prefetched.slot}
							{#if slot !== undefined && slot !== null}
								<NumberValue value={Number(slot)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const slot = resolvedEntity.slot}
							{#if slot !== undefined && slot !== null}
								<NumberValue value={Number(slot)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Block hash</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									blockHash: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const blockHash = selection.entitySelector.blockHash ?? prefetched.blockHash}
							{#if blockHash !== undefined && blockHash !== null}
								<TruncatedValue value={String((blockHash) ?? '')} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const blockHash = resolvedEntity.blockHash}
							{#if blockHash !== undefined && blockHash !== null}
								<TruncatedValue value={String((blockHash) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							blockNumber: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const blockNumber = prefetched.blockNumber}
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
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const blockNumber = resolvedEntity.blockNumber}
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
			<ResourceBoundary
				resource={
					selection({
						fields: {
							builderPubkey: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const builderPubkey = prefetched.builderPubkey}
					{#if builderPubkey !== undefined && builderPubkey !== null}
						<div>
							<dt>Builder public key</dt>
							<dd>
								<TruncatedValue value={String((builderPubkey) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const builderPubkey = resolvedEntity.builderPubkey}
					{#if builderPubkey !== undefined && builderPubkey !== null}
						<div>
							<dt>Builder public key</dt>
							<dd>
								<TruncatedValue value={String((builderPubkey) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							value: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const value = prefetched.value}
					{#if value !== undefined && value !== null}
						<div>
							<dt>Value</dt>
							<dd>
								<NumberValue value={Number(value)} />

								<span> wei</span>
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const value = resolvedEntity.value}
					{#if value !== undefined && value !== null}
						<div>
							<dt>Value</dt>
							<dd>
								<NumberValue value={Number(value)} />

								<span> wei</span>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.MevBuilder, false>('$builder')}
			>
				{#snippet children(mevBuilder)}
					{#if mevBuilder != null && mevBuilder[EntityMetaKey.Selector] != null}
						<div>
							<dt>Builder</dt>
							<dd>
								<MevBuilderView
									selection={select(EntityType.MevBuilder, mevBuilder[EntityMetaKey.Selector])}
									prefetched={mevBuilder}
									href={
										(({ ...mevBuilder[EntityMetaKey.Selector], ...mevBuilder }).$network !== undefined && ({ ...mevBuilder[EntityMetaKey.Selector], ...mevBuilder }).$network.caip2 !== undefined && ({ ...mevBuilder[EntityMetaKey.Selector], ...mevBuilder }).$network.caip2.namespace !== undefined && ({ ...mevBuilder[EntityMetaKey.Selector], ...mevBuilder }).$network !== undefined && ({ ...mevBuilder[EntityMetaKey.Selector], ...mevBuilder }).$network.caip2 !== undefined && ({ ...mevBuilder[EntityMetaKey.Selector], ...mevBuilder }).$network.caip2.reference !== undefined && ({ ...mevBuilder[EntityMetaKey.Selector], ...mevBuilder }).builderPubkey !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/mev/builder/[builderPubkey]', {
											caip2: `${String(({ ...mevBuilder[EntityMetaKey.Selector], ...mevBuilder }).$network.caip2.namespace ?? '')}:${String(({ ...mevBuilder[EntityMetaKey.Selector], ...mevBuilder }).$network.caip2.reference ?? '')}`,
											builderPubkey: String(({ ...mevBuilder[EntityMetaKey.Selector], ...mevBuilder }).builderPubkey ?? ''),
										}) : undefined)
									}
									layout={EntityLayout.Title}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.EvmBlock, false>('$executionBlock')}
			>
				{#snippet children(evmBlock)}
					{#if evmBlock != null && evmBlock[EntityMetaKey.Selector] != null}
						<div>
							<dt>Execution block</dt>
							<dd>
								<EvmBlockView
									selection={select(EntityType.EvmBlock, evmBlock[EntityMetaKey.Selector])}
									prefetched={evmBlock}
									href={
										(({ ...evmBlock[EntityMetaKey.Selector], ...evmBlock }).$network !== undefined && ({ ...evmBlock[EntityMetaKey.Selector], ...evmBlock }).$network.caip2 !== undefined && ({ ...evmBlock[EntityMetaKey.Selector], ...evmBlock }).$network.caip2.namespace !== undefined && ({ ...evmBlock[EntityMetaKey.Selector], ...evmBlock }).$network !== undefined && ({ ...evmBlock[EntityMetaKey.Selector], ...evmBlock }).$network.caip2 !== undefined && ({ ...evmBlock[EntityMetaKey.Selector], ...evmBlock }).$network.caip2.reference !== undefined && ({ ...evmBlock[EntityMetaKey.Selector], ...evmBlock }).blockNumber !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(blocks)/block/[blockNumber=evmBlockNumber]', {
											caip2: `${String(({ ...evmBlock[EntityMetaKey.Selector], ...evmBlock }).$network.caip2.namespace ?? '')}:${String(({ ...evmBlock[EntityMetaKey.Selector], ...evmBlock }).$network.caip2.reference ?? '')}`,
											blockNumber: String(({ ...evmBlock[EntityMetaKey.Selector], ...evmBlock }).blockNumber ?? ''),
										}) : undefined)
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
							(selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.namespace !== undefined && selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]', {
								caip2: `${String(selection.entitySelector.$network.caip2.namespace ?? '')}:${String(selection.entitySelector.$network.caip2.reference ?? '')}`,
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

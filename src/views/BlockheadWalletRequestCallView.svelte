<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { EvmAddress, ZeroExHex } from '$/schema/ZeroExHex.ts'
	import { Source } from '$/sources/Source.ts'


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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadWalletRequestCall>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.BlockheadWalletRequestCall>>
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
	const blockheadWalletRequestCall = $derived(selection({
		sources: [
			Source.Local_Internal,
		],
		fields: {
			toAddress: true,
		},
	}))
	const titleFallback = $derived((String((pendingEntity.callIndex) ?? '') ? 'Call #' + String((pendingEntity.callIndex) ?? '') : '') || 'blockhead wallet request call')
	const viewDomId = $derived('blockhead-wallet-request-call-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BlockheadWalletRequestView from '$/views/BlockheadWalletRequestView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadWalletRequestCall}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	idDragPlainText={String(pendingEntity.callIndex ?? '')}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{@const serialValue = pendingEntity.callIndex}
		{#if serialValue !== undefined && serialValue !== null}
			<span data-row="inline align-center gap-2 wrap">
				<span>Call </span>
				<span data-badge="small">
					#{String((serialValue) ?? '')}
				</span>
			</span>
		{/if}
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={blockheadWalletRequestCall}>
			{#snippet Pending()}
				{[String((pendingEntity.toAddress) ?? '')].filter(Boolean).join(' ') || title || 'blockhead wallet request call'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.toAddress) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>wallet request</dt>
				<dd>
					<BlockheadWalletRequestView
						selection={select(EntityType.BlockheadWalletRequest, selection.entitySelector.$walletRequest, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>call index</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									callIndex: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const callIndex = pendingEntity.callIndex}
							{#if callIndex !== undefined && callIndex !== null}
								<NumberValue value={Number(callIndex)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const callIndex = resolvedEntity.callIndex}
							{#if callIndex !== undefined && callIndex !== null}
								<NumberValue value={Number(callIndex)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							caip2: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const caip2 = pendingEntity.caip2}
					{#if caip2 !== undefined && caip2 !== null}
						<div>
							<dt>CAIP-2</dt>
							<dd>
								<TruncatedValue value={caip2 == null ? '' : String((`${(caip2).namespace}:${(caip2).reference}`) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const caip2 = resolvedEntity.caip2}
					{#if caip2 !== undefined && caip2 !== null}
						<div>
							<dt>CAIP-2</dt>
							<dd>
								<TruncatedValue value={caip2 == null ? '' : String((`${(caip2).namespace}:${(caip2).reference}`) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							toAddress: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const toAddress = pendingEntity.toAddress}
					{#if toAddress !== undefined && toAddress !== null}
						<div>
							<dt>to address</dt>
							<dd>
								<TruncatedValue value={String((toAddress) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const toAddress = resolvedEntity.toAddress}
					{#if toAddress !== undefined && toAddress !== null}
						<div>
							<dt>to address</dt>
							<dd>
								<TruncatedValue value={String((toAddress) ?? '')} />
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
					{@const value = pendingEntity.value}
					{#if value !== undefined && value !== null}
						<div>
							<dt>Value</dt>
							<dd>
								<NumberValue value={Number(value)} />
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
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							inputDataHash: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const inputDataHash = pendingEntity.inputDataHash}
					{#if inputDataHash !== undefined && inputDataHash !== null}
						<div>
							<dt>input data hash</dt>
							<dd>
								<TruncatedValue value={String((inputDataHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const inputDataHash = resolvedEntity.inputDataHash}
					{#if inputDataHash !== undefined && inputDataHash !== null}
						<div>
							<dt>input data hash</dt>
							<dd>
								<TruncatedValue value={String((inputDataHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>

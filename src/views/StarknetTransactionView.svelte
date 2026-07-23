<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { RegisteredEntityProxyPrefetchedData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'


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
			selection: RegisteredEntityProxyResource<EntityType.StarknetTransaction>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.StarknetTransaction>
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
	const starknetTransaction = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {
			transactionKind: true,
		},
	} : {
		sources: selection.sources,
		fields: {
			transactionKind: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.transactionHash) ?? '')].filter(Boolean).join(' ') || 'starknet transaction')
	const viewDomId = $derived('starknet-transaction-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import StarknetEventsView from '$/views/StarknetEventsView.svelte'
	import StarknetTransaction_TimestampsView from '$/views/StarknetTransaction_TimestampsView.svelte'
	import StarknetBlockView from '$/views/StarknetBlockView.svelte'
</script>


<EntityView
	entityType={EntityType.StarknetTransaction}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={starknetTransaction}>
			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.transactionHash) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={starknetTransaction}>
			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.transactionKind) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.transactionHash) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={starknetTransaction}>
			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<ResourceBoundary
					resource={selection.$block}
				>
					{#snippet children(starknetBlock)}
						{#if starknetBlock != null && starknetBlock[EntityMetaKey.Selector] != null}
							<span data-text="muted">
								<StarknetBlockView
									selection={select(EntityType.StarknetBlock, starknetBlock[EntityMetaKey.Selector])}
									prefetched={starknetBlock}
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
				<dt>transaction hash</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									transactionHash: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const transactionHash = resolvedEntity.transactionHash}
							{#if transactionHash !== undefined && transactionHash !== null}
								<TruncatedValue value={String((transactionHash) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							transactionKind: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const transactionKind = resolvedEntity.transactionKind}
					{#if transactionKind !== undefined && transactionKind !== null}
						<div>
							<dt>transaction kind</dt>
							<dd>
								{String((transactionKind) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$block}
			>
				{#snippet children(starknetBlock)}
					{#if starknetBlock != null && starknetBlock[EntityMetaKey.Selector] != null}
						<div>
							<dt>block</dt>
							<dd>
								<StarknetBlockView
									selection={select(EntityType.StarknetBlock, starknetBlock[EntityMetaKey.Selector])}
									prefetched={starknetBlock}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							senderAddress: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const senderAddress = resolvedEntity.senderAddress}
					{#if senderAddress !== undefined && senderAddress !== null}
						<div>
							<dt>sender address</dt>
							<dd>
								<TruncatedValue value={String((senderAddress) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							nonce: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const nonce = resolvedEntity.nonce}
					{#if nonce !== undefined && nonce !== null}
						<div>
							<dt>nonce</dt>
							<dd>
								{String((nonce) ?? '')}
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
						sources: selection.sources,
						fields: {
							version: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const version = resolvedEntity.version}
					{#if version !== undefined && version !== null}
						<div>
							<dt>version</dt>
							<dd>
								{String((version) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							resourceBounds: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const resourceBounds = resolvedEntity.resourceBounds}
					{#if resourceBounds !== undefined && resourceBounds !== null}
						<div>
							<dt>resource bounds</dt>
							<dd>
								{String((resourceBounds) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>calldata</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									calldata: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const calldata = resolvedEntity.calldata}
							{#if calldata !== undefined && calldata !== null}
								{calldata.values.map((value) => String(value ?? '')).filter(Boolean).join(', ')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>signature</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									signature: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const signature = resolvedEntity.signature}
							{#if signature !== undefined && signature !== null}
								<TruncatedValue value={signature.values.map((value) => String(value ?? '')).filter(Boolean).join(', ')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const starknetTransactionStarknetEventsViewEventsResource = selection.$$events}
		<ResourceBoundary
			resource={starknetTransactionStarknetEventsViewEventsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
				<StarknetEventsView
					selection={starknetTransactionStarknetEventsViewEventsResource}
					countResource={starknetTransactionStarknetEventsViewEventsResource.count}
					title='events'
					id='StarknetEventsView-events'
				/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const starknetTransactionStarknetTransactionTimestampsViewTimestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={starknetTransactionStarknetTransactionTimestampsViewTimestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
				<StarknetTransaction_TimestampsView
					selection={starknetTransactionStarknetTransactionTimestampsViewTimestampsResource}
					countResource={starknetTransactionStarknetTransactionTimestampsViewTimestampsResource.count}
					title='timestamps'
					id='StarknetTransaction_TimestampsView-timestamps'
				/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>

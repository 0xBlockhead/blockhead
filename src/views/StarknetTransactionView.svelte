<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
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
			selection: RegisteredEntityProxyResource<EntityType.StarknetTransaction>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.StarknetTransaction>>
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
	const starknetTransaction = $derived(selection({
		sources: [
			Source.Juno_JsonRpc,
			Source.Pathfinder_JsonRpc,
			Source.Starknet_JsonRpc,
			Source.Starkscan_Rest,
			Source.Voyager_Rest,
		],
		fields: {
			transactionKind: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.transactionHash) ?? '')].filter(Boolean).join(' ') || 'starknet transaction')
	const viewDomId = $derived('starknet-transaction-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


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
			{#snippet Pending()}
				{[String((pendingEntity.transactionHash) ?? '')].filter(Boolean).join(' ') || title || 'starknet transaction'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.transactionHash) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={starknetTransaction}>
			{#snippet Pending()}
				{[String((pendingEntity.transactionKind) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.transactionHash) ?? '')].filter(Boolean).join(' ') || title || 'starknet transaction'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.transactionKind) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.transactionHash) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={starknetTransaction}>
			{#snippet Pending()}
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
								fields: {
									transactionHash: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const transactionHash = pendingEntity.transactionHash}
							{#if transactionHash !== undefined && transactionHash !== null}
								<TruncatedValue value={String((transactionHash) ?? '')} />
							{/if}
						{/snippet}

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
						fields: {
							transactionKind: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const transactionKind = pendingEntity.transactionKind}
					{#if transactionKind !== undefined && transactionKind !== null}
						<div>
							<dt>transaction kind</dt>
							<dd>
								{String((transactionKind) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
				{#snippet Pending()}{/snippet}

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
						fields: {
							senderAddress: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const senderAddress = pendingEntity.senderAddress}
					{#if senderAddress !== undefined && senderAddress !== null}
						<div>
							<dt>sender address</dt>
							<dd>
								<TruncatedValue value={String((senderAddress) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							nonce: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const nonce = pendingEntity.nonce}
					{#if nonce !== undefined && nonce !== null}
						<div>
							<dt>nonce</dt>
							<dd>
								{String((nonce) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							version: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const version = pendingEntity.version}
					{#if version !== undefined && version !== null}
						<div>
							<dt>version</dt>
							<dd>
								{String((version) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							resourceBounds: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const resourceBounds = pendingEntity.resourceBounds}
					{#if resourceBounds !== undefined && resourceBounds !== null}
						<div>
							<dt>resource bounds</dt>
							<dd>
								{String((resourceBounds) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
								fields: {
									calldata: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const calldata = pendingEntity.calldata}
							{#if calldata !== undefined && calldata !== null}
								{calldata.values.map((value) => String(value ?? '')).filter(Boolean).join(', ')}
							{/if}
						{/snippet}

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
								fields: {
									signature: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const signature = pendingEntity.signature}
							{#if signature !== undefined && signature !== null}
								<TruncatedValue value={signature.values.map((value) => String(value ?? '')).filter(Boolean).join(', ')} />
							{/if}
						{/snippet}

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
		{#if detailsOpen}
			<StarknetEventsView
				selection={
						selection.$$events({
							count: true,
						})
					}
				title='events'
				emptyText='No Starknet events.'
				id='StarknetEventsView-events'
			/>

			<StarknetTransaction_TimestampsView
				selection={
						selection.$$timestamps({
							count: true,
						})
					}
				title='timestamps'
				emptyText='No Starknet transaction observations.'
				id='StarknetTransaction_TimestampsView-timestamps'
			/>
		{/if}
	{/snippet}
</EntityView>

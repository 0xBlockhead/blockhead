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
			selection: RegisteredEntityProxyResource<EntityType.BlockheadCashuProof>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.BlockheadCashuProof>
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
	const blockheadCashuProof = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {
			amount: true,
			unit: true,
		},
	} : {
		sources: selection.sources,
		fields: {
			amount: true,
			unit: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.secretHash) ?? '')].filter(Boolean).join(' ') || 'blockhead Cashu proof')
	const viewDomId = $derived('blockhead-cashu-proof-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BlockheadCashuProof_TimestampsView from '$/views/BlockheadCashuProof_TimestampsView.svelte'
	import CashuMintView from '$/views/CashuMintView.svelte'
	import CashuKeysetView from '$/views/CashuKeysetView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadCashuProof}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'amount') && Object.hasOwn(prefetched, 'unit')}
			{@const secretHash0 = pendingEntity.secretHash}
			{#if secretHash0 !== undefined && secretHash0 !== null}
				<TruncatedValue value={String((secretHash0) ?? '')} />
			{/if}
		{:else}
			<ResourceBoundary resource={blockheadCashuProof}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const secretHash0 = resolvedEntity.secretHash}
					{#if secretHash0 !== undefined && secretHash0 !== null}
						<TruncatedValue value={String((secretHash0) ?? '')} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'amount') && Object.hasOwn(prefetched, 'unit')}
			{@const amount0 = pendingEntity.amount}
			{#if amount0 !== undefined && amount0 !== null}
				<NumberValue
					value={amount0}
				/>

				<span>{pendingEntity.unit == null ? '' : ` ${String(pendingEntity.unit)}`}</span>
			{/if}
		{:else}
			<ResourceBoundary resource={blockheadCashuProof}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const amount0 = resolvedEntity.amount}
					{#if amount0 !== undefined && amount0 !== null}
						<NumberValue
							value={amount0}
						/>

						<span>{resolvedEntity.unit == null ? '' : ` ${String(resolvedEntity.unit)}`}</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>wallet ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									walletId: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const walletId = resolvedEntity.walletId}
							{#if walletId !== undefined && walletId !== null}
								{String((walletId) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>mint</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$mint}
					>
						{#snippet children(cashuMint)}
							{#if cashuMint != null && cashuMint[EntityMetaKey.Selector] != null}
								<CashuMintView
									selection={select(EntityType.CashuMint, cashuMint[EntityMetaKey.Selector])}
									prefetched={cashuMint}
									layout={EntityLayout.Value}
									open={false}
								/>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>mint URL</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									mintUrl: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const mintUrl = resolvedEntity.mintUrl}
							{#if mintUrl !== undefined && mintUrl !== null}
								<svelte:element
									this={'a'}
									href={String(mintUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(mintUrl)} />
								</svelte:element>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$keyset}
			>
				{#snippet children(cashuKeyset)}
					{#if cashuKeyset != null && cashuKeyset[EntityMetaKey.Selector] != null}
						<div>
							<dt>keyset</dt>
							<dd>
								<CashuKeysetView
									selection={select(EntityType.CashuKeyset, cashuKeyset[EntityMetaKey.Selector])}
									prefetched={cashuKeyset}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>keyset ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									keysetId: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const keysetId = resolvedEntity.keysetId}
							{#if keysetId !== undefined && keysetId !== null}
								{String((keysetId) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>secret hash</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									secretHash: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const secretHash = resolvedEntity.secretHash}
							{#if secretHash !== undefined && secretHash !== null}
								<TruncatedValue value={String((secretHash) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>amount</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									amount: true,
									unit: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const amount = resolvedEntity.amount}
							{#if amount !== undefined && amount !== null}
								<NumberValue
									value={amount}
								/>

								<span>{({ value: amount, ...resolvedEntity }).unit == null ? '' : ` ${String(({ value: amount, ...resolvedEntity }).unit)}`}</span>
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
							signature: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const signature = resolvedEntity.signature}
					{#if signature !== undefined && signature !== null}
						<div>
							<dt>signature</dt>
							<dd>
								<TruncatedValue value={String((signature) ?? '')} />
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
							dleqJson: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const dleqJson = resolvedEntity.dleqJson}
					{#if dleqJson !== undefined && dleqJson !== null}
						<div>
							<dt>dleq JSON</dt>
							<dd>
								{String((dleqJson) ?? '')}
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
							receivedAt: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const receivedAt = resolvedEntity.receivedAt}
					{#if receivedAt !== undefined && receivedAt !== null}
						<div>
							<dt>received AT</dt>
							<dd>
								<Timestamp timestamp={Number(receivedAt)} />
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
							sourceTokenId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const sourceTokenId = resolvedEntity.sourceTokenId}
					{#if sourceTokenId !== undefined && sourceTokenId !== null}
						<div>
							<dt>source token ID</dt>
							<dd>
								{String((sourceTokenId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const blockheadCashuProofBlockheadCashuProofTimestampsViewTimestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={blockheadCashuProofBlockheadCashuProofTimestampsViewTimestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
				<BlockheadCashuProof_TimestampsView
					selection={blockheadCashuProofBlockheadCashuProofTimestampsViewTimestampsResource}
					countResource={blockheadCashuProofBlockheadCashuProofTimestampsViewTimestampsResource.count}
					title='timestamps'
					id='BlockheadCashuProof_TimestampsView-timestamps'
				/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>

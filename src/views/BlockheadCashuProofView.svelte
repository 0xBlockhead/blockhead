<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { EntityProxyField, type EntityProxyData, type EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadCashuProof>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.BlockheadCashuProof>>
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
	const blockheadCashuProof = $derived(selection({
		fields: {
			amount: true,
			unit: true,
		},
	}))
	const titleFallback = $derived([String((selection.entitySelector.secretHash ?? prefetched.secretHash) ?? '')].filter(Boolean).join(' ') || 'blockhead Cashu proof')
	const viewDomId = $derived('blockhead-cashu-proof-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


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
		<ResourceBoundary resource={blockheadCashuProof}>
			{#snippet Pending()}
				{@const secretHash0 = selection.entitySelector.secretHash ?? prefetched.secretHash}
				{#if secretHash0 !== undefined && secretHash0 !== null}
					<TruncatedValue value={String((secretHash0) ?? '')} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const secretHash0 = resolvedEntity.secretHash}
				{#if secretHash0 !== undefined && secretHash0 !== null}
					<TruncatedValue value={String((secretHash0) ?? '')} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={blockheadCashuProof}>
			{#snippet Pending()}
				{[String((prefetched.amount) ?? ''), String((prefetched.unit) ?? '')].filter(Boolean).join(' ') || [String((selection.entitySelector.secretHash ?? prefetched.secretHash) ?? '')].filter(Boolean).join(' ') || title || 'blockhead Cashu proof'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.amount) ?? ''), String((resolvedEntity.unit) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.secretHash) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>wallet ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									walletId: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const walletId = selection.entitySelector.walletId ?? prefetched.walletId}
							{#if walletId !== undefined && walletId !== null}
								{String((walletId) ?? '')}
							{/if}
						{/snippet}

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
						resource={selection[EntityProxyField]<EntityType.CashuMint, false>('$mint')}
					>
						{#snippet children(cashuMint)}
							{#if cashuMint[EntityMetaKey.Selector] != null}
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
								fields: {
									mintUrl: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const mintUrl = selection.entitySelector.mintUrl ?? prefetched.mintUrl}
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
				resource={selection[EntityProxyField]<EntityType.CashuKeyset, false>('$keyset')}
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
								fields: {
									keysetId: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const keysetId = selection.entitySelector.keysetId ?? prefetched.keysetId}
							{#if keysetId !== undefined && keysetId !== null}
								{String((keysetId) ?? '')}
							{/if}
						{/snippet}

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
								fields: {
									secretHash: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const secretHash = selection.entitySelector.secretHash ?? prefetched.secretHash}
							{#if secretHash !== undefined && secretHash !== null}
								<TruncatedValue value={String((secretHash) ?? '')} />
							{/if}
						{/snippet}

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
								fields: {
									amount: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const amount = prefetched.amount}
							{#if amount !== undefined && amount !== null}
								<NumberValue value={Number(amount)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const amount = resolvedEntity.amount}
							{#if amount !== undefined && amount !== null}
								<NumberValue value={Number(amount)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>unit</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									unit: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const unit = prefetched.unit}
							{#if unit !== undefined && unit !== null}
								{String((unit) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const unit = resolvedEntity.unit}
							{#if unit !== undefined && unit !== null}
								{String((unit) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

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
					{@const signature = prefetched.signature}
					{#if signature !== undefined && signature !== null}
						<div>
							<dt>signature</dt>
							<dd>
								<TruncatedValue value={String((signature) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							dleqJson: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const dleqJson = prefetched.dleqJson}
					{#if dleqJson !== undefined && dleqJson !== null}
						<div>
							<dt>dleq JSON</dt>
							<dd>
								{String((dleqJson) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							receivedAt: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const receivedAt = prefetched.receivedAt}
					{#if receivedAt !== undefined && receivedAt !== null}
						<div>
							<dt>received AT</dt>
							<dd>
								<Timestamp timestamp={Number(receivedAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							sourceTokenId: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const sourceTokenId = prefetched.sourceTokenId}
					{#if sourceTokenId !== undefined && sourceTokenId !== null}
						<div>
							<dt>source token ID</dt>
							<dd>
								{String((sourceTokenId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
		{#if detailsOpen}
			<BlockheadCashuProof_TimestampsView
				selection={selection[EntityProxyField]<EntityType.BlockheadCashuProof_Timestamp>('$$timestamps')}
				title='timestamps'
				emptyText='No observations yet.'
				id='BlockheadCashuProof_TimestampsView-$$timestamps'
			/>
		{/if}
	{/snippet}
</EntityView>

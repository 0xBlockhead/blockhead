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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadCashuToken>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.BlockheadCashuToken>>
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
	const blockheadCashuToken = $derived(selection({
		fields: {
			status: true,
			totalAmount: true,
		},
	}))
	const titleFallback = $derived([String((selection.entitySelector.id ?? prefetched.id) ?? '')].filter(Boolean).join(' ') || 'blockhead Cashu token')
	const viewDomId = $derived('blockhead-cashu-token-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BlockheadCashuProofsView from '$/views/BlockheadCashuProofsView.svelte'
	import CashuMintView from '$/views/CashuMintView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadCashuToken}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={blockheadCashuToken}>
			{#snippet Pending()}
				{[String((selection.entitySelector.id ?? prefetched.id) ?? '')].filter(Boolean).join(' ') || title || 'blockhead Cashu token'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.id) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={blockheadCashuToken}>
			{#snippet Pending()}
				{[String((prefetched.status) ?? ''), String((prefetched.totalAmount) ?? '')].filter(Boolean).join(' ') || [String((selection.entitySelector.id ?? prefetched.id) ?? '')].filter(Boolean).join(' ') || title || 'blockhead Cashu token'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.status) ?? ''), String((resolvedEntity.totalAmount) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.id) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									id: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const id = selection.entitySelector.id ?? prefetched.id}
							{#if id !== undefined && id !== null}
								{String((id) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const id = resolvedEntity.id}
							{#if id !== undefined && id !== null}
								{String((id) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>token version</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									tokenVersion: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const tokenVersion = prefetched.tokenVersion}
							{#if tokenVersion !== undefined && tokenVersion !== null}
								{String((tokenVersion) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const tokenVersion = resolvedEntity.tokenVersion}
							{#if tokenVersion !== undefined && tokenVersion !== null}
								{String((tokenVersion) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>status</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									status: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const status = prefetched.status}
							{#if status !== undefined && status !== null}
								{String((status) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const status = resolvedEntity.status}
							{#if status !== undefined && status !== null}
								{String((status) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

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
						<div>
							<dt>unit</dt>
							<dd>
								{String((unit) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const unit = resolvedEntity.unit}
					{#if unit !== undefined && unit !== null}
						<div>
							<dt>unit</dt>
							<dd>
								{String((unit) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							memo: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const memo = prefetched.memo}
					{#if memo !== undefined && memo !== null}
						<div>
							<dt>memo</dt>
							<dd>
								{String((memo) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const memo = resolvedEntity.memo}
					{#if memo !== undefined && memo !== null}
						<div>
							<dt>memo</dt>
							<dd>
								{String((memo) ?? '')}
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
							mintUrl: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const mintUrl = prefetched.mintUrl}
					{#if mintUrl !== undefined && mintUrl !== null}
						<div>
							<dt>mint URL</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(mintUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(mintUrl)} />
								</svelte:element>
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const mintUrl = resolvedEntity.mintUrl}
					{#if mintUrl !== undefined && mintUrl !== null}
						<div>
							<dt>mint URL</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(mintUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(mintUrl)} />
								</svelte:element>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$mint}
			>
				{#snippet children(cashuMint)}
					{#if cashuMint != null && cashuMint[EntityMetaKey.Selector] != null}
						<div>
							<dt>mint</dt>
							<dd>
								<CashuMintView
									selection={select(EntityType.CashuMint, cashuMint[EntityMetaKey.Selector])}
									prefetched={cashuMint}
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
							proofCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const proofCount = prefetched.proofCount}
					{#if proofCount !== undefined && proofCount !== null}
						<div>
							<dt>proof count</dt>
							<dd>
								<NumberValue value={Number(proofCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const proofCount = resolvedEntity.proofCount}
					{#if proofCount !== undefined && proofCount !== null}
						<div>
							<dt>proof count</dt>
							<dd>
								<NumberValue value={Number(proofCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							totalAmount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const totalAmount = prefetched.totalAmount}
					{#if totalAmount !== undefined && totalAmount !== null}
						<div>
							<dt>total amount</dt>
							<dd>
								<NumberValue value={Number(totalAmount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const totalAmount = resolvedEntity.totalAmount}
					{#if totalAmount !== undefined && totalAmount !== null}
						<div>
							<dt>total amount</dt>
							<dd>
								<NumberValue value={Number(totalAmount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>imported AT</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									importedAt: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const importedAt = prefetched.importedAt}
							{#if importedAt !== undefined && importedAt !== null}
								<Timestamp timestamp={Number(importedAt)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const importedAt = resolvedEntity.importedAt}
							{#if importedAt !== undefined && importedAt !== null}
								<Timestamp timestamp={Number(importedAt)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							redeemedAt: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const redeemedAt = prefetched.redeemedAt}
					{#if redeemedAt !== undefined && redeemedAt !== null}
						<div>
							<dt>redeemed AT</dt>
							<dd>
								<Timestamp timestamp={Number(redeemedAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const redeemedAt = resolvedEntity.redeemedAt}
					{#if redeemedAt !== undefined && redeemedAt !== null}
						<div>
							<dt>redeemed AT</dt>
							<dd>
								<Timestamp timestamp={Number(redeemedAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<ResourceBoundary
			resource={
				selection({
					fields: {
						encodedToken: true,
					},
				})
			}
		>
			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const encodedToken = resolvedEntity.encodedToken}
				{#if encodedToken !== undefined && encodedToken !== null && encodedToken !== ''}
					<code>{String((encodedToken) ?? '')}</code>
				{:else}
					<p data-text="muted">No encoded token available.</p>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<BlockheadCashuProofsView
				selection={selection.$$proofs}
				title='proofs'
				emptyText='No proofs found.'
				id='BlockheadCashuProofsView-proofs'
			/>
		{/if}
	{/snippet}
</EntityView>

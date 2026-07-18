<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


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
			selection: RegisteredEntityProxyResource<EntityType.BlockheadCashuToken>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.BlockheadCashuToken>>
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
		sources: selection.sources,
		fields: {
			status: true,
			totalAmount: true,
			unit: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.id) ?? '')].filter(Boolean).join(' ') || 'blockhead Cashu token')
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
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{[String((pendingEntity.id) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
		{:else}
			<ResourceBoundary resource={blockheadCashuToken}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.id) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
					{@const status0 = pendingEntity.status}
					{#if status0 !== undefined && status0 !== null}
						{String((status0) ?? '')}
					{/if}
					{@const totalAmount1 = pendingEntity.totalAmount}
					{#if totalAmount1 !== undefined && totalAmount1 !== null}
						<NumberValue
							value={totalAmount1}
						/>

						<span>{pendingEntity.unit == null ? '' : ` ${String(pendingEntity.unit)}`}</span>
					{/if}
		{:else}
			<ResourceBoundary resource={blockheadCashuToken}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const status0 = resolvedEntity.status}
					{#if status0 !== undefined && status0 !== null}
						{String((status0) ?? '')}
					{/if}
					{@const totalAmount1 = resolvedEntity.totalAmount}
					{#if totalAmount1 !== undefined && totalAmount1 !== null}
						<NumberValue
							value={totalAmount1}
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
				<dt>ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									id: true,
								},
							})
						}
					>
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
								sources: selection.sources,
								fields: {
									tokenVersion: true,
								},
							})
						}
					>
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
								sources: selection.sources,
								fields: {
									status: true,
								},
							})
						}
					>
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
						sources: selection.sources,
						fields: {
							unit: true,
						},
					})
				}
			>
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
						sources: selection.sources,
						fields: {
							memo: true,
						},
					})
				}
			>
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
						sources: selection.sources,
						fields: {
							proofCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const proofCount = resolvedEntity.proofCount}
					{#if proofCount !== undefined && proofCount !== null}
						<div>
							<dt>proof count</dt>
							<dd>
								<NumberValue
									value={proofCount}
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
							totalAmount: true,
							unit: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const totalAmount = resolvedEntity.totalAmount}
					{#if totalAmount !== undefined && totalAmount !== null}
						<div>
							<dt>total amount</dt>
							<dd>
								<NumberValue
									value={totalAmount}
								/>

								<span>{({ value: totalAmount, ...resolvedEntity }).unit == null ? '' : ` ${String(({ value: totalAmount, ...resolvedEntity }).unit)}`}</span>
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
								sources: selection.sources,
								fields: {
									importedAt: true,
								},
							})
						}
					>
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
						sources: selection.sources,
						fields: {
							redeemedAt: true,
						},
					})
				}
			>
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
					sources: selection.sources,
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
				selection={
						selection.$$proofs({
							count: true,
						})
					}
				title='proofs'
				emptyText='No proofs found.'
				id='BlockheadCashuProofsView-proofs'
			/>
		{/if}
	{/snippet}
</EntityView>

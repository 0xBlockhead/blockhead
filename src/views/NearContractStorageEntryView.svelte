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
			selection: RegisteredEntityProxyResource<EntityType.NearContractStorageEntry>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.NearContractStorageEntry>>
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
	const nearContractStorageEntry = $derived(selection({
		sources: [
			Source.NearRpc_JsonRpc,
		],
		fields: {
			valueHash: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.keyBase64) ?? '')].filter(Boolean).join(' ') || 'near contract storage entry')
	const viewDomId = $derived('near-contract-storage-entry-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NearContractView from '$/views/NearContractView.svelte'
</script>


<EntityView
	entityType={EntityType.NearContractStorageEntry}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={nearContractStorageEntry}>
			{#snippet Pending()}
				{@const keyBase640 = pendingEntity.keyBase64}
				{#if keyBase640 !== undefined && keyBase640 !== null}
					<TruncatedValue value={String((keyBase640) ?? '')} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const keyBase640 = resolvedEntity.keyBase64}
				{#if keyBase640 !== undefined && keyBase640 !== null}
					<TruncatedValue value={String((keyBase640) ?? '')} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={nearContractStorageEntry}>
			{#snippet Pending()}
				{@const valueHash0 = pendingEntity.valueHash}
				{#if valueHash0 !== undefined && valueHash0 !== null}
					<TruncatedValue value={String((valueHash0) ?? '')} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const valueHash0 = resolvedEntity.valueHash}
				{#if valueHash0 !== undefined && valueHash0 !== null}
					<TruncatedValue value={String((valueHash0) ?? '')} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={nearContractStorageEntry}>
			{#snippet Pending()}
				{@const blockHeight0 = pendingEntity.blockHeight}
				{#if blockHeight0 !== undefined && blockHeight0 !== null}
					<span data-text="muted">
						<NumberValue value={Number(blockHeight0)} />
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const blockHeight0 = resolvedEntity.blockHeight}
				{#if blockHeight0 !== undefined && blockHeight0 !== null}
					<span data-text="muted">
						<NumberValue value={Number(blockHeight0)} />
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Contract</dt>
				<dd>
					<NearContractView
						selection={select(EntityType.NearContract, selection.entitySelector.$contract, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Key base64</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									keyBase64: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const keyBase64 = pendingEntity.keyBase64}
							{#if keyBase64 !== undefined && keyBase64 !== null}
								<TruncatedValue value={String((keyBase64) ?? '')} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const keyBase64 = resolvedEntity.keyBase64}
							{#if keyBase64 !== undefined && keyBase64 !== null}
								<TruncatedValue value={String((keyBase64) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Block height</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									blockHeight: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const blockHeight = pendingEntity.blockHeight}
							{#if blockHeight !== undefined && blockHeight !== null}
								<NumberValue value={Number(blockHeight)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const blockHeight = resolvedEntity.blockHeight}
							{#if blockHeight !== undefined && blockHeight !== null}
								<NumberValue value={Number(blockHeight)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									source: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const source = pendingEntity.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const source = resolvedEntity.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

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
					{@const blockHash = pendingEntity.blockHash}
					{#if blockHash !== undefined && blockHash !== null}
						<div>
							<dt>Block hash</dt>
							<dd>
								<TruncatedValue value={String((blockHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const blockHash = resolvedEntity.blockHash}
					{#if blockHash !== undefined && blockHash !== null}
						<div>
							<dt>Block hash</dt>
							<dd>
								<TruncatedValue value={String((blockHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							valueBase64: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const valueBase64 = pendingEntity.valueBase64}
					{#if valueBase64 !== undefined && valueBase64 !== null}
						<div>
							<dt>Value base64</dt>
							<dd>
								<span data-text="long-text">{String((valueBase64) ?? '')}</span>
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const valueBase64 = resolvedEntity.valueBase64}
					{#if valueBase64 !== undefined && valueBase64 !== null}
						<div>
							<dt>Value base64</dt>
							<dd>
								<span data-text="long-text">{String((valueBase64) ?? '')}</span>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							valueHash: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const valueHash = pendingEntity.valueHash}
					{#if valueHash !== undefined && valueHash !== null}
						<div>
							<dt>Value hash</dt>
							<dd>
								<TruncatedValue value={String((valueHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const valueHash = resolvedEntity.valueHash}
					{#if valueHash !== undefined && valueHash !== null}
						<div>
							<dt>Value hash</dt>
							<dd>
								<TruncatedValue value={String((valueHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							prefixBase64: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const prefixBase64 = pendingEntity.prefixBase64}
					{#if prefixBase64 !== undefined && prefixBase64 !== null}
						<div>
							<dt>Prefix base64</dt>
							<dd>
								<TruncatedValue value={String((prefixBase64) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const prefixBase64 = resolvedEntity.prefixBase64}
					{#if prefixBase64 !== undefined && prefixBase64 !== null}
						<div>
							<dt>Prefix base64</dt>
							<dd>
								<TruncatedValue value={String((prefixBase64) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							deleted: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const deleted = pendingEntity.deleted}
					{#if deleted !== undefined && deleted !== null}
						<div>
							<dt>Deleted</dt>
							<dd>
								{deleted ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const deleted = resolvedEntity.deleted}
					{#if deleted !== undefined && deleted !== null}
						<div>
							<dt>Deleted</dt>
							<dd>
								{deleted ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>

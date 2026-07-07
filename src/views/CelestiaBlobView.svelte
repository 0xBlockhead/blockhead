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
			selection: EntityProxyResource<typeof schema, EntityType.CelestiaBlob>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.CelestiaBlob>>
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
	const celestiaBlob = $derived(selection({}))
	const titleFallback = $derived([String((selection.entitySelector.commitment ?? prefetched.commitment) ?? '')].filter(Boolean).join(' ') || 'celestia blob')
	const viewDomId = $derived('celestia-blob-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import CelestiaNamespaceView from '$/views/CelestiaNamespaceView.svelte'
	import CelestiaBlockView from '$/views/CelestiaBlockView.svelte'
</script>


<EntityView
	entityType={EntityType.CelestiaBlob}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={celestiaBlob}>
			{#snippet Pending()}
				{@const commitment0 = selection.entitySelector.commitment ?? prefetched.commitment}
				{#if commitment0 !== undefined && commitment0 !== null}
					<TruncatedValue value={String((commitment0) ?? '')} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const commitment0 = resolvedEntity.commitment}
				{#if commitment0 !== undefined && commitment0 !== null}
					<TruncatedValue value={String((commitment0) ?? '')} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={celestiaBlob}>
			{#snippet Pending()}
				{@const height0 = selection.entitySelector.height ?? prefetched.height}
				{#if height0 !== undefined && height0 !== null}
					<NumberValue value={Number(height0)} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const height0 = resolvedEntity.height}
				{#if height0 !== undefined && height0 !== null}
					<NumberValue value={Number(height0)} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={celestiaBlob}>
			{#snippet Pending()}
				<span data-text="muted">
					<CelestiaNamespaceView
						selection={select(EntityType.CelestiaNamespace, selection.entitySelector.$namespace)}
						layout={EntityLayout.Title}
						open={false}
					/>
				</span>
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<span data-text="muted">
					<CelestiaNamespaceView
						selection={select(EntityType.CelestiaNamespace, selection.entitySelector.$namespace)}
						layout={EntityLayout.Title}
						open={false}
					/>
				</span>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Namespace</dt>
				<dd>
					<CelestiaNamespaceView
						selection={select(EntityType.CelestiaNamespace, selection.entitySelector.$namespace, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Height</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									height: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const height = selection.entitySelector.height ?? prefetched.height}
							{#if height !== undefined && height !== null}
								<NumberValue value={Number(height)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const height = resolvedEntity.height}
							{#if height !== undefined && height !== null}
								<NumberValue value={Number(height)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>commitment</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									commitment: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const commitment = selection.entitySelector.commitment ?? prefetched.commitment}
							{#if commitment !== undefined && commitment !== null}
								<TruncatedValue value={String((commitment) ?? '')} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const commitment = resolvedEntity.commitment}
							{#if commitment !== undefined && commitment !== null}
								<TruncatedValue value={String((commitment) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							dataHash: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const dataHash = prefetched.dataHash}
					{#if dataHash !== undefined && dataHash !== null}
						<div>
							<dt>data hash</dt>
							<dd>
								<TruncatedValue value={String((dataHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const dataHash = resolvedEntity.dataHash}
					{#if dataHash !== undefined && dataHash !== null}
						<div>
							<dt>data hash</dt>
							<dd>
								<TruncatedValue value={String((dataHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							shareVersion: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const shareVersion = prefetched.shareVersion}
					{#if shareVersion !== undefined && shareVersion !== null}
						<div>
							<dt>share version</dt>
							<dd>
								<NumberValue value={Number(shareVersion)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const shareVersion = resolvedEntity.shareVersion}
					{#if shareVersion !== undefined && shareVersion !== null}
						<div>
							<dt>share version</dt>
							<dd>
								<NumberValue value={Number(shareVersion)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							index: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const index = prefetched.index}
					{#if index !== undefined && index !== null}
						<div>
							<dt>index</dt>
							<dd>
								<NumberValue value={Number(index)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const index = resolvedEntity.index}
					{#if index !== undefined && index !== null}
						<div>
							<dt>index</dt>
							<dd>
								<NumberValue value={Number(index)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							sizeBytes: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const sizeBytes = prefetched.sizeBytes}
					{#if sizeBytes !== undefined && sizeBytes !== null}
						<div>
							<dt>size bytes</dt>
							<dd>
								<NumberValue value={Number(sizeBytes)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const sizeBytes = resolvedEntity.sizeBytes}
					{#if sizeBytes !== undefined && sizeBytes !== null}
						<div>
							<dt>size bytes</dt>
							<dd>
								<NumberValue value={Number(sizeBytes)} />
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
							signer: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const signer = prefetched.signer}
					{#if signer !== undefined && signer !== null}
						<div>
							<dt>signer</dt>
							<dd>
								{String((signer) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const signer = resolvedEntity.signer}
					{#if signer !== undefined && signer !== null}
						<div>
							<dt>signer</dt>
							<dd>
								{String((signer) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							txHash: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const txHash = prefetched.txHash}
					{#if txHash !== undefined && txHash !== null}
						<div>
							<dt>Transaction hash</dt>
							<dd>
								<TruncatedValue value={String((txHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const txHash = resolvedEntity.txHash}
					{#if txHash !== undefined && txHash !== null}
						<div>
							<dt>Transaction hash</dt>
							<dd>
								<TruncatedValue value={String((txHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.CelestiaBlock, false>('$block')}
			>
				{#snippet children(celestiaBlock)}
					{#if celestiaBlock != null && celestiaBlock[EntityMetaKey.Selector] != null}
						<div>
							<dt>block</dt>
							<dd>
								<CelestiaBlockView
									selection={select(EntityType.CelestiaBlock, celestiaBlock[EntityMetaKey.Selector])}
									prefetched={celestiaBlock}
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
							shareProofAvailable: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const shareProofAvailable = prefetched.shareProofAvailable}
					{#if shareProofAvailable !== undefined && shareProofAvailable !== null}
						<div>
							<dt>share proof available</dt>
							<dd>
								{shareProofAvailable ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const shareProofAvailable = resolvedEntity.shareProofAvailable}
					{#if shareProofAvailable !== undefined && shareProofAvailable !== null}
						<div>
							<dt>share proof available</dt>
							<dd>
								{shareProofAvailable ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							payloadRequested: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const payloadRequested = prefetched.payloadRequested}
					{#if payloadRequested !== undefined && payloadRequested !== null}
						<div>
							<dt>payload requested</dt>
							<dd>
								{payloadRequested ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const payloadRequested = resolvedEntity.payloadRequested}
					{#if payloadRequested !== undefined && payloadRequested !== null}
						<div>
							<dt>payload requested</dt>
							<dd>
								{payloadRequested ? 'Yes' : 'No'}
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
						blobData: true,
					},
				})
			}
		>
			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const blobData = resolvedEntity.blobData}
				{#if blobData !== undefined && blobData !== null && blobData !== ''}
					<code>{String((blobData) ?? '')}</code>
				{:else}
					<p data-text="muted">No blob data available.</p>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>

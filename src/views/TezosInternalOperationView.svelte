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
			selection: EntityProxyResource<typeof schema, EntityType.TezosInternalOperation>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.TezosInternalOperation>>
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
	const tezosInternalOperation = $derived(selection({}))
	const titleFallback = $derived('tezos internal operation')
	const viewDomId = $derived('tezos-internal-operation-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import TezosOperationView from '$/views/TezosOperationView.svelte'
</script>


<EntityView
	entityType={EntityType.TezosInternalOperation}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={tezosInternalOperation}>
			{#snippet Pending()}
				{title || 'tezos internal operation'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>parent operation</dt>
				<dd>
					<TezosOperationView
						selection={select(EntityType.TezosOperation, selection.entitySelector.$parentOperation, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>internal index</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									internalIndex: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const internalIndex = selection.entitySelector.internalIndex ?? prefetched.internalIndex}
							{#if internalIndex !== undefined && internalIndex !== null}
								{String((internalIndex) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const internalIndex = resolvedEntity.internalIndex}
							{#if internalIndex !== undefined && internalIndex !== null}
								{String((internalIndex) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>operation kind</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									operationKind: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const operationKind = prefetched.operationKind}
							{#if operationKind !== undefined && operationKind !== null}
								{String((operationKind) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const operationKind = resolvedEntity.operationKind}
							{#if operationKind !== undefined && operationKind !== null}
								{String((operationKind) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							sourceAddress: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const sourceAddress = prefetched.sourceAddress}
					{#if sourceAddress !== undefined && sourceAddress !== null}
						<div>
							<dt>source address</dt>
							<dd>
								<TruncatedValue value={String((sourceAddress) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const sourceAddress = resolvedEntity.sourceAddress}
					{#if sourceAddress !== undefined && sourceAddress !== null}
						<div>
							<dt>source address</dt>
							<dd>
								<TruncatedValue value={String((sourceAddress) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							destinationAddress: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const destinationAddress = prefetched.destinationAddress}
					{#if destinationAddress !== undefined && destinationAddress !== null}
						<div>
							<dt>destination address</dt>
							<dd>
								<TruncatedValue value={String((destinationAddress) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const destinationAddress = resolvedEntity.destinationAddress}
					{#if destinationAddress !== undefined && destinationAddress !== null}
						<div>
							<dt>destination address</dt>
							<dd>
								<TruncatedValue value={String((destinationAddress) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							amountMutez: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const amountMutez = prefetched.amountMutez}
					{#if amountMutez !== undefined && amountMutez !== null}
						<div>
							<dt>amount mutez</dt>
							<dd>
								{String((amountMutez) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const amountMutez = resolvedEntity.amountMutez}
					{#if amountMutez !== undefined && amountMutez !== null}
						<div>
							<dt>amount mutez</dt>
							<dd>
								{String((amountMutez) ?? '')}
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
					{@const nonce = prefetched.nonce}
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

			<ResourceBoundary
				resource={
					selection({
						fields: {
							resultStatus: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const resultStatus = prefetched.resultStatus}
					{#if resultStatus !== undefined && resultStatus !== null}
						<div>
							<dt>result status</dt>
							<dd>
								{String((resultStatus) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const resultStatus = resolvedEntity.resultStatus}
					{#if resultStatus !== undefined && resultStatus !== null}
						<div>
							<dt>result status</dt>
							<dd>
								{String((resultStatus) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							consumedGas: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const consumedGas = prefetched.consumedGas}
					{#if consumedGas !== undefined && consumedGas !== null}
						<div>
							<dt>consumed gas</dt>
							<dd>
								{String((consumedGas) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const consumedGas = resolvedEntity.consumedGas}
					{#if consumedGas !== undefined && consumedGas !== null}
						<div>
							<dt>consumed gas</dt>
							<dd>
								{String((consumedGas) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>

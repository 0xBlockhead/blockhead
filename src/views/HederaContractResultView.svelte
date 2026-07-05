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
			selection: EntityProxyResource<typeof schema, EntityType.HederaContractResult>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.HederaContractResult>>
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
	const hederaContractResult = $derived(selection({}))
	const titleFallback = $derived('hedera contract result')
	const viewDomId = $derived('hedera-contract-result-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import HederaTransactionView from '$/views/HederaTransactionView.svelte'
	import HederaContractView from '$/views/HederaContractView.svelte'
</script>


<EntityView
	entityType={EntityType.HederaContractResult}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={hederaContractResult}>
			{#snippet Pending()}
				{title || 'hedera contract result'}
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
				<dt>transaction</dt>
				<dd>
					<HederaTransactionView
						selection={select(EntityType.HederaTransaction, selection.entitySelector.$transaction)}
						layout={EntityLayout.Title}
						open={false}
					/>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.HederaContract, false>('$contract')}
			>
				{#snippet children(hederaContract)}
					{#if hederaContract != null && hederaContract[EntityMetaKey.Selector] != null}
						<div>
							<dt>contract</dt>
							<dd>
								<HederaContractView
									selection={select(EntityType.HederaContract, hederaContract[EntityMetaKey.Selector])}
									prefetched={hederaContract}
									layout={EntityLayout.Title}
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
							contractId: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const contractId = prefetched.contractId}
					{#if contractId !== undefined && contractId !== null}
						<div>
							<dt>contract ID</dt>
							<dd>
								{String((contractId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const contractId = resolvedEntity.contractId}
					{#if contractId !== undefined && contractId !== null}
						<div>
							<dt>contract ID</dt>
							<dd>
								{String((contractId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							evmAddress: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const evmAddress = prefetched.evmAddress}
					{#if evmAddress !== undefined && evmAddress !== null}
						<div>
							<dt>EVM address</dt>
							<dd>
								<TruncatedValue value={String((evmAddress) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const evmAddress = resolvedEntity.evmAddress}
					{#if evmAddress !== undefined && evmAddress !== null}
						<div>
							<dt>EVM address</dt>
							<dd>
								<TruncatedValue value={String((evmAddress) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							ethereumHash: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const ethereumHash = prefetched.ethereumHash}
					{#if ethereumHash !== undefined && ethereumHash !== null}
						<div>
							<dt>ethereum hash</dt>
							<dd>
								<TruncatedValue value={String((ethereumHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const ethereumHash = resolvedEntity.ethereumHash}
					{#if ethereumHash !== undefined && ethereumHash !== null}
						<div>
							<dt>ethereum hash</dt>
							<dd>
								<TruncatedValue value={String((ethereumHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							functionParameters: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const functionParameters = prefetched.functionParameters}
					{#if functionParameters !== undefined && functionParameters !== null}
						<div>
							<dt>function parameters</dt>
							<dd>
								{String((functionParameters) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const functionParameters = resolvedEntity.functionParameters}
					{#if functionParameters !== undefined && functionParameters !== null}
						<div>
							<dt>function parameters</dt>
							<dd>
								{String((functionParameters) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							gasLimit: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const gasLimit = prefetched.gasLimit}
					{#if gasLimit !== undefined && gasLimit !== null}
						<div>
							<dt>gas limit</dt>
							<dd>
								{String((gasLimit) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const gasLimit = resolvedEntity.gasLimit}
					{#if gasLimit !== undefined && gasLimit !== null}
						<div>
							<dt>gas limit</dt>
							<dd>
								{String((gasLimit) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							gasUsed: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const gasUsed = prefetched.gasUsed}
					{#if gasUsed !== undefined && gasUsed !== null}
						<div>
							<dt>gas used</dt>
							<dd>
								{String((gasUsed) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const gasUsed = resolvedEntity.gasUsed}
					{#if gasUsed !== undefined && gasUsed !== null}
						<div>
							<dt>gas used</dt>
							<dd>
								{String((gasUsed) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							amountTinybar: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const amountTinybar = prefetched.amountTinybar}
					{#if amountTinybar !== undefined && amountTinybar !== null}
						<div>
							<dt>amount tinybar</dt>
							<dd>
								{String((amountTinybar) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const amountTinybar = resolvedEntity.amountTinybar}
					{#if amountTinybar !== undefined && amountTinybar !== null}
						<div>
							<dt>amount tinybar</dt>
							<dd>
								{String((amountTinybar) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

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
						<div>
							<dt>status</dt>
							<dd>
								{String((status) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const status = resolvedEntity.status}
					{#if status !== undefined && status !== null}
						<div>
							<dt>status</dt>
							<dd>
								{String((status) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							errorMessage: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const errorMessage = prefetched.errorMessage}
					{#if errorMessage !== undefined && errorMessage !== null}
						<div>
							<dt>error message</dt>
							<dd>
								{String((errorMessage) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const errorMessage = resolvedEntity.errorMessage}
					{#if errorMessage !== undefined && errorMessage !== null}
						<div>
							<dt>error message</dt>
							<dd>
								{String((errorMessage) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							bloom: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const bloom = prefetched.bloom}
					{#if bloom !== undefined && bloom !== null}
						<div>
							<dt>bloom</dt>
							<dd>
								{String((bloom) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const bloom = resolvedEntity.bloom}
					{#if bloom !== undefined && bloom !== null}
						<div>
							<dt>bloom</dt>
							<dd>
								{String((bloom) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>

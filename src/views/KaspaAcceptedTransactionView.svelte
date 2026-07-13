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
			selection: EntityProxyResource<typeof schema, EntityType.KaspaAcceptedTransaction>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.KaspaAcceptedTransaction>>
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
	const kaspaAcceptedTransaction = $derived(selection({
		sources: [
			Source.KaspaNode_Grpc,
			Source.KaspaNode_Wrpc,
		],
	}))
	const titleFallback = $derived('kaspa accepted transaction')
	const viewDomId = $derived('kaspa-accepted-transaction-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import KaspaBlockView from '$/views/KaspaBlockView.svelte'
	import KaspaTransactionView from '$/views/KaspaTransactionView.svelte'
</script>


<EntityView
	entityType={EntityType.KaspaAcceptedTransaction}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={kaspaAcceptedTransaction}>
			{#snippet Pending()}
				{title || 'kaspa accepted transaction'}
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
				<dt>accepting block</dt>
				<dd>
					<KaspaBlockView
						selection={select(EntityType.KaspaBlock, selection.entitySelector.$acceptingBlock, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>transaction</dt>
				<dd>
					<KaspaTransactionView
						selection={select(EntityType.KaspaTransaction, selection.entitySelector.$transaction, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							acceptedIndex: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const acceptedIndex = pendingEntity.acceptedIndex}
					{#if acceptedIndex !== undefined && acceptedIndex !== null}
						<div>
							<dt>accepted index</dt>
							<dd>
								<NumberValue value={Number(acceptedIndex)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const acceptedIndex = resolvedEntity.acceptedIndex}
					{#if acceptedIndex !== undefined && acceptedIndex !== null}
						<div>
							<dt>accepted index</dt>
							<dd>
								<NumberValue value={Number(acceptedIndex)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>accepting block hash</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									acceptingBlockHash: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const acceptingBlockHash = pendingEntity.acceptingBlockHash}
							{#if acceptingBlockHash !== undefined && acceptingBlockHash !== null}
								<TruncatedValue value={String((acceptingBlockHash) ?? '')} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const acceptingBlockHash = resolvedEntity.acceptingBlockHash}
							{#if acceptingBlockHash !== undefined && acceptingBlockHash !== null}
								<TruncatedValue value={String((acceptingBlockHash) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>transaction ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									transactionId: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const transactionId = pendingEntity.transactionId}
							{#if transactionId !== undefined && transactionId !== null}
								{String((transactionId) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const transactionId = resolvedEntity.transactionId}
							{#if transactionId !== undefined && transactionId !== null}
								{String((transactionId) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>

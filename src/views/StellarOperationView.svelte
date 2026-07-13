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
			selection: EntityProxyResource<typeof schema, EntityType.StellarOperation>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.StellarOperation>>
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
	const stellarOperation = $derived(selection({}))
	const titleFallback = $derived('stellar operation')
	const viewDomId = $derived('stellar-operation-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import StellarTransactionView from '$/views/StellarTransactionView.svelte'
</script>


<EntityView
	entityType={EntityType.StellarOperation}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={stellarOperation}>
			{#snippet Pending()}
				{title || 'stellar operation'}
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
					<StellarTransactionView
						selection={select(EntityType.StellarTransaction, selection.entitySelector.$transaction, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>operation index</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									operationIndex: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const operationIndex = pendingEntity.operationIndex}
							{#if operationIndex !== undefined && operationIndex !== null}
								{String((operationIndex) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const operationIndex = resolvedEntity.operationIndex}
							{#if operationIndex !== undefined && operationIndex !== null}
								{String((operationIndex) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>operation type</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									operationType: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const operationType = pendingEntity.operationType}
							{#if operationType !== undefined && operationType !== null}
								{String((operationType) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const operationType = resolvedEntity.operationType}
							{#if operationType !== undefined && operationType !== null}
								{String((operationType) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							sourceAccount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const sourceAccount = pendingEntity.sourceAccount}
					{#if sourceAccount !== undefined && sourceAccount !== null}
						<div>
							<dt>source account</dt>
							<dd>
								<TruncatedValue value={String((sourceAccount) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const sourceAccount = resolvedEntity.sourceAccount}
					{#if sourceAccount !== undefined && sourceAccount !== null}
						<div>
							<dt>source account</dt>
							<dd>
								<TruncatedValue value={String((sourceAccount) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							resultCode: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const resultCode = pendingEntity.resultCode}
					{#if resultCode !== undefined && resultCode !== null}
						<div>
							<dt>result code</dt>
							<dd>
								{String((resultCode) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const resultCode = resolvedEntity.resultCode}
					{#if resultCode !== undefined && resultCode !== null}
						<div>
							<dt>result code</dt>
							<dd>
								{String((resultCode) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>

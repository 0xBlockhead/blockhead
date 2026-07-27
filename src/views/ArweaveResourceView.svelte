<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.ArweaveResource> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const arweaveResource = $derived(selection({
		fields: {
			canonicalUri: true,
		},
	}))
	const titleFallback = $derived((pendingEntity.canonicalUri ?? '') || (pendingEntity.transactionId ?? '') || 'arweave resource')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import ArweaveResource_TimestampsView from '$/views/ArweaveResource_TimestampsView.svelte'
	import ArweaveTransactionView from '$/views/ArweaveTransactionView.svelte'
</script>


<EntityView
	entityType={EntityType.ArweaveResource}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={arweaveResource}>
			{#snippet children(entity)}
				{entity.canonicalUri || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		{(pendingEntity.contentPath ?? '') || (pendingEntity.canonicalUri ?? '') || titleFallback}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>transaction ID</dt>
				<dd>
					<TruncatedValue value={pendingEntity.transactionId} />
				</dd>
			</div>

			<div>
				<dt>content path</dt>
				<dd>
					{pendingEntity.contentPath}
				</dd>
			</div>

			<div>
				<dt>canonical URI</dt>
				<dd>
					<ResourceBoundary
						resource={arweaveResource}
					>
						{#snippet children(entity)}
							<a
								href={String(entity.canonicalUri)}
								target="_blank"
								rel="noreferrer noopener"
							>
								<TruncatedValue value={String(entity.canonicalUri)} />
							</a>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$transaction}
			>
				{#snippet children(arweaveTransaction)}
					{#if arweaveTransaction != null}
						<div>
							<dt>transaction</dt>
							<dd>
								<ArweaveTransactionView
									selection={select(EntityType.ArweaveTransaction, arweaveTransaction[EntityMetaKey.Selector])}
									prefetched={arweaveTransaction}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const arweaveResourceArweaveResourceTimestampsViewTimestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={arweaveResourceArweaveResourceTimestampsViewTimestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<ArweaveResource_TimestampsView
						selection={arweaveResourceArweaveResourceTimestampsViewTimestampsResource}
						countResource={arweaveResourceArweaveResourceTimestampsViewTimestampsResource.count}
						title='timestamps'
						id='timestamps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>

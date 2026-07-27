<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
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
	}: EntitySelectionViewProps<EntityType.AptosTableItem> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const aptosTableItem = $derived(selection({
		fields: {
			keyType: true,
			valueType: true,
		},
	}))
	const titleFallback = $derived((pendingEntity.keyHash ?? '') || 'aptos table item')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import AptosTableItem_TimestampsView from '$/views/AptosTableItem_TimestampsView.svelte'
	import AptosNetworkView from '$/views/AptosNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.AptosTableItem}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<TruncatedValue value={pendingEntity.keyHash} />
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={aptosTableItem}>
			{#snippet children(entity)}
				{[(entity.keyType ?? ''), (entity.valueType ?? '')].filter(Boolean).join(' ') || pendingEntity.keyHash || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<AptosNetworkView
						selection={select(EntityType.AptosNetwork, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>table handle</dt>
				<dd>
					{pendingEntity.tableHandle}
				</dd>
			</div>

			<div>
				<dt>key hash</dt>
				<dd>
					<TruncatedValue value={pendingEntity.keyHash} />
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={aptosTableItem}
			>
				{#snippet children(entity)}
					{@const keyType = entity.keyType}
					{#if keyType != null}
						<div>
							<dt>key type</dt>
							<dd>
								{keyType}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={aptosTableItem}
			>
				{#snippet children(entity)}
					{@const valueType = entity.valueType}
					{#if valueType != null}
						<div>
							<dt>value type</dt>
							<dd>
								{valueType}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const aptosTableItemAptosTableItemTimestampsViewTimestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={aptosTableItemAptosTableItemTimestampsViewTimestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<AptosTableItem_TimestampsView
						selection={aptosTableItemAptosTableItemTimestampsViewTimestampsResource}
						countResource={aptosTableItemAptosTableItemTimestampsViewTimestampsResource.count}
						title='timestamps'
						id='timestamps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>

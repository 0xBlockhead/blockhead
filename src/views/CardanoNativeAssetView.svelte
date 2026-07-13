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
			selection: EntityProxyResource<typeof schema, EntityType.CardanoNativeAsset>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.CardanoNativeAsset>>
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
	const cardanoNativeAsset = $derived(selection({}))
	const titleFallback = $derived('Cardano native asset')
	const viewDomId = $derived('cardano-native-asset-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import CardanoNetworkView from '$/views/CardanoNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.CardanoNativeAsset}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={cardanoNativeAsset}>
			{#snippet Pending()}
				{title || 'Cardano native asset'}
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
				<dt>network</dt>
				<dd>
					<CardanoNetworkView
						selection={select(EntityType.CardanoNetwork, selection.entitySelector.$network, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>policy ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									policyId: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const policyId = pendingEntity.policyId}
							{#if policyId !== undefined && policyId !== null}
								{String((policyId) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const policyId = resolvedEntity.policyId}
							{#if policyId !== undefined && policyId !== null}
								{String((policyId) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>asset name</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									assetName: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const assetName = pendingEntity.assetName}
							{#if assetName !== undefined && assetName !== null}
								{String((assetName) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const assetName = resolvedEntity.assetName}
							{#if assetName !== undefined && assetName !== null}
								{String((assetName) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							fingerprint: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const fingerprint = pendingEntity.fingerprint}
					{#if fingerprint !== undefined && fingerprint !== null}
						<div>
							<dt>fingerprint</dt>
							<dd>
								{String((fingerprint) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const fingerprint = resolvedEntity.fingerprint}
					{#if fingerprint !== undefined && fingerprint !== null}
						<div>
							<dt>fingerprint</dt>
							<dd>
								{String((fingerprint) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>

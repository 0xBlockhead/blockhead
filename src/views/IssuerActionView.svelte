<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


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
			selection: RegisteredEntityProxyResource<EntityType.IssuerAction>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.IssuerAction>>
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
	const issuerAction = $derived(selection({
		sources: selection.sources,
	}))
	const titleFallback = $derived('issuer action')
	const viewDomId = $derived('issuer-action-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import AssetInstanceView from '$/views/AssetInstanceView.svelte'
	import IssuerPowerView from '$/views/IssuerPowerView.svelte'
</script>


<EntityView
	entityType={EntityType.IssuerAction}
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
			{title || titleFallback}
		{:else}
			<ResourceBoundary resource={issuerAction}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>issuer action ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									issuerActionId: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const issuerActionId = resolvedEntity.issuerActionId}
							{#if issuerActionId !== undefined && issuerActionId !== null}
								<TruncatedValue value={String((issuerActionId) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>action kind</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									actionKind: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const actionKind = resolvedEntity.actionKind}
							{#if actionKind !== undefined && actionKind !== null}
								{String((actionKind) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>asset instance</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$assetInstance}
					>
						{#snippet children(assetInstance)}
							{#if assetInstance != null && assetInstance[EntityMetaKey.Selector] != null}
								<AssetInstanceView
									selection={select(EntityType.AssetInstance, assetInstance[EntityMetaKey.Selector])}
									prefetched={assetInstance}
									href={
										(assetInstance[EntityMetaKey.Selector].kind !== undefined && assetInstance[EntityMetaKey.Selector].assetKey !== undefined && assetInstance[EntityMetaKey.Selector].$network !== undefined && assetInstance[EntityMetaKey.Selector].$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/asset/[kind=stringSegment]/[assetKey=stringSegment]', {
											kind: String(assetInstance[EntityMetaKey.Selector].kind ?? ''),
											assetKey: String(assetInstance[EntityMetaKey.Selector].assetKey ?? ''),
											network: String(caip2StringFromValue(assetInstance[EntityMetaKey.Selector].$network.caip2) ?? ''),
										}) : assetInstance[EntityMetaKey.Selector].kind !== undefined && assetInstance[EntityMetaKey.Selector].assetKey !== undefined && assetInstance[EntityMetaKey.Selector].$network !== undefined && assetInstance[EntityMetaKey.Selector].$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/asset/[kind=stringSegment]/[assetKey=stringSegment]', {
											kind: String(assetInstance[EntityMetaKey.Selector].kind ?? ''),
											assetKey: String(assetInstance[EntityMetaKey.Selector].assetKey ?? ''),
											network: String(assetInstance[EntityMetaKey.Selector].$network.slug ?? ''),
										}) : undefined)
									}
									layout={EntityLayout.Value}
									open={false}
								/>
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
						sources: selection.sources,
						fields: {
							amount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const amount = resolvedEntity.amount}
					{#if amount !== undefined && amount !== null}
						<div>
							<dt>amount</dt>
							<dd>
								{String((amount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$issuerPower}
			>
				{#snippet children(issuerPower)}
					{#if issuerPower != null && issuerPower[EntityMetaKey.Selector] != null}
						<div>
							<dt>issuer power</dt>
							<dd>
								<IssuerPowerView
									selection={select(EntityType.IssuerPower, issuerPower[EntityMetaKey.Selector])}
									prefetched={issuerPower}
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
</EntityView>

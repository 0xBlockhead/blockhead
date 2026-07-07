<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
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
			selection: EntityProxyResource<typeof schema, EntityType.RegulatedAssetProfile>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.RegulatedAssetProfile>>
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
	const regulatedAssetProfile = $derived(selection({
		fields: {
			standard: true,
		},
	}))
	const titleFallback = $derived([String((prefetched.standard) ?? '')].filter(Boolean).join(' ') || 'regulated asset profile')
	const viewDomId = $derived('regulated-asset-profile-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import RegulatedAssetProfile_TimestampsView from '$/views/RegulatedAssetProfile_TimestampsView.svelte'
	import IssuerPowersView from '$/views/IssuerPowersView.svelte'
	import ClaimTopicRequirementsView from '$/views/ClaimTopicRequirementsView.svelte'
	import TrustedIssuersView from '$/views/TrustedIssuersView.svelte'
	import ComplianceModulesView from '$/views/ComplianceModulesView.svelte'
	import TransferRestrictionsView from '$/views/TransferRestrictionsView.svelte'
	import AssetInstanceView from '$/views/AssetInstanceView.svelte'
</script>


<EntityView
	entityType={EntityType.RegulatedAssetProfile}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={regulatedAssetProfile}>
			{#snippet Pending()}
				{[String((prefetched.standard) ?? '')].filter(Boolean).join(' ') || title || 'regulated asset profile'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.standard) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={regulatedAssetProfile}>
			{#snippet Pending()}
				<AssetInstanceView
					selection={select(EntityType.AssetInstance, selection.entitySelector.$assetInstance)}
					href={
						(selection.entitySelector.$assetInstance.$network !== undefined && selection.entitySelector.$assetInstance.$network.caip2 !== undefined && selection.entitySelector.$assetInstance.$network.caip2.namespace !== undefined && selection.entitySelector.$assetInstance.$network !== undefined && selection.entitySelector.$assetInstance.$network.caip2 !== undefined && selection.entitySelector.$assetInstance.$network.caip2.reference !== undefined && selection.entitySelector.$assetInstance.kind !== undefined && selection.entitySelector.$assetInstance.assetKey !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]/asset/[kind]/[assetKey]', {
							caip2: `${String(selection.entitySelector.$assetInstance.$network.caip2.namespace ?? '')}:${String(selection.entitySelector.$assetInstance.$network.caip2.reference ?? '')}`,
							kind: String(selection.entitySelector.$assetInstance.kind ?? ''),
							assetKey: String(selection.entitySelector.$assetInstance.assetKey ?? ''),
						}) : undefined)
					}
					layout={EntityLayout.Value}
					open={false}
				/>
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<AssetInstanceView
					selection={select(EntityType.AssetInstance, selection.entitySelector.$assetInstance)}
					href={
						(selection.entitySelector.$assetInstance.$network !== undefined && selection.entitySelector.$assetInstance.$network.caip2 !== undefined && selection.entitySelector.$assetInstance.$network.caip2.namespace !== undefined && selection.entitySelector.$assetInstance.$network !== undefined && selection.entitySelector.$assetInstance.$network.caip2 !== undefined && selection.entitySelector.$assetInstance.$network.caip2.reference !== undefined && selection.entitySelector.$assetInstance.kind !== undefined && selection.entitySelector.$assetInstance.assetKey !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]/asset/[kind]/[assetKey]', {
							caip2: `${String(selection.entitySelector.$assetInstance.$network.caip2.namespace ?? '')}:${String(selection.entitySelector.$assetInstance.$network.caip2.reference ?? '')}`,
							kind: String(selection.entitySelector.$assetInstance.kind ?? ''),
							assetKey: String(selection.entitySelector.$assetInstance.assetKey ?? ''),
						}) : undefined)
					}
					layout={EntityLayout.Value}
					open={false}
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>asset instance</dt>
				<dd>
					<AssetInstanceView
						selection={select(EntityType.AssetInstance, selection.entitySelector.$assetInstance, {})}
						href={
							(selection.entitySelector.$assetInstance.$network !== undefined && selection.entitySelector.$assetInstance.$network.caip2 !== undefined && selection.entitySelector.$assetInstance.$network.caip2.namespace !== undefined && selection.entitySelector.$assetInstance.$network !== undefined && selection.entitySelector.$assetInstance.$network.caip2 !== undefined && selection.entitySelector.$assetInstance.$network.caip2.reference !== undefined && selection.entitySelector.$assetInstance.kind !== undefined && selection.entitySelector.$assetInstance.assetKey !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]/asset/[kind]/[assetKey]', {
								caip2: `${String(selection.entitySelector.$assetInstance.$network.caip2.namespace ?? '')}:${String(selection.entitySelector.$assetInstance.$network.caip2.reference ?? '')}`,
								kind: String(selection.entitySelector.$assetInstance.kind ?? ''),
								assetKey: String(selection.entitySelector.$assetInstance.assetKey ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>standard</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									standard: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const standard = prefetched.standard}
							{#if standard !== undefined && standard !== null}
								{String((standard) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const standard = resolvedEntity.standard}
							{#if standard !== undefined && standard !== null}
								{String((standard) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<RegulatedAssetProfile_TimestampsView
				selection={selection[EntityProxyField]<EntityType.RegulatedAssetProfile_Timestamp>('$$timestamps')}
				title='timestamps'
				emptyText='No regulated asset profile observations.'
				id='RegulatedAssetProfile_TimestampsView-$$timestamps'
			/>

			<IssuerPowersView
				selection={selection[EntityProxyField]<EntityType.IssuerPower>('$$issuerPowers')}
				title='issuer powers'
				emptyText='No issuer powers.'
				id='IssuerPowersView-$$issuerPowers'
			/>

			<ClaimTopicRequirementsView
				selection={selection[EntityProxyField]<EntityType.ClaimTopicRequirement>('$$claimRequirements')}
				title='claim requirements'
				emptyText='No claim topic requirements.'
				id='ClaimTopicRequirementsView-$$claimRequirements'
			/>

			<TrustedIssuersView
				selection={selection[EntityProxyField]<EntityType.TrustedIssuer>('$$trustedIssuers')}
				title='trusted issuers'
				emptyText='No trusted issuers.'
				id='TrustedIssuersView-$$trustedIssuers'
			/>

			<ComplianceModulesView
				selection={selection[EntityProxyField]<EntityType.ComplianceModule>('$$complianceModules')}
				title='compliance modules'
				emptyText='No compliance modules.'
				id='ComplianceModulesView-$$complianceModules'
			/>

			<TransferRestrictionsView
				selection={selection[EntityProxyField]<EntityType.TransferRestriction>('$$restrictions')}
				title='restrictions'
				emptyText='No transfer restrictions.'
				id='TransferRestrictionsView-$$restrictions'
			/>
		{/if}
	{/snippet}
</EntityView>

<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
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
	const titleFallback = $derived([String((pendingEntity.standard) ?? '')].filter(Boolean).join(' ') || 'regulated asset profile')
	const viewDomId = $derived('regulated-asset-profile-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import AssetInstanceView from '$/views/AssetInstanceView.svelte'
	import ClaimTopicRequirementsView from '$/views/ClaimTopicRequirementsView.svelte'
	import TrustedIssuersView from '$/views/TrustedIssuersView.svelte'
	import ComplianceModulesView from '$/views/ComplianceModulesView.svelte'
	import IssuerPowersView from '$/views/IssuerPowersView.svelte'
	import TransferRestrictionsView from '$/views/TransferRestrictionsView.svelte'
	import RegulatedAssetProfile_TimestampsView from '$/views/RegulatedAssetProfile_TimestampsView.svelte'
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
				{[String((pendingEntity.standard) ?? '')].filter(Boolean).join(' ') || title || 'regulated asset profile'}
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
						(selection.entitySelector.$assetInstance.$network !== undefined && selection.entitySelector.$assetInstance.$network.slug !== undefined && selection.entitySelector.$assetInstance.kind !== undefined && selection.entitySelector.$assetInstance.assetKey !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/asset/[kind=stringSegment]/[assetKey=stringSegment]', {
							network: String(selection.entitySelector.$assetInstance.$network.slug ?? ''),
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
						(selection.entitySelector.$assetInstance.$network !== undefined && selection.entitySelector.$assetInstance.$network.slug !== undefined && selection.entitySelector.$assetInstance.kind !== undefined && selection.entitySelector.$assetInstance.assetKey !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/asset/[kind=stringSegment]/[assetKey=stringSegment]', {
							network: String(selection.entitySelector.$assetInstance.$network.slug ?? ''),
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
							(selection.entitySelector.$assetInstance.$network !== undefined && selection.entitySelector.$assetInstance.$network.slug !== undefined && selection.entitySelector.$assetInstance.kind !== undefined && selection.entitySelector.$assetInstance.assetKey !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/asset/[kind=stringSegment]/[assetKey=stringSegment]', {
								network: String(selection.entitySelector.$assetInstance.$network.slug ?? ''),
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
							{@const standard = pendingEntity.standard}
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
			<CollapsibleTabs
				id={viewDomId + '-carousel-regulated-asset-compliance'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'regulated-asset-claim-requirements',
							label: 'Claim requirements',
						},
						{
							id: 'regulated-asset-trusted-issuers',
							label: 'Trusted issuers',
						},
						{
							id: 'regulated-asset-compliance-modules',
							label: 'Compliance modules',
						},
					]
				}
				data-card
				class='network-view-collapsible-compliance'
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({})}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Compliance</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionRegulatedAssetClaimRequirements({ id, label, open })}
					<ClaimTopicRequirementsView
						selection={
							selection.$$claimRequirements({
								count: true,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No claim topic requirements.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionRegulatedAssetTrustedIssuers({ id, label, open })}
					<TrustedIssuersView
						selection={
							selection.$$trustedIssuers({
								count: true,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No trusted issuers.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionRegulatedAssetComplianceModules({ id, label, open })}
					<ComplianceModulesView
						selection={
							selection.$$complianceModules({
								count: true,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No compliance modules.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>

			<CollapsibleTabs
				id={viewDomId + '-carousel-regulated-asset-controls'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'regulated-asset-issuer-powers',
							label: 'Issuer powers',
						},
						{
							id: 'regulated-asset-restrictions',
							label: 'Transfer restrictions',
						},
					]
				}
				data-card
				class='network-view-collapsible-controls'
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({})}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Controls</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionRegulatedAssetIssuerPowers({ id, label, open })}
					<IssuerPowersView
						selection={
							selection.$$issuerPowers({
								count: true,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No issuer powers.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionRegulatedAssetRestrictions({ id, label, open })}
					<TransferRestrictionsView
						selection={
							selection.$$restrictions({
								count: true,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No transfer restrictions.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>

			<CollapsibleTabs
				id={viewDomId + '-carousel-regulated-asset-observations'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'regulated-asset-timestamps',
							label: 'Observations',
						},
					]
				}
				data-card
				class='network-view-collapsible-observations'
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({})}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Observations</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionRegulatedAssetTimestamps({ id, label, open })}
					<RegulatedAssetProfile_TimestampsView
						selection={
							selection.$$timestamps({
								count: true,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No regulated asset profile observations.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>
		{/if}
	{/snippet}
</EntityView>

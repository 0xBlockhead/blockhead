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
			selection: RegisteredEntityProxyResource<EntityType.RegulatedAssetProfile>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.RegulatedAssetProfile>>
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
		sources: selection.sources,
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
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{[String((pendingEntity.standard) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
		{:else}
			<ResourceBoundary resource={regulatedAssetProfile}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.standard) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
					<AssetInstanceView
						selection={select(EntityType.AssetInstance, selection.entitySelector.$assetInstance)}
						href={
						(selection.entitySelector.$assetInstance.kind !== undefined && selection.entitySelector.$assetInstance.assetKey !== undefined && selection.entitySelector.$assetInstance.$network !== undefined && selection.entitySelector.$assetInstance.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/asset/[kind=stringSegment]/[assetKey=stringSegment]', {
							kind: String(selection.entitySelector.$assetInstance.kind ?? ''),
							assetKey: String(selection.entitySelector.$assetInstance.assetKey ?? ''),
							network: String(caip2StringFromValue(selection.entitySelector.$assetInstance.$network.caip2) ?? ''),
						}) : selection.entitySelector.$assetInstance.kind !== undefined && selection.entitySelector.$assetInstance.assetKey !== undefined && selection.entitySelector.$assetInstance.$network !== undefined && selection.entitySelector.$assetInstance.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/asset/[kind=stringSegment]/[assetKey=stringSegment]', {
							kind: String(selection.entitySelector.$assetInstance.kind ?? ''),
							assetKey: String(selection.entitySelector.$assetInstance.assetKey ?? ''),
							network: String(selection.entitySelector.$assetInstance.$network.slug ?? ''),
						}) : undefined)
					}
						layout={EntityLayout.Value}
						open={false}
					/>
		{:else}
			<ResourceBoundary resource={regulatedAssetProfile}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					<AssetInstanceView
						selection={select(EntityType.AssetInstance, selection.entitySelector.$assetInstance)}
						href={
						(selection.entitySelector.$assetInstance.kind !== undefined && selection.entitySelector.$assetInstance.assetKey !== undefined && selection.entitySelector.$assetInstance.$network !== undefined && selection.entitySelector.$assetInstance.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/asset/[kind=stringSegment]/[assetKey=stringSegment]', {
							kind: String(selection.entitySelector.$assetInstance.kind ?? ''),
							assetKey: String(selection.entitySelector.$assetInstance.assetKey ?? ''),
							network: String(caip2StringFromValue(selection.entitySelector.$assetInstance.$network.caip2) ?? ''),
						}) : selection.entitySelector.$assetInstance.kind !== undefined && selection.entitySelector.$assetInstance.assetKey !== undefined && selection.entitySelector.$assetInstance.$network !== undefined && selection.entitySelector.$assetInstance.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/asset/[kind=stringSegment]/[assetKey=stringSegment]', {
							kind: String(selection.entitySelector.$assetInstance.kind ?? ''),
							assetKey: String(selection.entitySelector.$assetInstance.assetKey ?? ''),
							network: String(selection.entitySelector.$assetInstance.$network.slug ?? ''),
						}) : undefined)
					}
						layout={EntityLayout.Value}
						open={false}
					/>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>asset instance</dt>
				<dd>
					<AssetInstanceView
						selection={select(EntityType.AssetInstance, selection.entitySelector.$assetInstance, {})}
						href={
							(selection.entitySelector.$assetInstance.kind !== undefined && selection.entitySelector.$assetInstance.assetKey !== undefined && selection.entitySelector.$assetInstance.$network !== undefined && selection.entitySelector.$assetInstance.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/asset/[kind=stringSegment]/[assetKey=stringSegment]', {
								kind: String(selection.entitySelector.$assetInstance.kind ?? ''),
								assetKey: String(selection.entitySelector.$assetInstance.assetKey ?? ''),
								network: String(caip2StringFromValue(selection.entitySelector.$assetInstance.$network.caip2) ?? ''),
							}) : selection.entitySelector.$assetInstance.kind !== undefined && selection.entitySelector.$assetInstance.assetKey !== undefined && selection.entitySelector.$assetInstance.$network !== undefined && selection.entitySelector.$assetInstance.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/asset/[kind=stringSegment]/[assetKey=stringSegment]', {
								kind: String(selection.entitySelector.$assetInstance.kind ?? ''),
								assetKey: String(selection.entitySelector.$assetInstance.assetKey ?? ''),
								network: String(selection.entitySelector.$assetInstance.$network.slug ?? ''),
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
								sources: selection.sources,
								fields: {
									standard: true,
								},
							})
						}
					>
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
			>
				{#snippet Summary()}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Compliance</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionRegulatedAssetClaimRequirements({ id, label, open })}
					<ClaimTopicRequirementsView
						selection={selection.$$claimRequirements}
						CollapsibleProps={{ canToggle: false }}
						collapsible={false}
						data-column-item="flexible"
						data-card
						data-scroll-container
						emptyText='No claim topic requirements.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionRegulatedAssetTrustedIssuers({ id, label, open })}
					<TrustedIssuersView
						selection={selection.$$trustedIssuers}
						CollapsibleProps={{ canToggle: false }}
						collapsible={false}
						data-column-item="flexible"
						data-card
						data-scroll-container
						emptyText='No trusted issuers.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionRegulatedAssetComplianceModules({ id, label, open })}
					<ComplianceModulesView
						selection={selection.$$complianceModules}
						CollapsibleProps={{ canToggle: false }}
						collapsible={false}
						data-column-item="flexible"
						data-card
						data-scroll-container
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
			>
				{#snippet Summary()}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Controls</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionRegulatedAssetIssuerPowers({ id, label, open })}
					<IssuerPowersView
						selection={selection.$$issuerPowers}
						CollapsibleProps={{ canToggle: false }}
						collapsible={false}
						data-column-item="flexible"
						data-card
						data-scroll-container
						emptyText='No issuer powers.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionRegulatedAssetRestrictions({ id, label, open })}
					<TransferRestrictionsView
						selection={selection.$$restrictions}
						CollapsibleProps={{ canToggle: false }}
						collapsible={false}
						data-column-item="flexible"
						data-card
						data-scroll-container
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
			>
				{#snippet Summary()}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Observations</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionRegulatedAssetTimestamps({ id, label, open })}
					<RegulatedAssetProfile_TimestampsView
						selection={selection.$$timestamps}
						CollapsibleProps={{ canToggle: false }}
						collapsible={false}
						data-column-item="flexible"
						data-card
						data-scroll-container
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

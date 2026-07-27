<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'


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
	}: EntitySelectionViewProps<EntityType.RegulatedAssetProfile> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const regulatedAssetProfile = $derived(selection({
		fields: {
			standard: true,
		},
	}))
	const titleFallback = $derived((pendingEntity.standard ?? '') || 'regulated asset profile')
	const viewDomId = $derived('regulated-asset-profile-' + encodeURIComponent(stringify(selection.entitySelector)))


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
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={regulatedAssetProfile}>
			{#snippet children(entity)}
				{entity.standard || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<AssetInstanceView
			selection={select(EntityType.AssetInstance, selection.entitySelector.$assetInstance)}
			href=""
			layout={EntityLayout.Value}
			open={false}
		/>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>asset instance</dt>
				<dd>
					<AssetInstanceView
						selection={select(EntityType.AssetInstance, selection.entitySelector.$assetInstance)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>standard</dt>
				<dd>
					<ResourceBoundary
						resource={regulatedAssetProfile}
					>
						{#snippet children(entity)}
							{entity.standard}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
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
					open={open}
					title={label}
					emptyText='No claim topic requirements.'
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
					open={open}
					title={label}
					emptyText='No trusted issuers.'
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
					open={open}
					title={label}
					emptyText='No compliance modules.'
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
					open={open}
					title={label}
					emptyText='No issuer powers.'
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
					open={open}
					title={label}
					emptyText='No transfer restrictions.'
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
					open={open}
					title={label}
					emptyText='No regulated asset profile observations.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>

<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
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

	const regulatedAssetProfile = $derived(selection({
		fields: {
			standard: true,
		},
	}))
	const titleFallback = $derived((prefetched.standard ?? '') || 'regulated asset profile')
	const viewDomId = $derived('regulated-asset-profile-' + encodeURIComponent(stringify(selection.entitySelector)))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntitiesList from '$/components/EntitiesList.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import AssetInstanceView from '$/views/AssetInstanceView.svelte'
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
			href={null}
			layout={EntityLayout.Value}
		/>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>asset instance</dt>
				<dd>
					<AssetInstanceView
						selection={select(EntityType.AssetInstance, selection.entitySelector.$assetInstance)}
						layout={EntityLayout.Value}
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

	{#snippet Details()}
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

			{#snippet SectionRegulatedAssetClaimRequirements({ id, label })}
				<EntitiesList
					entityType={EntityType.ClaimTopicRequirement}
					collapsible={false}
					title={label}
					emptyText='No claim topic requirements.'
					open={true}
					id={`${id}-list`}
					resource={selection.$$claimRequirements()}
				>
					{#snippet Item({ item: claimTopicRequirement })}
						<EntityView
							entityType={EntityType.ClaimTopicRequirement}
							entitySelector={claimTopicRequirement[EntityMetaKey.Selector]}
						/>
					{/snippet}
				</EntitiesList>
			{/snippet}

			{#snippet SectionRegulatedAssetTrustedIssuers({ id, label })}
				<EntitiesList
					entityType={EntityType.TrustedIssuer}
					collapsible={false}
					title={label}
					emptyText='No trusted issuers.'
					open={true}
					id={`${id}-list`}
					resource={selection.$$trustedIssuers()}
				>
					{#snippet Item({ item: trustedIssuer })}
						<EntityView
							entityType={EntityType.TrustedIssuer}
							entitySelector={trustedIssuer[EntityMetaKey.Selector]}
						/>
					{/snippet}
				</EntitiesList>
			{/snippet}

			{#snippet SectionRegulatedAssetComplianceModules({ id, label })}
				<EntitiesList
					entityType={EntityType.ComplianceModule}
					collapsible={false}
					title={label}
					emptyText='No compliance modules.'
					open={true}
					id={`${id}-list`}
					resource={selection.$$complianceModules()}
				>
					{#snippet Item({ item: complianceModule })}
						<EntityView
							entityType={EntityType.ComplianceModule}
							entitySelector={complianceModule[EntityMetaKey.Selector]}
						/>
					{/snippet}
				</EntitiesList>
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

			{#snippet SectionRegulatedAssetIssuerPowers({ id, label })}
				<EntitiesList
					entityType={EntityType.IssuerPower}
					collapsible={false}
					title={label}
					emptyText='No issuer powers.'
					open={true}
					id={`${id}-list`}
					resource={selection.$$issuerPowers()}
				>
					{#snippet Item({ item: issuerPower })}
						<EntityView
							entityType={EntityType.IssuerPower}
							entitySelector={issuerPower[EntityMetaKey.Selector]}
						/>
					{/snippet}
				</EntitiesList>
			{/snippet}

			{#snippet SectionRegulatedAssetRestrictions({ id, label })}
				<EntitiesList
					entityType={EntityType.TransferRestriction}
					collapsible={false}
					title={label}
					emptyText='No transfer restrictions.'
					open={true}
					id={`${id}-list`}
					resource={selection.$$restrictions()}
				>
					{#snippet Item({ item: transferRestriction })}
						<EntityView
							entityType={EntityType.TransferRestriction}
							entitySelector={transferRestriction[EntityMetaKey.Selector]}
						/>
					{/snippet}
				</EntitiesList>
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

			{#snippet SectionRegulatedAssetTimestamps({ id, label })}
				<EntitiesList
					entityType={EntityType.RegulatedAssetProfile_Timestamp}
					collapsible={false}
					title={label}
					emptyText='No regulated asset profile observations.'
					open={true}
					id={`${id}-list`}
					resource={selection.$$timestamps()}
				>
					{#snippet Item({ item: regulatedAssetProfileTimestamp })}
						<EntityView
							entityType={EntityType.RegulatedAssetProfile_Timestamp}
							entitySelector={regulatedAssetProfileTimestamp[EntityMetaKey.Selector]}
						/>
					{/snippet}
				</EntitiesList>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>

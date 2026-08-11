<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.SuiPackage>, 'prefetched'> = $props()

	const viewDomId = $derived('sui-package-' + encodeURIComponent(stringify(selection.entitySelector)))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import SuiNetworkView from '$/views/SuiNetworkView.svelte'
	import SuiPackageVersionsView from '$/views/SuiPackageVersionsView.svelte'
</script>


<EntityView
	entityType={EntityType.SuiPackage}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? (selection.entitySelector.originalPackageId || 'Sui package')}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/package/[originalPackageId=stringSegment]',
				{
					network: (
						'caip2' in selection.entitySelector.$network.$network ?
							caip2StringFromValue(selection.entitySelector.$network.$network.caip2)
						:
							selection.entitySelector.$network.$network.slug
					),
					originalPackageId: selection.entitySelector.originalPackageId,
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet HeadingAfter()}
		<span data-text="muted">
			<SuiNetworkView
				selection={select(EntityType.SuiNetwork, selection.entitySelector.$network)}
				layout={EntityLayout.Title}
			/>
		</span>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<SuiNetworkView
						selection={select(EntityType.SuiNetwork, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>original package ID</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.originalPackageId} />
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details()}
		<CollapsibleTabs
			id={viewDomId + '-carousel-sui-package-versions'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'sui-package-versions-list',
						label: 'Versions',
					},
				]
			}
			data-card
			class='network-view-collapsible-versions'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Versions</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionSuiPackageVersionsList({ id, label })}
				<SuiPackageVersionsView
					selection={selection.$$versions}
					collapsible={false}
					title={label}
					emptyText='No versions.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>

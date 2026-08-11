<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
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
	}: Omit<EntitySelectionViewProps<EntityType.SuiPackageVersion>, 'prefetched'> = $props()

	const viewDomId = $derived('sui-package-version-' + encodeURIComponent(stringify(selection.entitySelector)))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import SuiNetworkView from '$/views/SuiNetworkView.svelte'
	import SuiPackageView from '$/views/SuiPackageView.svelte'
	import MoveModulesView from '$/views/MoveModulesView.svelte'
</script>


<EntityView
	entityType={EntityType.SuiPackageVersion}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? String(selection.entitySelector.version)}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/package/[packageId=stringSegment]/version/[version=nonNegativeBigInt]/[digest=stringSegment]',
				{
					network: (
						'caip2' in selection.entitySelector.$network.$network ?
							caip2StringFromValue(selection.entitySelector.$network.$network.caip2)
						:
							selection.entitySelector.$network.$network.slug
					),
					packageId: selection.entitySelector.packageId,
					version: String(selection.entitySelector.version),
					digest: selection.entitySelector.digest,
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<TruncatedValue value={selection.entitySelector.packageId} />
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary
			resource={selection.$package}
		>
			{#snippet children(suiPackage)}
				{#if suiPackage != null}
					{@const suiPackageInitial = untrack(() => suiPackage)}
					<span data-text="muted">
						<SuiPackageView
							selection={select(EntityType.SuiPackage, (suiPackage ?? suiPackageInitial)[EntityMetaKey.Selector])}
							layout={EntityLayout.Title}
						/>
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
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

			<ResourceBoundary
				resource={selection.$package}
			>
				{#snippet children(suiPackage)}
					{#if suiPackage != null}
						{@const suiPackageInitial = untrack(() => suiPackage)}
						<div>
							<dt>package</dt>
							<dd>
								<SuiPackageView
									selection={select(EntityType.SuiPackage, (suiPackage ?? suiPackageInitial)[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>package ID</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.packageId} />
				</dd>
			</div>

			<div>
				<dt>version</dt>
				<dd>
					{selection.entitySelector.version}
				</dd>
			</div>

			<div>
				<dt>digest</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.digest} />
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details()}
		<CollapsibleTabs
			id={viewDomId + '-carousel-sui-package-version-abi'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'sui-package-version-modules',
						label: 'Modules',
					},
				]
			}
			data-card
			class='network-view-collapsible-abi'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>ABI</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionSuiPackageVersionModules({ id, label })}
				<MoveModulesView
					selection={selection.$$modules}
					collapsible={false}
					title={label}
					emptyText='No modules found.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>

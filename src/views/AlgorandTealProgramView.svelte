<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.AlgorandTealProgram>, 'prefetched'> = $props()

	const algorandTealProgram = $derived(selection({
		fields: {
			programKind: true,
			tealVersion: true,
		},
	}))
	const titleFallback = $derived(selection.entitySelector.programHash || 'algorand teal program')
	const viewDomId = $derived('algorand-teal-program-' + encodeURIComponent(stringify(selection.entitySelector)))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import AlgorandNetworkView from '$/views/AlgorandNetworkView.svelte'
	import AlgorandApplicationsView from '$/views/AlgorandApplicationsView.svelte'
	import AlgorandTransactionsView from '$/views/AlgorandTransactionsView.svelte'
	import AlgorandTealProgram_TimestampsView from '$/views/AlgorandTealProgram_TimestampsView.svelte'
</script>


<EntityView
	entityType={EntityType.AlgorandTealProgram}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(algorand)/algorand/teal-program/[programHash=zeroExHex]',
				{
					network: (
						'caip2' in selection.entitySelector.$network.$network ?
							caip2StringFromValue(selection.entitySelector.$network.$network.caip2)
						:
							selection.entitySelector.$network.$network.slug
					),
					programHash: selection.entitySelector.programHash,
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
		<ResourceBoundary resource={algorandTealProgram}>
			{#snippet children(entity)}
				{(entity.programKind ?? '') || selection.entitySelector.programHash || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={algorandTealProgram}>
			{#snippet children(entity)}
				{@const tealVersion = entity.tealVersion}
				{#if tealVersion != null}
					<span data-text="muted">
						{tealVersion}
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
					<AlgorandNetworkView
						selection={select(EntityType.AlgorandNetwork, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>program hash</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.programHash} />
				</dd>
			</div>

			<ResourceBoundary
				resource={algorandTealProgram}
			>
				{#snippet children(entity)}
					{@const programKind = entity.programKind}
					{#if programKind != null}
						<div>
							<dt>program kind</dt>
							<dd>
								{programKind}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={algorandTealProgram}
			>
				{#snippet children(entity)}
					{@const tealVersion = entity.tealVersion}
					{#if tealVersion != null}
						<div>
							<dt>teal version</dt>
							<dd>
								{tealVersion}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details()}
		<CollapsibleTabs
			id={viewDomId + '-carousel-algorand-teal-usage'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'algorand-teal-applications',
						label: 'Applications',
					},
					{
						id: 'algorand-teal-transactions',
						label: 'Transactions',
					},
				]
			}
			data-card
			class='network-view-collapsible-usage'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Usage</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionAlgorandTealApplications({ id, label })}
				<AlgorandApplicationsView
					selection={selection.$$applications}
					collapsible={false}
					title={label}
					emptyText='No Algorand applications.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionAlgorandTealTransactions({ id, label })}
				<AlgorandTransactionsView
					selection={selection.$$transactions}
					collapsible={false}
					title={label}
					emptyText='No Algorand transactions.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>

		<CollapsibleTabs
			id={viewDomId + '-carousel-algorand-teal-observations'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'algorand-teal-timestamps',
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

			{#snippet SectionAlgorandTealTimestamps({ id, label })}
				<AlgorandTealProgram_TimestampsView
					selection={selection.$$timestamps}
					collapsible={false}
					title={label}
					emptyText='No Algorand TEAL program observations.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>

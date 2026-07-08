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
	import { ZeroExHex } from '$/schema/ZeroExHex.ts'


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
			selection: EntityProxyResource<typeof schema, EntityType.AlgorandTealProgram>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.AlgorandTealProgram>>
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
	const algorandTealProgram = $derived(selection({
		fields: {
			programKind: true,
			tealVersion: true,
		},
	}))
	const titleFallback = $derived([String((selection.entitySelector.programHash ?? prefetched.programHash) ?? '')].filter(Boolean).join(' ') || 'algorand teal program')
	const viewDomId = $derived('algorand-teal-program-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import AlgorandTealProgram_TimestampsView from '$/views/AlgorandTealProgram_TimestampsView.svelte'
	import AlgorandApplicationsView from '$/views/AlgorandApplicationsView.svelte'
	import AlgorandTransactionsView from '$/views/AlgorandTransactionsView.svelte'
	import AlgorandNetworkView from '$/views/AlgorandNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.AlgorandTealProgram}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={algorandTealProgram}>
			{#snippet Pending()}
				{[String((selection.entitySelector.programHash ?? prefetched.programHash) ?? '')].filter(Boolean).join(' ') || title || 'algorand teal program'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.programHash) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={algorandTealProgram}>
			{#snippet Pending()}
				{[String((prefetched.programKind) ?? '')].filter(Boolean).join(' ') || [String((selection.entitySelector.programHash ?? prefetched.programHash) ?? '')].filter(Boolean).join(' ') || title || 'algorand teal program'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.programKind) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.programHash) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={algorandTealProgram}>
			{#snippet Pending()}
				{@const tealVersion0 = prefetched.tealVersion}
				{#if tealVersion0 !== undefined && tealVersion0 !== null}
					<span data-text="muted">
						{String((tealVersion0) ?? '')}
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const tealVersion0 = resolvedEntity.tealVersion}
				{#if tealVersion0 !== undefined && tealVersion0 !== null}
					<span data-text="muted">
						{String((tealVersion0) ?? '')}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<AlgorandNetworkView
						selection={select(EntityType.AlgorandNetwork, selection.entitySelector.$network, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>program hash</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									programHash: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const programHash = selection.entitySelector.programHash ?? prefetched.programHash}
							{#if programHash !== undefined && programHash !== null}
								<TruncatedValue value={String((programHash) ?? '')} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const programHash = resolvedEntity.programHash}
							{#if programHash !== undefined && programHash !== null}
								<TruncatedValue value={String((programHash) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							programKind: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const programKind = prefetched.programKind}
					{#if programKind !== undefined && programKind !== null}
						<div>
							<dt>program kind</dt>
							<dd>
								{String((programKind) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const programKind = resolvedEntity.programKind}
					{#if programKind !== undefined && programKind !== null}
						<div>
							<dt>program kind</dt>
							<dd>
								{String((programKind) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							tealVersion: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const tealVersion = prefetched.tealVersion}
					{#if tealVersion !== undefined && tealVersion !== null}
						<div>
							<dt>teal version</dt>
							<dd>
								{String((tealVersion) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const tealVersion = resolvedEntity.tealVersion}
					{#if tealVersion !== undefined && tealVersion !== null}
						<div>
							<dt>teal version</dt>
							<dd>
								{String((tealVersion) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<AlgorandTealProgram_TimestampsView
				selection={selection.$$timestamps}
				title='timestamps'
				emptyText='No Algorand TEAL program observations.'
				id='AlgorandTealProgram_TimestampsView-timestamps'
			/>

			<AlgorandApplicationsView
				selection={selection.$$applications}
				title='applications'
				emptyText='No Algorand applications.'
				id='AlgorandApplicationsView-applications'
			/>

			<AlgorandTransactionsView
				selection={selection.$$transactions}
				title='transactions'
				emptyText='No Algorand transactions.'
				id='AlgorandTransactionsView-transactions'
			/>
		{/if}
	{/snippet}
</EntityView>

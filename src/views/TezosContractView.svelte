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
			selection: EntityProxyResource<typeof schema, EntityType.TezosContract>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.TezosContract>>
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
	const tezosContract = $derived(selection({}))
	const titleFallback = $derived('tezos contract')
	const viewDomId = $derived('tezos-contract-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import TezosNetworkView from '$/views/TezosNetworkView.svelte'
	import TezosAccountView from '$/views/TezosAccountView.svelte'
	import TezosMichelsonScriptView from '$/views/TezosMichelsonScriptView.svelte'
	import TezosEntrypointsView from '$/views/TezosEntrypointsView.svelte'
	import TezosBigMapsView from '$/views/TezosBigMapsView.svelte'
	import TezosOperationsView from '$/views/TezosOperationsView.svelte'
	import TezosContract_TimestampsView from '$/views/TezosContract_TimestampsView.svelte'
</script>


<EntityView
	entityType={EntityType.TezosContract}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={tezosContract}>
			{#snippet Pending()}
				{title || 'tezos contract'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<TezosNetworkView
						selection={select(EntityType.TezosNetwork, selection.entitySelector.$network, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Address</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									address: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const address = pendingEntity.address}
							{#if address !== undefined && address !== null}
								<TruncatedValue value={String((address) ?? '')} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const address = resolvedEntity.address}
							{#if address !== undefined && address !== null}
								<TruncatedValue value={String((address) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							scriptHash: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const scriptHash = pendingEntity.scriptHash}
					{#if scriptHash !== undefined && scriptHash !== null}
						<div>
							<dt>script hash</dt>
							<dd>
								<TruncatedValue value={String((scriptHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const scriptHash = resolvedEntity.scriptHash}
					{#if scriptHash !== undefined && scriptHash !== null}
						<div>
							<dt>script hash</dt>
							<dd>
								<TruncatedValue value={String((scriptHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							codeHash: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const codeHash = pendingEntity.codeHash}
					{#if codeHash !== undefined && codeHash !== null}
						<div>
							<dt>code hash</dt>
							<dd>
								<TruncatedValue value={String((codeHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const codeHash = resolvedEntity.codeHash}
					{#if codeHash !== undefined && codeHash !== null}
						<div>
							<dt>code hash</dt>
							<dd>
								<TruncatedValue value={String((codeHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$account}
			>
				{#snippet Pending()}{/snippet}

				{#snippet children(tezosAccount)}
					{#if tezosAccount != null && tezosAccount[EntityMetaKey.Selector] != null}
						<div>
							<dt>account</dt>
							<dd>
								<TezosAccountView
									selection={select(EntityType.TezosAccount, tezosAccount[EntityMetaKey.Selector])}
									prefetched={tezosAccount}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$script}
			>
				{#snippet Pending()}{/snippet}

				{#snippet children(tezosMichelsonScript)}
					{#if tezosMichelsonScript != null && tezosMichelsonScript[EntityMetaKey.Selector] != null}
						<div>
							<dt>script</dt>
							<dd>
								<TezosMichelsonScriptView
									selection={select(EntityType.TezosMichelsonScript, tezosMichelsonScript[EntityMetaKey.Selector])}
									prefetched={tezosMichelsonScript}
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

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<CollapsibleTabs
				id={viewDomId + '-carousel-tezos-contract-activity'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'tezos-contract-entrypoints',
							label: 'Entrypoints',
						},
						{
							id: 'tezos-contract-big-maps',
							label: 'Big Maps',
						},
						{
							id: 'tezos-contract-operations',
							label: 'Operations',
						},
					]
				}
				data-card
				class='network-view-collapsible-activity'
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({})}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Activity</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionTezosContractEntrypoints({ id, label, open })}
					<TezosEntrypointsView
						selection={selection.$$entrypoints}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No entrypoints.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionTezosContractBigMaps({ id, label, open })}
					<TezosBigMapsView
						selection={selection.$$bigMaps}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No big maps.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionTezosContractOperations({ id, label, open })}
					<TezosOperationsView
						selection={selection.$$operations}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No operations.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>

			<CollapsibleTabs
				id={viewDomId + '-carousel-tezos-contract-observations'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'tezos-contract-timestamps',
							label: 'Timestamps',
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

				{#snippet SectionTezosContractTimestamps({ id, label, open })}
					<TezosContract_TimestampsView
						selection={selection.$$timestamps}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No timestamps.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>
		{/if}
	{/snippet}
</EntityView>

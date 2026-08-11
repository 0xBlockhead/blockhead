<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'
	import { Source } from '$/sources/Source.ts'


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
	}: Omit<EntitySelectionViewProps<EntityType.EnsName>, 'prefetched'> = $props()

	const ensName = $derived(selection({
		sources: selection.sources ?? [
			Source.TheGraph_Graphql,
			Source.Voltaire_JsonRpc,
		],
		fields: {
			normalizedName: true,
			node: true,
			labelName: true,
			labelhash: true,
		},
	}))
	const titleFallback = $derived(selection.entitySelector.name || 'ENS name')
	const viewDomId = $derived('ens-name-' + encodeURIComponent(stringify(selection.entitySelector)))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import EnsNameView from '$/views/EnsNameView.svelte'
	import EvmContractView from '$/views/EvmContractView.svelte'
	import EvmAccountView from '$/views/EvmAccountView.svelte'
	import EnsNamesView from '$/views/EnsNamesView.svelte'
	import EnsRecordsView from '$/views/EnsRecordsView.svelte'
	import EnsName_TimestampsView from '$/views/EnsName_TimestampsView.svelte'
</script>


<EntityView
	entityType={EntityType.EnsName}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(ens)/ens/(globalEnsNetwork)/name/[ensName=stringSegment]',
				{
					ensName: encodeURIComponent(selection.entitySelector.name),
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
		{selection.entitySelector.name || titleFallback}
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Name</dt>
				<dd>
					{selection.entitySelector.name}
				</dd>
			</div>

			<ResourceBoundary
				resource={ensName}
			>
				{#snippet children(entity)}
					{@const normalizedName = entity.normalizedName}
					{#if normalizedName != null}
						<div>
							<dt>Normalized name</dt>
							<dd>
								{normalizedName}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={ensName}
			>
				{#snippet children(entity)}
					{@const node = entity.node}
					{#if node != null}
						<div>
							<dt>Node</dt>
							<dd>
								{node}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={ensName}
			>
				{#snippet children(entity)}
					{@const labelName = entity.labelName}
					{#if labelName != null}
						<div>
							<dt>Label name</dt>
							<dd>
								{labelName}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={ensName}
			>
				{#snippet children(entity)}
					{@const labelhash = entity.labelhash}
					{#if labelhash != null}
						<div>
							<dt>Label hash</dt>
							<dd>
								<TruncatedValue value={labelhash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={selection.$parent}
			>
				{#snippet children(ensName)}
					{#if ensName != null}
						{@const ensNameInitial = untrack(() => ensName)}
						<div>
							<dt>Parent</dt>
							<dd>
								<EnsNameView
									selection={select(EntityType.EnsName, (ensName ?? ensNameInitial)[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$resolverContract}
			>
				{#snippet children(evmContract)}
					{#if evmContract != null}
						{@const evmContractInitial = untrack(() => evmContract)}
						<div>
							<dt>Resolver contract</dt>
							<dd>
								<EvmContractView
									selection={select(EntityType.EvmContract, (evmContract ?? evmContractInitial)[EntityMetaKey.Selector])}
									prefetched={evmContract ?? evmContractInitial}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$subgraphResolvedActor}
			>
				{#snippet children(evmAccount)}
					{#if evmAccount != null}
						{@const evmAccountInitial = untrack(() => evmAccount)}
						<div>
							<dt>Resolved actor</dt>
							<dd>
								<EvmAccountView
									selection={select(EntityType.EvmAccount, (evmAccount ?? evmAccountInitial)[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$ownerActor}
			>
				{#snippet children(evmAccount)}
					{#if evmAccount != null}
						{@const evmAccountInitial = untrack(() => evmAccount)}
						<div>
							<dt>Owner</dt>
							<dd>
								<EvmAccountView
									selection={select(EntityType.EvmAccount, (evmAccount ?? evmAccountInitial)[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details()}
		<CollapsibleTabs
			id={viewDomId + '-carousel-ens-name-records'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'ens-name-subdomains',
						label: 'Subdomains',
					},
					{
						id: 'ens-name-record-list',
						label: 'Records',
					},
				]
			}
			data-card
			class='network-view-collapsible-records'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Records and subdomains</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionEnsNameSubdomains({ id, label })}
				<EnsNamesView
					selection={selection.$$subdomains}
					collapsible={false}
					title={label}
					emptyText='No subdomains for this ENS name yet.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionEnsNameRecordList({ id, label })}
				<EnsRecordsView
					selection={selection.$$records}
					href={
						resolve(
							'/(explore)/(ens)/ens/(globalEnsNetwork)/name/[ensName=stringSegment]/(ensName)/records',
							{
								ensName: encodeURIComponent(selection.entitySelector.name),
							}
						)
					}
					collapsible={false}
					title={label}
					emptyText='No ENS records for this name yet.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>

		<CollapsibleTabs
			id={viewDomId + '-carousel-ens-name-observations'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'ens-name-timestamps',
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

			{#snippet SectionEnsNameTimestamps({ id, label })}
				<EnsName_TimestampsView
					selection={selection.$$timestamps}
					collapsible={false}
					title={label}
					emptyText='No ENS name observations yet.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>

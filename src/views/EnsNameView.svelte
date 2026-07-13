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
	import { Source } from '$/sources/Source.ts'


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
			selection: EntityProxyResource<typeof schema, EntityType.EnsName>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.EnsName>>
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
	const ensName = $derived(selection({
		sources: [
			Source.TheGraph_Graphql,
			Source.Voltaire_JsonRpc,
		],
		fields: {
			normalizedName: true,
			node: true,
			labelName: true,
			labelhash: true,
			$parent: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.name) ?? '')].filter(Boolean).join(' ') || 'ENS name')
	const viewDomId = $derived('ens-name-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


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
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (pendingEntity.name !== undefined ? resolve('/ens/name/[ensName=stringSegment]', {
			ensName: String(pendingEntity.name ?? ''),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={ensName}>
			{#snippet Pending()}
				{[String((pendingEntity.name) ?? '')].filter(Boolean).join(' ') || title || 'ENS name'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.name) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={ensName}>
			{#snippet Pending()}
				{[String((pendingEntity.name) ?? '')].filter(Boolean).join(' ') || title || 'ENS name'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.name) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Name</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									name: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const name = pendingEntity.name}
							{#if name !== undefined && name !== null}
								{String((name) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const name = resolvedEntity.name}
							{#if name !== undefined && name !== null}
								{String((name) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							normalizedName: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const normalizedName = pendingEntity.normalizedName}
					{#if normalizedName !== undefined && normalizedName !== null}
						<div>
							<dt>Normalized name</dt>
							<dd>
								{String((normalizedName) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const normalizedName = resolvedEntity.normalizedName}
					{#if normalizedName !== undefined && normalizedName !== null}
						<div>
							<dt>Normalized name</dt>
							<dd>
								{String((normalizedName) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							node: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const node = pendingEntity.node}
					{#if node !== undefined && node !== null}
						<div>
							<dt>Node</dt>
							<dd>
								{String((node) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const node = resolvedEntity.node}
					{#if node !== undefined && node !== null}
						<div>
							<dt>Node</dt>
							<dd>
								{String((node) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							labelName: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const labelName = pendingEntity.labelName}
					{#if labelName !== undefined && labelName !== null}
						<div>
							<dt>Label name</dt>
							<dd>
								{String((labelName) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const labelName = resolvedEntity.labelName}
					{#if labelName !== undefined && labelName !== null}
						<div>
							<dt>Label name</dt>
							<dd>
								{String((labelName) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							labelhash: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const labelhash = pendingEntity.labelhash}
					{#if labelhash !== undefined && labelhash !== null}
						<div>
							<dt>Label hash</dt>
							<dd>
								<TruncatedValue value={String((labelhash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const labelhash = resolvedEntity.labelhash}
					{#if labelhash !== undefined && labelhash !== null}
						<div>
							<dt>Label hash</dt>
							<dd>
								<TruncatedValue value={String((labelhash) ?? '')} />
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
				{#snippet Pending()}{/snippet}

				{#snippet children(ensName)}
					{#if ensName != null && ensName[EntityMetaKey.Selector] != null}
						<div>
							<dt>Parent</dt>
							<dd>
								<EnsNameView
									selection={select(EntityType.EnsName, ensName[EntityMetaKey.Selector])}
									prefetched={ensName}
									href={
										(ensName[EntityMetaKey.Selector].name !== undefined ? resolve('/ens/name/[ensName=stringSegment]', {
											ensName: String(ensName[EntityMetaKey.Selector].name ?? ''),
										}) : undefined)
									}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$resolverContract}
			>
				{#snippet Pending()}{/snippet}

				{#snippet children(evmContract)}
					{#if evmContract != null && evmContract[EntityMetaKey.Selector] != null}
						<div>
							<dt>Resolver contract</dt>
							<dd>
								<EvmContractView
									selection={select(EntityType.EvmContract, evmContract[EntityMetaKey.Selector])}
									prefetched={evmContract}
									href={
										(evmContract[EntityMetaKey.Selector].$network !== undefined && evmContract[EntityMetaKey.Selector].$network.slug !== undefined && evmContract[EntityMetaKey.Selector].address !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/contract/[address=evmAddress]', {
											network: String(evmContract[EntityMetaKey.Selector].$network.slug ?? ''),
											address: String(evmContract[EntityMetaKey.Selector].address ?? ''),
										}) : undefined)
									}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$subgraphResolvedActor}
			>
				{#snippet Pending()}{/snippet}

				{#snippet children(evmAccount)}
					{#if evmAccount != null && evmAccount[EntityMetaKey.Selector] != null}
						<div>
							<dt>Resolved actor</dt>
							<dd>
								<EvmAccountView
									selection={select(EntityType.EvmAccount, evmAccount[EntityMetaKey.Selector])}
									prefetched={evmAccount}
									href={
										(evmAccount[EntityMetaKey.Selector].address !== undefined ? resolve('/account/[address=evmAddress]', {
											address: String(evmAccount[EntityMetaKey.Selector].address ?? ''),
										}) : undefined)
									}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$ownerActor}
			>
				{#snippet Pending()}{/snippet}

				{#snippet children(evmAccount)}
					{#if evmAccount != null && evmAccount[EntityMetaKey.Selector] != null}
						<div>
							<dt>Owner</dt>
							<dd>
								<EvmAccountView
									selection={select(EntityType.EvmAccount, evmAccount[EntityMetaKey.Selector])}
									prefetched={evmAccount}
									href={
										(evmAccount[EntityMetaKey.Selector].address !== undefined ? resolve('/account/[address=evmAddress]', {
											address: String(evmAccount[EntityMetaKey.Selector].address ?? ''),
										}) : undefined)
									}
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
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({})}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Records and subdomains</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionEnsNameSubdomains({ id, label, open })}
					<EnsNamesView
						selection={
							selection.$$subdomains({
								count: true,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No subdomains for this ENS name yet.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionEnsNameRecordList({ id, label, open })}
					<EnsRecordsView
						selection={
							selection.$$records({
								count: true,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No ENS records for this name yet.'
						open={open}
						title={label}
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
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({})}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Observations</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionEnsNameTimestamps({ id, label, open })}
					<EnsName_TimestampsView
						selection={
							selection.$$timestamps({
								count: true,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No ENS name observations yet.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>
		{/if}
	{/snippet}
</EntityView>

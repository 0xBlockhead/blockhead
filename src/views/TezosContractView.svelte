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
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.TezosContract>, 'prefetched'> = $props()

	const viewDomId = $derived('tezos-contract-' + encodeURIComponent(stringify(selection.entitySelector)))


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
	entitySelector={selection.entitySelector}
	id={viewDomId}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/contract/tezos/[address=stringSegment]',
				{
					network: (
						'caip2' in selection.entitySelector.$network.$network ?
							caip2StringFromValue(selection.entitySelector.$network.$network.caip2)
						:
							selection.entitySelector.$network.$network.slug
					),
					address: selection.entitySelector.address,
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<TezosNetworkView
						selection={select(EntityType.TezosNetwork, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Address</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.address} />
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
				{#snippet children(entity)}
					{@const scriptHash = entity.scriptHash}
					{#if scriptHash != null}
						<div>
							<dt>script hash</dt>
							<dd>
								<TruncatedValue value={scriptHash} />
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
				{#snippet children(entity)}
					{@const codeHash = entity.codeHash}
					{#if codeHash != null}
						<div>
							<dt>code hash</dt>
							<dd>
								<TruncatedValue value={codeHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$account}
			>
				{#snippet children(tezosAccount)}
					{#if tezosAccount != null}
						<div>
							<dt>account</dt>
							<dd>
								<TezosAccountView
									selection={select(EntityType.TezosAccount, tezosAccount[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$script}
			>
				{#snippet children(tezosMichelsonScript)}
					{#if tezosMichelsonScript != null}
						<div>
							<dt>script</dt>
							<dd>
								<TezosMichelsonScriptView
									selection={select(EntityType.TezosMichelsonScript, tezosMichelsonScript[EntityMetaKey.Selector])}
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
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Activity</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionTezosContractEntrypoints({ id, label })}
				<TezosEntrypointsView
					selection={selection.$$entrypoints}
					collapsible={false}
					title={label}
					emptyText='No entrypoints.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionTezosContractBigMaps({ id, label })}
				<TezosBigMapsView
					selection={selection.$$bigMaps}
					collapsible={false}
					title={label}
					emptyText='No big maps.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionTezosContractOperations({ id, label })}
				<TezosOperationsView
					selection={selection.$$operations}
					collapsible={false}
					title={label}
					emptyText='No operations.'
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
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Observations</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionTezosContractTimestamps({ id, label })}
				<TezosContract_TimestampsView
					selection={selection.$$timestamps}
					collapsible={false}
					title={label}
					emptyText='No timestamps.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>

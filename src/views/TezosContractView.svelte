<!-- Generated from APP.ts. Do not edit by hand. -->

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
	}: EntitySelectionViewProps<EntityType.TezosContract> = $props()

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
	title={title ?? 'tezos contract'}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		tezos contract
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<TezosNetworkView
						selection={select(EntityType.TezosNetwork, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
						open={false}
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
				{#snippet children(tezosMichelsonScript)}
					{#if tezosMichelsonScript != null}
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

			{#snippet SectionTezosContractEntrypoints({ id, label, open })}
				<TezosEntrypointsView
					selection={selection.$$entrypoints}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					emptyText='No entrypoints.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionTezosContractBigMaps({ id, label, open })}
				<TezosBigMapsView
					selection={selection.$$bigMaps}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					emptyText='No big maps.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionTezosContractOperations({ id, label, open })}
				<TezosOperationsView
					selection={selection.$$operations}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
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

			{#snippet SectionTezosContractTimestamps({ id, label, open })}
				<TezosContract_TimestampsView
					selection={selection.$$timestamps}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					emptyText='No timestamps.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>

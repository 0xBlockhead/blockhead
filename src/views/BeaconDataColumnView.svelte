<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
	import { Source } from '$/sources/Source.ts'


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
	}: Omit<EntitySelectionViewProps<EntityType.BeaconDataColumn>, 'prefetched'> = $props()

	const block = $derived(selection.entitySelector.$block)
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Beacon_Rest,
		],
	}))
	const beaconDataColumn = $derived(viewSelection({
		fields: {
			forkVersion: true,
			columnCount: true,
		},
	}))
	const titleFallback = $derived(`Data column #${selection.entitySelector.columnIndex}`)


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import BeaconDataColumn_TimestampsView from '$/views/BeaconDataColumn_TimestampsView.svelte'
	import BeaconBlockView from '$/views/BeaconBlockView.svelte'
</script>


<EntityView
	entityType={EntityType.BeaconDataColumn}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	idDragPlainText={String(selection.entitySelector.columnIndex)}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/beacon-block/[root=zeroExHex]/(beaconBlock)/data-column/[columnIndex=nonNegativeInteger]',
				{
					network: (
						'caip2' in block.$network ?
							caip2StringFromValue(block.$network.caip2)
						:
							block.$network.slug
					),
					root: block.root,
					columnIndex: String(selection.entitySelector.columnIndex),
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<span data-row="inline align-center gap-2 wrap">
			<span>Data column </span>
			<span data-badge="small">
				#{selection.entitySelector.columnIndex}
			</span>
		</span>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={beaconDataColumn}>
			{#snippet children(entity)}
				{[entity.forkVersion, String(entity.columnCount)].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			<BeaconBlockView
				selection={select(EntityType.BeaconBlock, selection.entitySelector.$block)}
				layout={EntityLayout.Title}
			/>
		</span>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Beacon block</dt>
				<dd>
					<BeaconBlockView
						selection={select(EntityType.BeaconBlock, selection.entitySelector.$block)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Column index</dt>
				<dd>
					<NumberValue
						value={selection.entitySelector.columnIndex}
					/>
				</dd>
			</div>

			<div>
				<dt>Fork version</dt>
				<dd>
					<ResourceBoundary
						resource={beaconDataColumn}
					>
						{#snippet children(entity)}
							{entity.forkVersion}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Cells</dt>
				<dd>
					<ResourceBoundary
						resource={beaconDataColumn}
					>
						{#snippet children(entity)}
							<NumberValue
								value={entity.columnCount}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Column cells</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									columns: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.columns.values.join(', ')}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>KZG proofs</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									kzgProofs: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.kzgProofs.values.join(', ')}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>KZG commitments</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									kzgCommitments: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.kzgCommitments.values.join(', ')}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details()}
		{@const timestampsResource = selection
			.$$timestamps({
				sources: [
					Source.Beacon_Rest,
				],
			})}
		<ResourceBoundary
			resource={timestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<BeaconDataColumn_TimestampsView
						selection={timestampsResource}
						countResource={timestampsResource.count}
						title='Custody and finality observations'
						id='timestamps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>

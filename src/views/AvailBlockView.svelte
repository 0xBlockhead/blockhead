<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.AvailBlock> = $props()

	const availBlock = $derived(selection({
		fields: {
			blockNumber: true,
			timestampMs: true,
			blockHash: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import AvailDataSubmissionsView from '$/views/AvailDataSubmissionsView.svelte'
	import AvailNetworkView from '$/views/AvailNetworkView.svelte'
	import AvailBlockView from '$/views/AvailBlockView.svelte'
</script>


<EntityView
	entityType={EntityType.AvailBlock}
	entitySelector={selection.entitySelector}
	title={title ?? (String(prefetched.blockNumber ?? '') || (prefetched.blockHash ?? '') || 'avail block')}
	href={
		href === undefined ?
			(
				'blockNumber' in selection.entitySelector ?
					resolve(
						'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/(avail)/block-number/[blockNumber=nonNegativeBigInt]',
						{
							network: (
								'caip2' in selection.entitySelector.$network.$network ?
									caip2StringFromValue(selection.entitySelector.$network.$network.caip2)
								:
									selection.entitySelector.$network.$network.slug
							),
							blockNumber: String(selection.entitySelector.blockNumber),
						}
					)
				:
					'blockHash' in selection.entitySelector ?
						resolve(
							'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/(avail)/avail/block-hash/[blockHash=stringSegment]',
							{
								network: (
									'caip2' in selection.entitySelector.$network.$network ?
										caip2StringFromValue(selection.entitySelector.$network.$network.caip2)
									:
										selection.entitySelector.$network.$network.slug
								),
								blockHash: selection.entitySelector.blockHash,
							}
						)
					:
						undefined
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={availBlock}>
			{#snippet children(entity)}
				<NumberValue
					value={entity.blockNumber}
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={availBlock}>
			{#snippet children(entity)}
				{@const timestampMs = entity.timestampMs}
				{#if timestampMs != null}
					<Timestamp timestamp={timestampMs} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<AvailNetworkView
						selection={select(EntityType.AvailNetwork, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Block number</dt>
				<dd>
					<ResourceBoundary
						resource={availBlock}
					>
						{#snippet children(entity)}
							<NumberValue
								value={entity.blockNumber}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Block hash</dt>
				<dd>
					<ResourceBoundary
						resource={availBlock}
					>
						{#snippet children(entity)}
							<TruncatedValue value={entity.blockHash} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							parentHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const parentHash = entity.parentHash}
					{#if parentHash != null}
						<div>
							<dt>parent hash</dt>
							<dd>
								<TruncatedValue value={parentHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$parent}
			>
				{#snippet children(availBlock)}
					{#if availBlock != null}
						{@const availBlockInitial = untrack(() => availBlock)}
						<div>
							<dt>parent</dt>
							<dd>
								<AvailBlockView
									selection={select(EntityType.AvailBlock, (availBlock ?? availBlockInitial)[EntityMetaKey.Selector])}
									prefetched={availBlock ?? availBlockInitial}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={availBlock}
			>
				{#snippet children(entity)}
					{@const timestampMs = entity.timestampMs}
					{#if timestampMs != null}
						<div>
							<dt>Timestamp</dt>
							<dd>
								<Timestamp timestamp={timestampMs} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							stateRoot: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const stateRoot = entity.stateRoot}
					{#if stateRoot != null}
						<div>
							<dt>state root</dt>
							<dd>
								{stateRoot}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							extrinsicsRoot: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const extrinsicsRoot = entity.extrinsicsRoot}
					{#if extrinsicsRoot != null}
						<div>
							<dt>extrinsics root</dt>
							<dd>
								{extrinsicsRoot}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							extrinsicCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const extrinsicCount = entity.extrinsicCount}
					{#if extrinsicCount != null}
						<div>
							<dt>extrinsic count</dt>
							<dd>
								<NumberValue
									value={extrinsicCount}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							dataSubmissionCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const dataSubmissionCount = entity.dataSubmissionCount}
					{#if dataSubmissionCount != null}
						<div>
							<dt>data submission count</dt>
							<dd>
								<NumberValue
									value={dataSubmissionCount}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							appIdCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const appIdCount = entity.appIdCount}
					{#if appIdCount != null}
						<div>
							<dt>app ID count</dt>
							<dd>
								<NumberValue
									value={appIdCount}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details()}
		{@const dataSubmissionsResource = selection.$$dataSubmissions}
		<ResourceBoundary
			resource={dataSubmissionsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<AvailDataSubmissionsView
						selection={dataSubmissionsResource}
						countResource={dataSubmissionsResource.count}
						title='data submissions'
						id='data-submissions'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>

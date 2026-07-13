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
			selection: EntityProxyResource<typeof schema, EntityType.FilecoinSector>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.FilecoinSector>>
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
	const filecoinSector = $derived(selection({
		sources: [
			Source.Lotus_JsonRpc,
		],
		fields: {
			sealedCid: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.sectorNumber) ?? '')].filter(Boolean).join(' ') || 'filecoin sector')
	const viewDomId = $derived('filecoin-sector-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import FilecoinMinerView from '$/views/FilecoinMinerView.svelte'
</script>


<EntityView
	entityType={EntityType.FilecoinSector}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={filecoinSector}>
			{#snippet Pending()}
				{@const sectorNumber0 = pendingEntity.sectorNumber}
				{#if sectorNumber0 !== undefined && sectorNumber0 !== null}
					<NumberValue value={Number(sectorNumber0)} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const sectorNumber0 = resolvedEntity.sectorNumber}
				{#if sectorNumber0 !== undefined && sectorNumber0 !== null}
					<NumberValue value={Number(sectorNumber0)} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={filecoinSector}>
			{#snippet Pending()}
				<FilecoinMinerView
					selection={select(EntityType.FilecoinMiner, selection.entitySelector.$miner)}
					layout={EntityLayout.Value}
					open={false}
				/>
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<FilecoinMinerView
					selection={select(EntityType.FilecoinMiner, selection.entitySelector.$miner)}
					layout={EntityLayout.Value}
					open={false}
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={filecoinSector}>
			{#snippet Pending()}
				{@const sealedCid0 = pendingEntity.sealedCid}
				{#if sealedCid0 !== undefined && sealedCid0 !== null}
					<span data-text="muted">
						{String((sealedCid0) ?? '')}
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const sealedCid0 = resolvedEntity.sealedCid}
				{#if sealedCid0 !== undefined && sealedCid0 !== null}
					<span data-text="muted">
						{String((sealedCid0) ?? '')}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Miner</dt>
				<dd>
					<FilecoinMinerView
						selection={select(EntityType.FilecoinMiner, selection.entitySelector.$miner, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Sector number</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									sectorNumber: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const sectorNumber = pendingEntity.sectorNumber}
							{#if sectorNumber !== undefined && sectorNumber !== null}
								<NumberValue value={Number(sectorNumber)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const sectorNumber = resolvedEntity.sectorNumber}
							{#if sectorNumber !== undefined && sectorNumber !== null}
								<NumberValue value={Number(sectorNumber)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.Lotus_JsonRpc,
						],
						fields: {
							sealedCid: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const sealedCid = pendingEntity.sealedCid}
					{#if sealedCid !== undefined && sealedCid !== null}
						<div>
							<dt>Sealed CID</dt>
							<dd>
								{String((sealedCid) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const sealedCid = resolvedEntity.sealedCid}
					{#if sealedCid !== undefined && sealedCid !== null}
						<div>
							<dt>Sealed CID</dt>
							<dd>
								{String((sealedCid) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.Lotus_JsonRpc,
						],
						fields: {
							activationEpoch: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const activationEpoch = pendingEntity.activationEpoch}
					{#if activationEpoch !== undefined && activationEpoch !== null}
						<div>
							<dt>Activation epoch</dt>
							<dd>
								<NumberValue value={Number(activationEpoch)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const activationEpoch = resolvedEntity.activationEpoch}
					{#if activationEpoch !== undefined && activationEpoch !== null}
						<div>
							<dt>Activation epoch</dt>
							<dd>
								<NumberValue value={Number(activationEpoch)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.Lotus_JsonRpc,
						],
						fields: {
							expirationEpoch: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const expirationEpoch = pendingEntity.expirationEpoch}
					{#if expirationEpoch !== undefined && expirationEpoch !== null}
						<div>
							<dt>Expiration epoch</dt>
							<dd>
								<NumberValue value={Number(expirationEpoch)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const expirationEpoch = resolvedEntity.expirationEpoch}
					{#if expirationEpoch !== undefined && expirationEpoch !== null}
						<div>
							<dt>Expiration epoch</dt>
							<dd>
								<NumberValue value={Number(expirationEpoch)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>

<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyPrefetchedData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
	import { EvmAddress } from '$/schema/ZeroExHex.ts'


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
			selection: RegisteredEntityProxyResource<EntityType.BnbBeaconTokenMigration>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.BnbBeaconTokenMigration>
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
	const bnbBeaconTokenMigration = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {
			migrationKind: true,
		},
	} : {
		sources: selection.sources,
		fields: {
			migrationKind: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.migrationKind) ?? '')].filter(Boolean).join(' ') || 'bnb beacon token migration')
	const viewDomId = $derived('bnb-beacon-token-migration-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BnbBeaconTokenMigration_TimestampsView from '$/views/BnbBeaconTokenMigration_TimestampsView.svelte'
	import BnbBeaconTokenView from '$/views/BnbBeaconTokenView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.BnbBeaconTokenMigration}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={bnbBeaconTokenMigration}>
			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.migrationKind) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={bnbBeaconTokenMigration}>
			{#snippet children(entity)}
				<BnbBeaconTokenView
					selection={select(EntityType.BnbBeaconToken, selection.entitySelector.$token)}
					href=""
					layout={EntityLayout.Value}
					open={false}
				/>

				<NetworkView
					selection={select(EntityType.Network, selection.entitySelector.$targetNetwork)}
					href=""
					layout={EntityLayout.Value}
					open={false}
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>token</dt>
				<dd>
					<BnbBeaconTokenView
						selection={select(EntityType.BnbBeaconToken, selection.entitySelector.$token)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>target network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$targetNetwork)}
						href={
							(
								selection.entitySelector.$targetNetwork != null && 'caip2' in selection.entitySelector.$targetNetwork
								&& selection.entitySelector.$targetNetwork.caip2 != null ?
									resolve('/network/[network=networkCaip2OrNetworkSlug]', {
								network: String(caip2StringFromValue(selection.entitySelector.$targetNetwork.caip2) ?? ''),
							})
							:
									selection.entitySelector.$targetNetwork != null && 'slug' in selection.entitySelector.$targetNetwork
									&& selection.entitySelector.$targetNetwork.slug != null ?
										resolve('/network/[network=networkCaip2OrNetworkSlug]', {
									network: String(selection.entitySelector.$targetNetwork.slug ?? ''),
								})
								:
									undefined
							)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>target address</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									targetAddress: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const targetAddress = resolvedEntity.targetAddress}
							{#if targetAddress !== undefined && targetAddress !== null}
								<TruncatedValue value={String((targetAddress) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>migration kind</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									migrationKind: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const migrationKind = resolvedEntity.migrationKind}
							{#if migrationKind !== undefined && migrationKind !== null}
								{String((migrationKind) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							sourceAddress: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const sourceAddress = resolvedEntity.sourceAddress}
					{#if sourceAddress !== undefined && sourceAddress !== null}
						<div>
							<dt>source address</dt>
							<dd>
								<TruncatedValue value={String((sourceAddress) ?? '')} />
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
						sources: selection.sources,
						fields: {
							targetContractAddress: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const targetContractAddress = resolvedEntity.targetContractAddress}
					{#if targetContractAddress !== undefined && targetContractAddress !== null}
						<div>
							<dt>target contract address</dt>
							<dd>
								<TruncatedValue value={String((targetContractAddress) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							amount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const amount = resolvedEntity.amount}
					{#if amount !== undefined && amount !== null}
						<div>
							<dt>amount</dt>
							<dd>
								<NumberValue
									value={amount}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							eventTxHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const eventTxHash = resolvedEntity.eventTxHash}
					{#if eventTxHash !== undefined && eventTxHash !== null}
						<div>
							<dt>event transaction hash</dt>
							<dd>
								<TruncatedValue value={String((eventTxHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const bnbBeaconTokenMigrationBnbBeaconTokenMigrationTimestampsViewTimestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={bnbBeaconTokenMigrationBnbBeaconTokenMigrationTimestampsViewTimestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
				<BnbBeaconTokenMigration_TimestampsView
					selection={bnbBeaconTokenMigrationBnbBeaconTokenMigrationTimestampsViewTimestampsResource}
					countResource={bnbBeaconTokenMigrationBnbBeaconTokenMigrationTimestampsViewTimestampsResource.count}
					title='timestamps'
					id='BnbBeaconTokenMigration_TimestampsView-timestamps'
				/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>

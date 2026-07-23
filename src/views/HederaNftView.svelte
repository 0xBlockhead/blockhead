<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { RegisteredEntityProxyPrefetchedData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
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
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyResource<EntityType.HederaNft>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.HederaNft>
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
	const hederaNft = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {
			createdTimestamp: true,
		},
	} : {
		sources: selection.sources,
		fields: {
			createdTimestamp: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.serialNumber) ?? '')].filter(Boolean).join(' ') || 'hedera NFT')
	const viewDomId = $derived('hedera-nft-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import HederaTokenTransfersView from '$/views/HederaTokenTransfersView.svelte'
	import HederaNft_TimestampsView from '$/views/HederaNft_TimestampsView.svelte'
	import HederaTokenView from '$/views/HederaTokenView.svelte'
</script>


<EntityView
	entityType={EntityType.HederaNft}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, '$token') && prefetched.$token != null && Object.hasOwn(prefetched.$token, 'tokenType') && Object.hasOwn(prefetched.$token, 'decimals') && Object.hasOwn(prefetched, 'createdTimestamp')}
			{@const serialNumber0 = pendingEntity.serialNumber}
			{#if serialNumber0 !== undefined && serialNumber0 !== null}
				<NumberValue
					value={serialNumber0}
				/>
			{/if}
		{:else}
			<ResourceBoundary resource={hederaNft}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const serialNumber0 = resolvedEntity.serialNumber}
					{#if serialNumber0 !== undefined && serialNumber0 !== null}
						<NumberValue
							value={serialNumber0}
						/>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, '$token') && prefetched.$token != null && Object.hasOwn(prefetched.$token, 'tokenType') && Object.hasOwn(prefetched.$token, 'decimals') && Object.hasOwn(prefetched, 'createdTimestamp')}
			{@const hederaToken0 = pendingEntity.$token}
			{#if hederaToken0 != null && selection.entitySelector.$token != null}
				<HederaTokenView
					selection={select(EntityType.HederaToken, selection.entitySelector.$token, { sources: selection.sources })}
					prefetched={hederaToken0}
					href=""
					layout={EntityLayout.Value}
					open={false}
				/>
			{/if}
		{:else}
			<ResourceBoundary resource={hederaNft}>
				{#snippet children(entity)}
					<HederaTokenView
						selection={select(EntityType.HederaToken, selection.entitySelector.$token)}
						href=""
						layout={EntityLayout.Value}
						open={false}
					/>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, '$token') && prefetched.$token != null && Object.hasOwn(prefetched.$token, 'tokenType') && Object.hasOwn(prefetched.$token, 'decimals') && Object.hasOwn(prefetched, 'createdTimestamp')}
			{@const createdTimestamp0 = pendingEntity.createdTimestamp}
			{#if createdTimestamp0 !== undefined && createdTimestamp0 !== null}
				<span data-text="muted">
					{String((createdTimestamp0) ?? '')}
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={hederaNft}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const createdTimestamp0 = resolvedEntity.createdTimestamp}
					{#if createdTimestamp0 !== undefined && createdTimestamp0 !== null}
						<span data-text="muted">
							{String((createdTimestamp0) ?? '')}
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>token</dt>
				<dd>
					<HederaTokenView
						selection={select(EntityType.HederaToken, selection.entitySelector.$token)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>serial number</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									serialNumber: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const serialNumber = resolvedEntity.serialNumber}
							{#if serialNumber !== undefined && serialNumber !== null}
								<NumberValue
									value={serialNumber}
								/>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							metadata: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const metadata = resolvedEntity.metadata}
					{#if metadata !== undefined && metadata !== null}
						<div>
							<dt>metadata</dt>
							<dd>
								{String((metadata) ?? '')}
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
							createdTimestamp: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const createdTimestamp = resolvedEntity.createdTimestamp}
					{#if createdTimestamp !== undefined && createdTimestamp !== null}
						<div>
							<dt>created timestamp</dt>
							<dd>
								{String((createdTimestamp) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const hederaNftHederaTokenTransfersViewTransfersResource = selection.$$transfers}
		<ResourceBoundary
			resource={hederaNftHederaTokenTransfersViewTransfersResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
				<HederaTokenTransfersView
					selection={hederaNftHederaTokenTransfersViewTransfersResource}
					countResource={hederaNftHederaTokenTransfersViewTransfersResource.count}
					title='Transfers'
					id='HederaTokenTransfersView-transfers'
				/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const hederaNftHederaNftTimestampsViewTimestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={hederaNftHederaNftTimestampsViewTimestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
				<HederaNft_TimestampsView
					selection={hederaNftHederaNftTimestampsViewTimestampsResource}
					countResource={hederaNftHederaNftTimestampsViewTimestampsResource.count}
					title='Observations'
					id='HederaNft_TimestampsView-timestamps'
				/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>

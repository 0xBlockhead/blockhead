<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


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
	}: Omit<EntitySelectionViewProps<EntityType.HederaNft>, 'prefetched'> = $props()

	const token = $derived(selection.entitySelector.$token)
	const hederaNft = $derived(selection({
		fields: {
			createdTimestamp: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import HederaTokenTransfersView from '$/views/HederaTokenTransfersView.svelte'
	import HederaNft_TimestampsView from '$/views/HederaNft_TimestampsView.svelte'
	import HederaTokenView from '$/views/HederaTokenView.svelte'
</script>


<EntityView
	entityType={EntityType.HederaNft}
	entitySelector={selection.entitySelector}
	title={title ?? String(selection.entitySelector.serialNumber)}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/token/[tokenId=stringSegment]/(selection)/nft/[serialNumber=nonNegativeBigInt]',
				{
					network: (
						'caip2' in token.$network ?
							caip2StringFromValue(token.$network.caip2)
						:
							token.$network.slug
					),
					tokenId: token.tokenId,
					serialNumber: String(selection.entitySelector.serialNumber),
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
		<NumberValue
			value={selection.entitySelector.serialNumber}
		/>
	{/snippet}

	{#snippet Value()}
		<HederaTokenView
			selection={select(EntityType.HederaToken, selection.entitySelector.$token)}
			href={null}
			layout={EntityLayout.Value}
		/>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={hederaNft}>
			{#snippet children(entity)}
				{@const createdTimestamp = entity.createdTimestamp}
				{#if createdTimestamp != null}
					<span data-text="muted">
						{createdTimestamp}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>token</dt>
				<dd>
					<HederaTokenView
						selection={select(EntityType.HederaToken, selection.entitySelector.$token)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>serial number</dt>
				<dd>
					<NumberValue
						value={selection.entitySelector.serialNumber}
					/>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							metadata: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const metadata = entity.metadata}
					{#if metadata != null}
						<div>
							<dt>metadata</dt>
							<dd>
								{metadata}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={hederaNft}
			>
				{#snippet children(entity)}
					{@const createdTimestamp = entity.createdTimestamp}
					{#if createdTimestamp != null}
						<div>
							<dt>created timestamp</dt>
							<dd>
								{createdTimestamp}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details()}
		{@const transfersResource = selection.$$transfers}
		<ResourceBoundary
			resource={transfersResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<HederaTokenTransfersView
						selection={transfersResource}
						countResource={transfersResource.count}
						title='Transfers'
						id='transfers'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const timestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={timestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<HederaNft_TimestampsView
						selection={timestampsResource}
						countResource={timestampsResource.count}
						title='Observations'
						id='timestamps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>

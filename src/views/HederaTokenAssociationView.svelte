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
			selection: RegisteredEntityProxyResource<EntityType.HederaTokenAssociation>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.HederaTokenAssociation>
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
	const hederaTokenAssociation = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {},
	} : {
		sources: selection.sources,
	}))
	const titleFallback = 'hedera token association'
	const viewDomId = $derived('hedera-token-association-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import HederaTokenAssociation_TimestampsView from '$/views/HederaTokenAssociation_TimestampsView.svelte'
	import HederaAccountView from '$/views/HederaAccountView.svelte'
	import HederaTokenView from '$/views/HederaTokenView.svelte'
</script>


<EntityView
	entityType={EntityType.HederaTokenAssociation}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={hederaTokenAssociation}>
			{#snippet children(entity)}
				<HederaTokenView
					selection={select(EntityType.HederaToken, selection.entitySelector.$token)}
					href=""
					layout={EntityLayout.Title}
					open={false}
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={hederaTokenAssociation}>
			{#snippet children(entity)}
				<HederaAccountView
					selection={select(EntityType.HederaAccount, selection.entitySelector.$account)}
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
				<dt>account</dt>
				<dd>
					<HederaAccountView
						selection={select(EntityType.HederaAccount, selection.entitySelector.$account)}
						href={
							(
								selection.entitySelector.$account != null && 'accountId' in selection.entitySelector.$account
								&& selection.entitySelector.$account.accountId != null
								&& selection.entitySelector.$account != null && '$network' in selection.entitySelector.$account ?
									selection.entitySelector.$account.$network != null && 'caip2' in selection.entitySelector.$account.$network
									&& selection.entitySelector.$account.$network.caip2 != null ?
										resolve('/network/[network=networkCaip2OrNetworkSlug]/account/[accountId=polkadotAccountIdOrStringSegmentOrEvmAddressOrSolanaPubkey]', {
									accountId: String(selection.entitySelector.$account.accountId ?? ''),
									network: String(caip2StringFromValue(selection.entitySelector.$account.$network.caip2) ?? ''),
								})
								:
										selection.entitySelector.$account.$network != null && 'slug' in selection.entitySelector.$account.$network
										&& selection.entitySelector.$account.$network.slug != null ?
											resolve('/network/[network=networkCaip2OrNetworkSlug]/account/[accountId=polkadotAccountIdOrStringSegmentOrEvmAddressOrSolanaPubkey]', {
										accountId: String(selection.entitySelector.$account.accountId ?? ''),
										network: String(selection.entitySelector.$account.$network.slug ?? ''),
									})
									:
										undefined
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
				<dt>token</dt>
				<dd>
					<HederaTokenView
						selection={select(EntityType.HederaToken, selection.entitySelector.$token)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const hederaTokenAssociationHederaTokenAssociationTimestampsViewTimestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={hederaTokenAssociationHederaTokenAssociationTimestampsViewTimestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
				<HederaTokenAssociation_TimestampsView
					selection={hederaTokenAssociationHederaTokenAssociationTimestampsViewTimestampsResource}
					countResource={hederaTokenAssociationHederaTokenAssociationTimestampsViewTimestampsResource.count}
					title='Observations'
					id='HederaTokenAssociation_TimestampsView-timestamps'
				/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>

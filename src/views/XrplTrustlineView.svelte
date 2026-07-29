<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
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
	}: EntitySelectionViewProps<EntityType.XrplTrustline> = $props()

	const network = $derived(selection.entitySelector.$network)


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import XrplAccountView from '$/views/XrplAccountView.svelte'
</script>


<EntityView
	entityType={EntityType.XrplTrustline}
	entitySelector={selection.entitySelector}
	title={title ?? 'XRPL trustline'}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/trustline/[account=stringSegment]/[currency=stringSegment]/[issuer=stringSegment]',
				{
					network: (
						'caip2' in network ?
							caip2StringFromValue(network.caip2)
						:
							network.slug
					),
					account: selection.entitySelector.account,
					currency: selection.entitySelector.currency,
					issuer: selection.entitySelector.issuer,
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
		XRPL trustline
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>account</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.account} />
				</dd>
			</div>

			<div>
				<dt>currency</dt>
				<dd>
					{selection.entitySelector.currency}
				</dd>
			</div>

			<div>
				<dt>issuer</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.issuer} />
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$account}
			>
				{#snippet children(xrplAccount)}
					{#if xrplAccount != null}
						<div>
							<dt>account</dt>
							<dd>
								<XrplAccountView
									selection={select(EntityType.XrplAccount, xrplAccount[EntityMetaKey.Selector])}
									prefetched={xrplAccount}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$issuerAccount}
			>
				{#snippet children(xrplAccount)}
					{#if xrplAccount != null}
						<div>
							<dt>issuer account</dt>
							<dd>
								<XrplAccountView
									selection={select(EntityType.XrplAccount, xrplAccount[EntityMetaKey.Selector])}
									prefetched={xrplAccount}
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
</EntityView>

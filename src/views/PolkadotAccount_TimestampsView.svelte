<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntitiesListForwardProps } from '$/components/EntitiesList.svelte'
	import type { RegisteredEntityProxyEntitiesSelection } from '$/client/$proxy.svelte.ts'
	import type { SvelteKitResource } from '$/lib/db/queryResource.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'




	// State
	let {
		selection,
		countResource,
		title = 'Account snapshots',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'PolkadotAccount_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.PolkadotAccount_Timestamp>
			countResource?: SvelteKitResource<number>
			title?: string
			typeAnnotationParagraphs?: string[]
			placeholderText?: string
			emptyText?: string
			open?: boolean
			collapsible?: boolean
			showTypeAnnotation?: boolean
			id?: string
		},
		EntitiesListForwardProps
	> = $props()


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.PolkadotAccount_Timestamp}
	{id}
	{title}
	bind:open
	{collapsible}
	{showTypeAnnotation}
	TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	resource={
		selection({
			sources: selection.sources,
			fields: {
				source: true,
				freeBalancePlancks: true,
				nonce: true,
				timestampMs: true,
				$account: true,
			},
		})
	}
	{countResource}
	getResourceItems={(polkadotAccountTimestamps) => [...new Map(polkadotAccountTimestamps.values.map((polkadotAccountTimestamp) => [polkadotAccountTimestamp[EntityMetaKey.SelectorKey], polkadotAccountTimestamp])).values()]}
	getKey={(polkadotAccountTimestamp) => polkadotAccountTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Polkadot account observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: polkadotAccountTimestamp })}
		{@const polkadotAccountTimestampFields = { ...polkadotAccountTimestamp[EntityMetaKey.Selector], ...polkadotAccountTimestamp }}
		<EntityView
			entityType={EntityType.PolkadotAccount_Timestamp}
			entitySelector={polkadotAccountTimestamp[EntityMetaKey.Selector]}
			href={
				(
					polkadotAccountTimestamp[EntityMetaKey.Selector] != null && 'timestampMs' in polkadotAccountTimestamp[EntityMetaKey.Selector]
					&& polkadotAccountTimestamp[EntityMetaKey.Selector].timestampMs != null
					&& polkadotAccountTimestamp[EntityMetaKey.Selector] != null && 'source' in polkadotAccountTimestamp[EntityMetaKey.Selector]
					&& polkadotAccountTimestamp[EntityMetaKey.Selector].source != null
					&& polkadotAccountTimestamp[EntityMetaKey.Selector] != null && '$account' in polkadotAccountTimestamp[EntityMetaKey.Selector]
					&& polkadotAccountTimestamp[EntityMetaKey.Selector].$account != null && 'accountId' in polkadotAccountTimestamp[EntityMetaKey.Selector].$account
					&& polkadotAccountTimestamp[EntityMetaKey.Selector].$account.accountId != null
					&& polkadotAccountTimestamp[EntityMetaKey.Selector].$account != null && '$network' in polkadotAccountTimestamp[EntityMetaKey.Selector].$account ?
						polkadotAccountTimestamp[EntityMetaKey.Selector].$account.$network != null && 'caip2' in polkadotAccountTimestamp[EntityMetaKey.Selector].$account.$network
						&& polkadotAccountTimestamp[EntityMetaKey.Selector].$account.$network.caip2 != null ?
							resolve('/network/[network=networkCaip2OrNetworkSlug]/account/[accountId=polkadotAccountIdOrStringSegmentOrEvmAddressOrSolanaPubkey]/observation/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
						timestampMs: String(polkadotAccountTimestamp[EntityMetaKey.Selector].timestampMs ?? ''),
						source: String(polkadotAccountTimestamp[EntityMetaKey.Selector].source ?? ''),
						accountId: String(polkadotAccountTimestamp[EntityMetaKey.Selector].$account.accountId ?? ''),
						network: String(caip2StringFromValue(polkadotAccountTimestamp[EntityMetaKey.Selector].$account.$network.caip2) ?? ''),
					})
					:
							polkadotAccountTimestamp[EntityMetaKey.Selector].$account.$network != null && 'slug' in polkadotAccountTimestamp[EntityMetaKey.Selector].$account.$network
							&& polkadotAccountTimestamp[EntityMetaKey.Selector].$account.$network.slug != null ?
								resolve('/network/[network=networkCaip2OrNetworkSlug]/account/[accountId=polkadotAccountIdOrStringSegmentOrEvmAddressOrSolanaPubkey]/observation/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
							timestampMs: String(polkadotAccountTimestamp[EntityMetaKey.Selector].timestampMs ?? ''),
							source: String(polkadotAccountTimestamp[EntityMetaKey.Selector].source ?? ''),
							accountId: String(polkadotAccountTimestamp[EntityMetaKey.Selector].$account.accountId ?? ''),
							network: String(polkadotAccountTimestamp[EntityMetaKey.Selector].$account.$network.slug ?? ''),
						})
						:
							undefined
				:
						undefined
				)
			}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((polkadotAccountTimestampFields.source) ?? '')].filter(Boolean).join(' ') || 'Polkadot account timestamp'}
			{/snippet}

			{#snippet Value()}
				{[String((polkadotAccountTimestampFields.freeBalancePlancks) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((polkadotAccountTimestampFields.nonce) ?? ''), String((polkadotAccountTimestampFields.timestampMs) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>

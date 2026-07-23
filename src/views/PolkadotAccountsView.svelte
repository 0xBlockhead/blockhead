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
		title = 'Accounts',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'PolkadotAccounts-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.PolkadotAccount>
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
	entityType={EntityType.PolkadotAccount}
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
				accountId: true,
				$network: true,
			},
		})
	}
	{countResource}
	getResourceItems={(polkadotAccounts) => [...new Map(polkadotAccounts.values.map((polkadotAccount) => [polkadotAccount[EntityMetaKey.SelectorKey], polkadotAccount])).values()]}
	getKey={(polkadotAccount) => polkadotAccount[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Polkadot accounts yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: polkadotAccount })}
		{@const polkadotAccountFields = { ...polkadotAccount[EntityMetaKey.Selector], ...polkadotAccount }}
		<EntityView
			entityType={EntityType.PolkadotAccount}
			entitySelector={polkadotAccount[EntityMetaKey.Selector]}
			href={
				(
					polkadotAccount[EntityMetaKey.Selector] != null && 'accountId' in polkadotAccount[EntityMetaKey.Selector]
					&& polkadotAccount[EntityMetaKey.Selector].accountId != null
					&& polkadotAccount[EntityMetaKey.Selector] != null && '$network' in polkadotAccount[EntityMetaKey.Selector] ?
						polkadotAccount[EntityMetaKey.Selector].$network != null && 'caip2' in polkadotAccount[EntityMetaKey.Selector].$network
						&& polkadotAccount[EntityMetaKey.Selector].$network.caip2 != null ?
							resolve('/network/[network=networkCaip2OrNetworkSlug]/account/[accountId=polkadotAccountIdOrStringSegmentOrEvmAddressOrSolanaPubkey]', {
						accountId: String(polkadotAccount[EntityMetaKey.Selector].accountId ?? ''),
						network: String(caip2StringFromValue(polkadotAccount[EntityMetaKey.Selector].$network.caip2) ?? ''),
					})
					:
							polkadotAccount[EntityMetaKey.Selector].$network != null && 'slug' in polkadotAccount[EntityMetaKey.Selector].$network
							&& polkadotAccount[EntityMetaKey.Selector].$network.slug != null ?
								resolve('/network/[network=networkCaip2OrNetworkSlug]/account/[accountId=polkadotAccountIdOrStringSegmentOrEvmAddressOrSolanaPubkey]', {
							accountId: String(polkadotAccount[EntityMetaKey.Selector].accountId ?? ''),
							network: String(polkadotAccount[EntityMetaKey.Selector].$network.slug ?? ''),
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
				{[String((polkadotAccountFields.accountId) ?? '')].filter(Boolean).join(' ') || 'Polkadot account'}
			{/snippet}

			{#snippet Value()}
				{[String((polkadotAccountFields.accountId) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[[String((polkadotAccountFields.$network.name) ?? '')].filter(Boolean).join(' ') || [polkadotAccountFields.$network.caip2 == null ? '' : String(`${(polkadotAccountFields.$network.caip2).namespace}:${(polkadotAccountFields.$network.caip2).reference}`)].filter(Boolean).join(' ') || 'Network'].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>

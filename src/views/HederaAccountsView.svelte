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
		title = 'Hedera accounts',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'HederaAccounts-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.HederaAccount>
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
	entityType={EntityType.HederaAccount}
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
	getResourceItems={(hederaAccounts) => [...new Map(hederaAccounts.values.map((hederaAccount) => [hederaAccount[EntityMetaKey.SelectorKey], hederaAccount])).values()]}
	getKey={(hederaAccount) => hederaAccount[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Hedera accounts yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: hederaAccount })}
		{@const hederaAccountFields = { ...hederaAccount[EntityMetaKey.Selector], ...hederaAccount }}
		<EntityView
			entityType={EntityType.HederaAccount}
			entitySelector={hederaAccount[EntityMetaKey.Selector]}
			href={
				(
					hederaAccount[EntityMetaKey.Selector] != null && 'accountId' in hederaAccount[EntityMetaKey.Selector]
					&& hederaAccount[EntityMetaKey.Selector].accountId != null
					&& hederaAccount[EntityMetaKey.Selector] != null && '$network' in hederaAccount[EntityMetaKey.Selector] ?
						hederaAccount[EntityMetaKey.Selector].$network != null && 'caip2' in hederaAccount[EntityMetaKey.Selector].$network
						&& hederaAccount[EntityMetaKey.Selector].$network.caip2 != null ?
							resolve('/network/[network=networkCaip2OrNetworkSlug]/account/[accountId=polkadotAccountIdOrStringSegmentOrEvmAddressOrSolanaPubkey]', {
						accountId: String(hederaAccount[EntityMetaKey.Selector].accountId ?? ''),
						network: String(caip2StringFromValue(hederaAccount[EntityMetaKey.Selector].$network.caip2) ?? ''),
					})
					:
							hederaAccount[EntityMetaKey.Selector].$network != null && 'slug' in hederaAccount[EntityMetaKey.Selector].$network
							&& hederaAccount[EntityMetaKey.Selector].$network.slug != null ?
								resolve('/network/[network=networkCaip2OrNetworkSlug]/account/[accountId=polkadotAccountIdOrStringSegmentOrEvmAddressOrSolanaPubkey]', {
							accountId: String(hederaAccount[EntityMetaKey.Selector].accountId ?? ''),
							network: String(hederaAccount[EntityMetaKey.Selector].$network.slug ?? ''),
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
				{[String((hederaAccountFields.accountId) ?? '')].filter(Boolean).join(' ') || 'hedera account'}
			{/snippet}

			{#snippet Value()}
				{[[String((hederaAccountFields.$network.name) ?? '')].filter(Boolean).join(' ') || [hederaAccountFields.$network.caip2 == null ? '' : String(`${(hederaAccountFields.$network.caip2).namespace}:${(hederaAccountFields.$network.caip2).reference}`)].filter(Boolean).join(' ') || 'Network'].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>

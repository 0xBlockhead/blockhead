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
		title = 'TON accounts',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'TonAccounts-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.TonAccount>
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
	entityType={EntityType.TonAccount}
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
				address: true,
				$network: true,
			},
		})
	}
	{countResource}
	getResourceItems={(tonAccounts) => [...new Map(tonAccounts.values.map((tonAccount) => [tonAccount[EntityMetaKey.SelectorKey], tonAccount])).values()]}
	getKey={(tonAccount) => tonAccount[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No TON accounts yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: tonAccount })}
		{@const tonAccountFields = { ...tonAccount[EntityMetaKey.Selector], ...tonAccount }}
		<EntityView
			entityType={EntityType.TonAccount}
			entitySelector={tonAccount[EntityMetaKey.Selector]}
			href={
				(
					tonAccount[EntityMetaKey.Selector] != null && 'address' in tonAccount[EntityMetaKey.Selector]
					&& tonAccount[EntityMetaKey.Selector].address != null
					&& tonAccount[EntityMetaKey.Selector] != null && '$network' in tonAccount[EntityMetaKey.Selector] ?
						tonAccount[EntityMetaKey.Selector].$network != null && 'caip2' in tonAccount[EntityMetaKey.Selector].$network
						&& tonAccount[EntityMetaKey.Selector].$network.caip2 != null ?
							resolve('/network/[network=networkCaip2OrNetworkSlug]/account/[accountId=polkadotAccountIdOrStringSegmentOrEvmAddressOrSolanaPubkey]', {
						accountId: String(tonAccount[EntityMetaKey.Selector].address ?? ''),
						network: String(caip2StringFromValue(tonAccount[EntityMetaKey.Selector].$network.caip2) ?? ''),
					})
					:
							tonAccount[EntityMetaKey.Selector].$network != null && 'slug' in tonAccount[EntityMetaKey.Selector].$network
							&& tonAccount[EntityMetaKey.Selector].$network.slug != null ?
								resolve('/network/[network=networkCaip2OrNetworkSlug]/account/[accountId=polkadotAccountIdOrStringSegmentOrEvmAddressOrSolanaPubkey]', {
							accountId: String(tonAccount[EntityMetaKey.Selector].address ?? ''),
							network: String(tonAccount[EntityMetaKey.Selector].$network.slug ?? ''),
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
				{'TON account'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>

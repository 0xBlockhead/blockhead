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
		title = 'Ethereum network upgrades',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'EthereumNetworkUpgrades-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.EthereumNetworkUpgrade>
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
	entityType={EntityType.EthereumNetworkUpgrade}
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
				upgradeId: true,
				name: true,
				slug: true,
				$network: true,
			},
		})
	}
	{countResource}
	getResourceItems={(ethereumNetworkUpgrades) => [...new Map(ethereumNetworkUpgrades.values.map((ethereumNetworkUpgrade) => [ethereumNetworkUpgrade[EntityMetaKey.SelectorKey], ethereumNetworkUpgrade])).values()]}
	getKey={(ethereumNetworkUpgrade) => ethereumNetworkUpgrade[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Ethereum network upgrades yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: ethereumNetworkUpgrade })}
		{@const ethereumNetworkUpgradeFields = { ...ethereumNetworkUpgrade[EntityMetaKey.Selector], ...ethereumNetworkUpgrade }}
		<EntityView
			entityType={EntityType.EthereumNetworkUpgrade}
			entitySelector={ethereumNetworkUpgrade[EntityMetaKey.Selector]}
			href={
				(
					ethereumNetworkUpgrade[EntityMetaKey.Selector] != null && 'slug' in ethereumNetworkUpgrade[EntityMetaKey.Selector]
					&& ethereumNetworkUpgrade[EntityMetaKey.Selector].slug != null
					&& ethereumNetworkUpgrade[EntityMetaKey.Selector] != null && '$network' in ethereumNetworkUpgrade[EntityMetaKey.Selector] ?
						ethereumNetworkUpgrade[EntityMetaKey.Selector].$network != null && 'caip2' in ethereumNetworkUpgrade[EntityMetaKey.Selector].$network
						&& ethereumNetworkUpgrade[EntityMetaKey.Selector].$network.caip2 != null ?
							resolve('/network/[network=networkCaip2OrNetworkSlug]/upgrade/[upgradeSlug=stringSegment]', {
						upgradeSlug: String(ethereumNetworkUpgrade[EntityMetaKey.Selector].slug ?? ''),
						network: String(caip2StringFromValue(ethereumNetworkUpgrade[EntityMetaKey.Selector].$network.caip2) ?? ''),
					})
					:
							ethereumNetworkUpgrade[EntityMetaKey.Selector].$network != null && 'slug' in ethereumNetworkUpgrade[EntityMetaKey.Selector].$network
							&& ethereumNetworkUpgrade[EntityMetaKey.Selector].$network.slug != null ?
								resolve('/network/[network=networkCaip2OrNetworkSlug]/upgrade/[upgradeSlug=stringSegment]', {
							upgradeSlug: String(ethereumNetworkUpgrade[EntityMetaKey.Selector].slug ?? ''),
							network: String(ethereumNetworkUpgrade[EntityMetaKey.Selector].$network.slug ?? ''),
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
				{[String((ethereumNetworkUpgradeFields.upgradeId) ?? '')].filter(Boolean).join(' ') || [String((ethereumNetworkUpgradeFields.name) ?? '')].filter(Boolean).join(' ') || 'Ethereum network upgrade'}
			{/snippet}

			{#snippet Value()}
				{[String((ethereumNetworkUpgradeFields.upgradeId) ?? '')].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>

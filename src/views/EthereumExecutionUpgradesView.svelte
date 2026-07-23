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
		title = 'Ethereum execution upgrades',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'EthereumExecutionUpgrades-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.EthereumExecutionUpgrade>
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
	entityType={EntityType.EthereumExecutionUpgrade}
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
	getResourceItems={(ethereumExecutionUpgrades) => [...new Map(ethereumExecutionUpgrades.values.map((ethereumExecutionUpgrade) => [ethereumExecutionUpgrade[EntityMetaKey.SelectorKey], ethereumExecutionUpgrade])).values()]}
	getKey={(ethereumExecutionUpgrade) => ethereumExecutionUpgrade[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Ethereum execution upgrades yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: ethereumExecutionUpgrade })}
		{@const ethereumExecutionUpgradeFields = { ...ethereumExecutionUpgrade[EntityMetaKey.Selector], ...ethereumExecutionUpgrade }}
		<EntityView
			entityType={EntityType.EthereumExecutionUpgrade}
			entitySelector={ethereumExecutionUpgrade[EntityMetaKey.Selector]}
			href={
				(
					ethereumExecutionUpgrade[EntityMetaKey.Selector] != null && 'slug' in ethereumExecutionUpgrade[EntityMetaKey.Selector]
					&& ethereumExecutionUpgrade[EntityMetaKey.Selector].slug != null
					&& ethereumExecutionUpgrade[EntityMetaKey.Selector] != null && '$network' in ethereumExecutionUpgrade[EntityMetaKey.Selector] ?
						ethereumExecutionUpgrade[EntityMetaKey.Selector].$network != null && 'caip2' in ethereumExecutionUpgrade[EntityMetaKey.Selector].$network
						&& ethereumExecutionUpgrade[EntityMetaKey.Selector].$network.caip2 != null ?
							resolve('/network/[network=networkCaip2OrNetworkSlug]/execution/[upgradeSlug=stringSegment]', {
						upgradeSlug: String(ethereumExecutionUpgrade[EntityMetaKey.Selector].slug ?? ''),
						network: String(caip2StringFromValue(ethereumExecutionUpgrade[EntityMetaKey.Selector].$network.caip2) ?? ''),
					})
					:
							ethereumExecutionUpgrade[EntityMetaKey.Selector].$network != null && 'slug' in ethereumExecutionUpgrade[EntityMetaKey.Selector].$network
							&& ethereumExecutionUpgrade[EntityMetaKey.Selector].$network.slug != null ?
								resolve('/network/[network=networkCaip2OrNetworkSlug]/execution/[upgradeSlug=stringSegment]', {
							upgradeSlug: String(ethereumExecutionUpgrade[EntityMetaKey.Selector].slug ?? ''),
							network: String(ethereumExecutionUpgrade[EntityMetaKey.Selector].$network.slug ?? ''),
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
				{[String((ethereumExecutionUpgradeFields.upgradeId) ?? '')].filter(Boolean).join(' ') || [String((ethereumExecutionUpgradeFields.name) ?? '')].filter(Boolean).join(' ') || 'Ethereum execution upgrade'}
			{/snippet}

			{#snippet Value()}
				{[String((ethereumExecutionUpgradeFields.upgradeId) ?? '')].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>

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
		title = 'Ethereum consensus upgrades',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'EthereumConsensusUpgrades-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.EthereumConsensusUpgrade>
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
	entityType={EntityType.EthereumConsensusUpgrade}
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
	getResourceItems={(ethereumConsensusUpgrades) => [...new Map(ethereumConsensusUpgrades.values.map((ethereumConsensusUpgrade) => [ethereumConsensusUpgrade[EntityMetaKey.SelectorKey], ethereumConsensusUpgrade])).values()]}
	getKey={(ethereumConsensusUpgrade) => ethereumConsensusUpgrade[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Ethereum consensus upgrades yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: ethereumConsensusUpgrade })}
		{@const ethereumConsensusUpgradeFields = { ...ethereumConsensusUpgrade[EntityMetaKey.Selector], ...ethereumConsensusUpgrade }}
		<EntityView
			entityType={EntityType.EthereumConsensusUpgrade}
			entitySelector={ethereumConsensusUpgrade[EntityMetaKey.Selector]}
			href={
				(
					ethereumConsensusUpgrade[EntityMetaKey.Selector] != null && 'slug' in ethereumConsensusUpgrade[EntityMetaKey.Selector]
					&& ethereumConsensusUpgrade[EntityMetaKey.Selector].slug != null
					&& ethereumConsensusUpgrade[EntityMetaKey.Selector] != null && '$network' in ethereumConsensusUpgrade[EntityMetaKey.Selector] ?
						ethereumConsensusUpgrade[EntityMetaKey.Selector].$network != null && 'caip2' in ethereumConsensusUpgrade[EntityMetaKey.Selector].$network
						&& ethereumConsensusUpgrade[EntityMetaKey.Selector].$network.caip2 != null ?
							resolve('/network/[network=networkCaip2OrNetworkSlug]/consensus/[upgradeSlug=stringSegment]', {
						upgradeSlug: String(ethereumConsensusUpgrade[EntityMetaKey.Selector].slug ?? ''),
						network: String(caip2StringFromValue(ethereumConsensusUpgrade[EntityMetaKey.Selector].$network.caip2) ?? ''),
					})
					:
							ethereumConsensusUpgrade[EntityMetaKey.Selector].$network != null && 'slug' in ethereumConsensusUpgrade[EntityMetaKey.Selector].$network
							&& ethereumConsensusUpgrade[EntityMetaKey.Selector].$network.slug != null ?
								resolve('/network/[network=networkCaip2OrNetworkSlug]/consensus/[upgradeSlug=stringSegment]', {
							upgradeSlug: String(ethereumConsensusUpgrade[EntityMetaKey.Selector].slug ?? ''),
							network: String(ethereumConsensusUpgrade[EntityMetaKey.Selector].$network.slug ?? ''),
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
				{[String((ethereumConsensusUpgradeFields.upgradeId) ?? '')].filter(Boolean).join(' ') || [String((ethereumConsensusUpgradeFields.name) ?? '')].filter(Boolean).join(' ') || 'Ethereum consensus upgrade'}
			{/snippet}

			{#snippet Value()}
				{[String((ethereumConsensusUpgradeFields.upgradeId) ?? '')].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>

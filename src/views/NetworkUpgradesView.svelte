<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntitiesListForwardProps } from '$/components/EntitiesList.svelte'
	import type { RegisteredEntityProxyEntitiesSelection } from '$/client/$proxy.svelte.ts'
	import type { SvelteKitResource } from '$/lib/db/queryResource.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'




	// State
	let {
		selection,
		countResource,
		title = 'Network upgrades',
		typeAnnotationParagraphs = ['A generic network-upgrade compatibility row keyed by network and upgrade id. Rich Ethereum-specific upgrade modeling remains on EthereumNetworkUpgrade and related execution/consensus rows.'],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'NetworkUpgrades-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.NetworkUpgrade>
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
	entityType={EntityType.NetworkUpgrade}
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
				name: true,
				upgradeId: true,
				$network: true,
			},
		})
	}
	{countResource}
	getResourceItems={(networkUpgrades) => [...new Map(networkUpgrades.values.map((networkUpgrade) => [networkUpgrade[EntityMetaKey.SelectorKey], networkUpgrade])).values()]}
	getKey={(networkUpgrade) => networkUpgrade[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Network upgrades yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: networkUpgrade })}
		{@const networkUpgradeFields = { ...networkUpgrade[EntityMetaKey.Selector], ...networkUpgrade }}
		<EntityView
			entityType={EntityType.NetworkUpgrade}
			entitySelector={networkUpgrade[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((networkUpgradeFields.name) ?? ''), String((networkUpgradeFields.upgradeId) ?? '')].filter(Boolean).join(' ') || 'network upgrade'}
			{/snippet}

			{#snippet Value()}
				{[[String((networkUpgradeFields.$network.name) ?? '')].filter(Boolean).join(' ') || [networkUpgradeFields.$network.caip2 == null ? '' : String(`${(networkUpgradeFields.$network.caip2).namespace}:${(networkUpgradeFields.$network.caip2).reference}`)].filter(Boolean).join(' ') || 'Network'].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>

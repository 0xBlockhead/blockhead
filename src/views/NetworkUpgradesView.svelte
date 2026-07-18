<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { RegisteredEntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
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
			selection: RegisteredEntityProxyEntitiesResource<EntityType.NetworkUpgrade>
			title?: string
			typeAnnotationParagraphs?: string[]
			placeholderText?: string
			emptyText?: string
			open?: boolean
			collapsible?: boolean
			showTypeAnnotation?: boolean
			id?: string
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'href'
			| 'CollapsibleProps'
		>
	> = $props()

	const collectionSelection = $derived(selection)


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import NetworkUpgradeView from '$/views/NetworkUpgradeView.svelte'
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
		{@const selection = select(EntityType.NetworkUpgrade, networkUpgrade[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<NetworkUpgradeView
			selection={selection}
			prefetched={networkUpgradeFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>

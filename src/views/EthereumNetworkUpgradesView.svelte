<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
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
			selection: RegisteredEntityProxyEntitiesResource<EntityType.EthereumNetworkUpgrade>
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
	import EthereumNetworkUpgradeView from '$/views/EthereumNetworkUpgradeView.svelte'
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
		{@const selection = select(EntityType.EthereumNetworkUpgrade, ethereumNetworkUpgrade[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		{@const ethereumNetworkUpgradeHrefFields = { ...ethereumNetworkUpgrade, ...ethereumNetworkUpgrade[EntityMetaKey.Selector] }}
		<EthereumNetworkUpgradeView
			selection={selection}
			prefetched={ethereumNetworkUpgradeFields}
			href={
				(ethereumNetworkUpgradeHrefFields.slug !== undefined && ethereumNetworkUpgradeHrefFields.$network !== undefined && ethereumNetworkUpgradeHrefFields.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/upgrade/[upgradeSlug=stringSegment]', {
					upgradeSlug: String(ethereumNetworkUpgradeHrefFields.slug ?? ''),
					network: String(caip2StringFromValue(ethereumNetworkUpgradeHrefFields.$network.caip2) ?? ''),
				}) : ethereumNetworkUpgradeHrefFields.slug !== undefined && ethereumNetworkUpgradeHrefFields.$network !== undefined && ethereumNetworkUpgradeHrefFields.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/upgrade/[upgradeSlug=stringSegment]', {
					upgradeSlug: String(ethereumNetworkUpgradeHrefFields.slug ?? ''),
					network: String(ethereumNetworkUpgradeHrefFields.$network.slug ?? ''),
				}) : undefined)
			}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>

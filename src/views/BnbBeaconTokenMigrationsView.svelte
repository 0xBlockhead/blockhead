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
		title = 'Bnb beacon token migrations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BnbBeaconTokenMigrations-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.BnbBeaconTokenMigration>
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
	entityType={EntityType.BnbBeaconTokenMigration}
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
				migrationKind: true,
				$token: true,
				$targetNetwork: true,
			},
		})
	}
	{countResource}
	getResourceItems={(bnbBeaconTokenMigrations) => [...new Map(bnbBeaconTokenMigrations.values.map((bnbBeaconTokenMigration) => [bnbBeaconTokenMigration[EntityMetaKey.SelectorKey], bnbBeaconTokenMigration])).values()]}
	getKey={(bnbBeaconTokenMigration) => bnbBeaconTokenMigration[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Bnb beacon token migrations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: bnbBeaconTokenMigration })}
		{@const bnbBeaconTokenMigrationFields = { ...bnbBeaconTokenMigration[EntityMetaKey.Selector], ...bnbBeaconTokenMigration }}
		<EntityView
			entityType={EntityType.BnbBeaconTokenMigration}
			entitySelector={bnbBeaconTokenMigration[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((bnbBeaconTokenMigrationFields.migrationKind) ?? '')].filter(Boolean).join(' ') || 'bnb beacon token migration'}
			{/snippet}

			{#snippet Value()}
				{[[String((bnbBeaconTokenMigrationFields.$token.symbol) ?? '')].filter(Boolean).join(' ') || 'bnb beacon token', [String((bnbBeaconTokenMigrationFields.$targetNetwork.name) ?? '')].filter(Boolean).join(' ') || [bnbBeaconTokenMigrationFields.$targetNetwork.caip2 == null ? '' : String(`${(bnbBeaconTokenMigrationFields.$targetNetwork.caip2).namespace}:${(bnbBeaconTokenMigrationFields.$targetNetwork.caip2).reference}`)].filter(Boolean).join(' ') || 'Network'].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>

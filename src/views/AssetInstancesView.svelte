<script lang="ts">
	import type { EntityFieldName, EntityType as EntityTypeName } from '$/schema/$schema.ts'
	import type { EntityProxyFieldResource } from '$/client/$proxy.svelte.ts'
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// Context
	// State
	let {
		selection,
		title = 'Native assets',
		emptyText = 'No native assets mapped for this network yet.',
		open = $bindable(true),
		id,
		href = '',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyFieldResource<
				typeof schema,
				EntityTypeName<typeof schema>,
				EntityFieldName<typeof schema, EntityTypeName<typeof schema>>
			>
			title?: string
			emptyText?: string
			open?: boolean
			id: string
			href?: string
		},
		Pick<ComponentProps<typeof EntitiesList>, 'CollapsibleProps'>
	> = $props()


	


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import AssetInstanceView from '$/views/AssetInstanceView.svelte'
</script>


<EntitiesList
	entityType={EntityType.AssetInstance}
	{title}
	bind:open
	{id}
	href={href}
	{...EntitiesListProps}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Native asset instances cataloged for this network stack (coin deployments and identifiers).
		</p>
	{/snippet}

	{#snippet body()}
		{#if open}
			<ResourceBoundary resource={selection} placeholderText={`Loading ${title.toLowerCase()}…`}>
				{#snippet children(assets)}
					<EntitiesList
						collapsible={false}
						showSummary={false}
						entityType={EntityType.AssetInstance}
						id={`${id}-items`}
						href={href}
						{title}
						getKey={(asset) => `${asset.entitySelector.kind}:${asset.entitySelector.assetKey}`}
						items={assets.entities}
						UnorderedListProps={{ orientation: ListOrientation.Column }}
						open={true}
					>
						{#snippet Empty()}
							<p data-text="muted">{emptyText}</p>
						{/snippet}

						{#snippet Item({ item })}
							<AssetInstanceView
								selector={asset.entitySelector}
								layout={EntityLayout.Summary}

							/>
						{/snippet}
					</EntitiesList>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntitiesList>

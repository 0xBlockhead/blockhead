<script lang="ts">
	import type { EntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import { stringify as stringifyId } from 'devalue'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// Context
		// State
	let {
		title = 'Networks',
		open = $bindable(true),
		selection,
		networkSelectors,
		id,
		href = '',
		...EntitiesListProps
	}: WithRest<
		{
			title?: string
			open?: boolean
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.Network>
			networkSelectors?: readonly EntitySelector<typeof schema, EntityType.Network>[]
			id: string
			href?: string
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'collapsible'
			| 'CollapsibleProps'
		>
	> = $props()



	

	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntitiesList
	entityType={EntityType.Network}
	{title}
	bind:open
	{id}
	href={href}
	{...EntitiesListProps}
>
	{#snippet TypeAnnotationTooltip()}
			<p>
				Networks are concrete public or stack-level systems identified by stack-native references, using CAIP-2-style namespace/reference pairs where that is accurate.
			</p>
		{/snippet}

	{#snippet body()}
		{#if open}
			<ResourceBoundary resource={selection({
					limit: 4096,
				})} placeholderText="Loading networks…">
				{#snippet children(networks)}
					<EntitiesList
						collapsible={false}
						showSummary={false}
						entityType={EntityType.Network}
						id={`${id}-items`}
						href={href}
						{title}
						getKey={(network) => stringifyId(network.entitySelector)}
						getSortValue={(network) => stringifyId(network.entitySelector)}
						items={networks.entities.filter((network) => (
							networkSelectors == null
							|| networkSelectors.some((networkSelector) => (
								stringifyId(networkSelector) === stringifyId(network.entitySelector)
							))
						))}
						UnorderedListProps={{ orientation: ListOrientation.Column }}
						open={true}
					>
						{#snippet Empty()}
							<p data-text="muted">
								No networks match this networks yet.
							</p>
						{/snippet}

						{#snippet Item({ item })}
							<NetworkView
								selection={item}
								layout={EntityLayout.Summary}

							/>
						{/snippet}
					</EntitiesList>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntitiesList>

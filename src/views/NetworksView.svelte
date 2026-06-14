<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import { stringify as stringifyId } from 'devalue'
	import { SvelteSet } from 'svelte/reactivity'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// Context
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'
	// State
	let {
		title = 'Networks',
		open = $bindable(true),
		entityFieldReference,
		networkIds,
		id,
		href = '',
		...EntitiesListProps
	}: WithRest<
		{
			title?: string
			open?: boolean
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.Network>
			networkIds?: readonly EntitySelector<typeof schema, EntityType.Network>[]
			id: string
			href?: string
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'collapsible'
			| 'CollapsibleProps'
		>
	> = $props()

	import { subscribe } from '$/routes/+layout.svelte'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
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
			{@const parent = subscribe(entityFieldReference.entityType,
		entityFieldReference.selector,({ sources: [
				Source.Constants_Internal,
			], fields: { [entityFieldReference.fieldName]: {
				limit: 4096,
			},
		} }),
	)}
			{@const filteredNetworks = derive(
		parent,
		(parent) => {
			const keys = new SvelteSet<string>()
			const networks: readonly Entity<typeof schema, EntityType.Network>[] = parent.fields[entityFieldReference.fieldName]?.values ?? []
			return (
				networks
					.filter((value) => (
						networkIds == null
						|| networkIds.some((networkId) => (
							stringifyId(networkId) === stringifyId(value[EntityMetaKey.Selector])
						))
					))
					.flatMap((value) => {
						const key = stringifyId(value[EntityMetaKey.Selector])
						if (keys.has(key)) return []
						keys.add(key)
						return [{ value }]
					})
			)
		},
	)}
			<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.Network}
				id={`${id}-items`}
				href={href}
				{title}
				getKey={(line) => stringifyId(line.value[EntityMetaKey.Selector])}
				getSortValue={(line) => stringifyId(line.value[EntityMetaKey.Selector])}
				placeholderKeys={new SvelteSet<string | number>()}
				placeholderText="Loading networks…"
				resource={filteredNetworks}
				UnorderedListProps={{ orientation: ListOrientation.Column }}
				open={true}
			>
				{#snippet Empty()}
						<p data-text="muted">
							No networks match this networks yet.
						</p>
					{/snippet}

				{#snippet Item({ item: line })}
						<NetworkView
							selector={line.value[EntityMetaKey.Selector]}
							layout={EntityLayout.Summary}
							open={false}
						/>
					{/snippet}

			</EntitiesList>
		{/if}
	{/snippet}
</EntitiesList>

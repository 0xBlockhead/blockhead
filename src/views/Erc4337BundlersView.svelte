<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// Context
	import { subscribe } from '$/routes/+layout.svelte'
	// State
	let {
		entityFieldReference,
		title = 'ERC-4337 bundlers',
		open = $bindable(true),
		id,
		href = '',
		...EntitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.Erc4337Bundler>
			title?: string
			open?: boolean
			id: string
			href?: string
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'CollapsibleProps'
		>
	> = $props()

	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import Erc4337BundlerView from '$/views/Erc4337BundlerView.svelte'
</script>


<EntitiesList
	entityType={EntityType.Erc4337Bundler}
	{id}
	{title}
	bind:open
	href={href}
	{...EntitiesListProps}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Bundlers batch ERC-4337 user operations and submit them to the entry point on this network.
		</p>
	{/snippet}

	{#snippet body()}
		{#if open}
			{@const network = subscribe(EntityType.EvmNetwork,
				entityFieldReference.selector,
				({ fields: { $$erc4337Bundlers: ({ sources: [
							Source.Blockscout_Rest,
						], limit: 16 }) } }),
			)}
			{@const bundlers = derive(
				network,
				(network): readonly Entity<typeof schema, EntityType.Erc4337Bundler>[] => (
					(network.fields.$$erc4337Bundlers?.values ?? [])
				),
			)}
			<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.Erc4337Bundler}
				id={`${id}-items`}
				href={href}
				getKey={(bundler) => stringify(bundler[EntityMetaKey.Selector])}
				getSortValue={(bundler) => bundler[EntityMetaKey.Selector].address}
				placeholderText="Loading bundlers…"
				resource={bundlers}
				{title}
				UnorderedListProps={{ orientation: ListOrientation.Column }}
				open={true}
			>
				{#snippet Empty()}
					<p data-text="muted">No indexed bundlers yet.</p>
				{/snippet}

				{#snippet Item({ item: bundler })}
					<Erc4337BundlerView
						selector={bundler[EntityMetaKey.Selector]}
						layout={EntityLayout.Summary}
						open={false}
					/>
				{/snippet}
			</EntitiesList>
		{/if}
	{/snippet}
</EntitiesList>

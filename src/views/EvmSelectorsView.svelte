<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { ListOrientation } from '$/components/ListOrientation.ts'
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Context
	import { resolve } from '$app/paths'


	// Props
	let {
		entityFieldReference,
		open = $bindable(true),
		collapsible = true,
		title = '4-byte selectors',
		id,
		href,
		...entitiesListRest
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.EvmSelector>
			open?: boolean
			title?: string
			id: string
			href: string
		},
		Omit<
			ComponentProps<typeof EntitiesList>,
			'entityType'
		>
	> = $props()


	// State
	import { SvelteSet } from 'svelte/reactivity'

	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import EvmSelectorView from '$/views/EvmSelectorView.svelte'
</script>


<EntitiesList
	entityType={EntityType.EvmSelector}
	{id}
	{href}
	{title}
	bind:open
	{...entitiesListRest}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Four-byte function selectors prefix calldata for contract calls; catalogs map them to human-readable signatures.
		</p>
		<p>
			Receipt logs and error selectors follow different decoding rules on receipts and reverts.
		</p>
		<p>
			Rows filter the shared OpenChain-style directory for the current slice.
		</p>
	{/snippet}

	{#snippet body()}
		{#if open}
			{@const global = useEntity(
				EntityType._Global,
				entityFieldReference.entityId,
				{
					$$evmSelectors: {
						$: [
							Source.Local_Internal,
						],
					},
				},
			)}
			{@const selectors = derive(
				global,
				(global): Entity<typeof schema, EntityType.EvmSelector>[] => (
					global.$$evmSelectors
					?? []
				),
			)}
			<div data-column="gap-3">
				<EntitiesList
					collapsible={false}
					showSummary={false}
					entityType={EntityType.EvmSelector}
					id={`${id}-items`}
					{href}
					{title}
					open={true}
					getKey={(row) => row[EntityMetaKey.Id].hex}
					getSortValue={(row) => row[EntityMetaKey.Id].hex}
					placeholderKeys={new SvelteSet()}
					placeholderText="Loading 4-byte selectors…"
					resource={selectors}
					UnorderedListProps={{ orientation: ListOrientation.Column }}
				>
					{#snippet Empty()}
						<p data-text="muted">
							No selectors yet.
						</p>
					{/snippet}

					{#snippet Item(props)}
						{#if props.item}
							<EvmSelectorView
								entityId={props.item[EntityMetaKey.Id]}
								href={resolve('/(explore)/(evm)/evm/(selectors)/selector/[hex]', {
									hex: props.item[EntityMetaKey.Id].hex,
								})}
								layout={EntityLayout.Summary}
								open={false}
								collapsible={false}
								showTypeAnnotation={false}
							/>
						{/if}
					{/snippet}
				</EntitiesList>
			</div>
		{/if}
	{/snippet}
</EntitiesList>

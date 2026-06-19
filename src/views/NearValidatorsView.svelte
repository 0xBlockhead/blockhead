<script lang="ts">
	import { select } from '$/routes/+layout.svelte'
	import type { EntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
import { stringify } from 'devalue'
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// Context
	// State
	let {
		selection,
		title = 'Validators',
		open = $bindable(true),
		id,
		href = '',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.NearValidator>
			title?: string
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
	import NearValidatorView from '$/views/NearValidatorView.svelte'
</script>


<EntitiesList
	entityType={EntityType.NearValidator}
	{title}
	bind:open
	{id}
	href={href}
	{...EntitiesListProps}
>
	{#snippet TypeAnnotationTooltip()}
		<p>NEAR validators produce blocks and chunks for epoch-assigned shards.</p>
	{/snippet}

	{#snippet body()}
		{#if open}
			<ResourceBoundary resource={selection({
					sources: [
						Source.NearRpc_JsonRpc,
					],
					limit: 16,
				})} placeholderText="Loading validators…">
				{#snippet children(validators)}
					<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.NearValidator}
				id={`${id}-items`}
				href={href}
				getKey={(validator) => stringify(validator.entitySelector)}
				open={true}
				items={validators.entities}
				{title}
				UnorderedListProps={{ orientation: ListOrientation.Column }}
			>
				{#snippet Empty()}
					<p data-text="muted">No validators yet.</p>
				{/snippet}

				{#snippet Item({ item })}
					<NearValidatorView
						selection={select(EntityType.NearValidator, item.entitySelector)}
						layout={EntityLayout.Summary}

					/>
				{/snippet}
					</EntitiesList>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntitiesList>

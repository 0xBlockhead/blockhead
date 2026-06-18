<script lang="ts">
	// Types/constants
	import { consensusProtocolByProtocol } from '$/constants/EvmNetwork.ts'
	import type { ComponentProps } from 'svelte'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	// State
	let {
		selector,
		emptyText = 'No consensus endpoints listed for this network yet.',
		title = 'Endpoints',
		open = $bindable(true),
		id,
		href = '',
		...EntitiesListProps
	}: WithRest<
		{
			selector: EntitySelector<typeof schema, EntityType.EvmNetwork>
			emptyText?: string
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
</script>


<EntitiesList
	entityType={EntityType.Url}
	{title}
	bind:open
	{id}
	href={href}
	{...EntitiesListProps}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Beacon REST bases registered for this execution network’s consensus layer pairing.
		</p>
	{/snippet}

	{#snippet body()}
		{#if open}
				<ResourceBoundary
					resource={
		select(
			EntityType.EvmNetwork,
			selector,
			{
				sources: [
					Source.Constants_Internal,
				],
			}
		).consensusEndpoints
	}
					placeholderText="Loading consensus endpoints…"
			>
					{#snippet children(endpoints)}
						{#if endpoints.values.length}
							<ul data-column="gap-2">
								{#each endpoints.values as endpoint (endpoint.restBaseUrl)}
									<li>
					<dl data-column-item="center">
						<div>
							<dt>REST base</dt>
							<dd><code>{endpoint.restBaseUrl}</code></dd>
						</div>

						<div>
							<dt>Protocol</dt>
							<dd>{consensusProtocolByProtocol[endpoint.consensusProtocol].label}</dd>
						</div>
					</dl>
									</li>
								{/each}
							</ul>
						{:else}
					<p data-text="muted">{emptyText}</p>
		{/if}
				{/snippet}
				</ResourceBoundary>
		{/if}
	{/snippet}
</EntitiesList>

<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'


	// Context
	import { resolve } from '$app/paths'


	// Components
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import ActorIdentityRow from '$/views/ActorIdentityRow.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'

	import { useEntity } from '$/collections/$queries.svelte.ts'


	// Props
	let {
		children,
		entityId,
		title = 'Account',
		href,
		open = $bindable(true),
		...entityViewRest
	}: WithRest<
		{
			children?: Snippet
			entityId: EntityId<typeof schema, EntityType.Actor>
			title?: string
			href: string
			open?: boolean
		},
		Omit<
			ComponentProps<typeof EntityView>,
			| 'entityType'
			| 'entityId'
			| 'href'
			| 'open'
			| 'title'
			| 'Details'
		>
	> = $props()


	// State
	const actor = useEntity(
		EntityType.Actor,
		entityId,
		{
			$: [
				Source.Voltaire_JsonRpc,
				Source.TheGraph_Graphql,
			],
			$primaryName: {
				$: [
					Source.Voltaire_JsonRpc,
				],
			},
			$icon: {
				$: [
					Source.Voltaire_JsonRpc,
				],
			},
			$$ensNamesOwned: {
				$: [
					Source.TheGraph_Graphql,
				],
			},
		},
	)
</script>


<EntityView
	entityType={EntityType.Actor}
	{entityId}
	{title}
	{href}
	{open}
	{...entityViewRest}
>
	{#snippet Id()}
		<ActorIdentityRow {entityId} />
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<dl>
			<div>
				<dt>Address</dt>
				<dd>
					<ActorIdentityRow {entityId} />
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		{#if entityId.interopAddress}
			<EntityDetails
				entityType={EntityType.Actor}
				{entityId}
			>
				<dl>
					<div>
						<dt>Interop</dt>
						<dd>
							<TruncatedValue
								value={entityId.interopAddress}
								format={TruncatedValueFormat.Visual}
							/>
						</dd>
					</div>
				</dl>
			</EntityDetails>
		{/if}

		<ResourceBoundary resource={actor}>
			{#snippet children(live)}
				<EntityDetails
					entityType={EntityType.Actor}
					{entityId}
				>
					<dl>
						<div>
							<dt>ENS names (The Graph)</dt>
							<dd>
								<ul>
									{#each live.$$ensNamesOwned as nameRef (`${nameRef[EntityMetaKey.Id].name}`)}
										<li>
											<a
												data-link
												href={resolve('/(explore)/(ens)/ens/name/[ensName]', {
													ensName: nameRef[EntityMetaKey.Id].name,
												})}
											>{nameRef[EntityMetaKey.Id].name}</a>
										</li>
									{/each}
								</ul>
							</dd>
						</div>
					</dl>
				</EntityDetails>
			{/snippet}
		</ResourceBoundary>

		{#if children}
			{@render children()}
		{/if}
	{/snippet}
</EntityView>

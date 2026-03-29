<script
	lang="ts"
	generics="_EntityType extends EntityType"
>
	// Types/constants
	import type { EntityType } from '$/schema/$EntityType.ts'
	import {
		type EntityId,
		entityDefinitionByType,
	} from '$/schema/$schema.ts'


	// State
	import type { Snippet } from 'svelte'

	let {
		entityType,
		entityId,
		title: _title,
		href,
		children,
	}: {
		entityType: _EntityType
		entityId: EntityId<_EntityType>
		title?: string
		href?: string
		children?: Snippet<[{
			title: string
			href?: string
		}]>
	} = $props()

	const title = $derived(
		_title ?? entityDefinitionByType[entityType].label
	)


	// Functions
	import { stringify } from 'devalue'


	// Components
	import Heading from './Heading.svelte'
</script>


<header
	class="entity-summary"
	data-row-item="flexible"
	data-row="wrap gap-4"
	style:view-transition-name={`EntitySummary-${stringify(entityId)}`}
>
	{#if children}
		{@render children({
			title,
			href,
		})}
	{:else}
		<Heading>
			{#if href}
				<a href={href}>{title}</a>
			{:else}
				{title}
			{/if}
		</Heading>
	{/if}
</header>

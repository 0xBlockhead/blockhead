<script
	lang="ts"
	generics="_EntityType extends EntityType"
>
	// Types/constants
	import {
		type EntityId,
		type EntityType as SchemaEntityType,
		entityDefinitionByType,
		schema,
	} from '$/schema/$schema.ts'
	import type { EntityType } from '$/schema/$EntityType.ts'


	// State
	import type { Snippet } from 'svelte'

	let {
		entityType,
		entityId,
		title: _title,
		href,
		Icon,
		Heading,
		HeadingAfter,
		children,
	}: {
		entityType: _EntityType
		entityId: EntityId<typeof schema, SchemaEntityType<typeof schema>>
		title?: string
		href?: string
		Icon?: Snippet
		Heading?: Snippet
		HeadingAfter?: Snippet
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
	import HeadingComponent from './Heading.svelte'
</script>


<header
	class="entity-summary"
	data-row-item="flexible"
	data-row="wrap gap-4"
	style:view-transition-name={`EntitySummary-${stringify(entityId)}`}
>
	{#if Icon}
		{@render Icon()}
	{/if}

	<div
		data-row-item="flexible"
		data-column
	>
		<div data-row="start">
			{#if Heading}
				{@render Heading()}
			{:else}
				<HeadingComponent>
					{#if href}
						<a href={href}>{title}</a>
					{:else}
						{title}
					{/if}
				</HeadingComponent>
			{/if}

			{#if HeadingAfter}
				{@render HeadingAfter()}
			{/if}
		</div>

		{#if children}
			{@render children({
				title,
				href,
			})}
		{/if}
	</div>
</header>

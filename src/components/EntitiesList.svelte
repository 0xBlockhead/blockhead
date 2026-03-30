<script
	lang="ts"
	generics="
		_EntityType extends EntityType
	"
>
	// Types/constants
	import type { EntityType } from '$/schema/$EntityType.ts'
	import { entityDefinitionByType } from '$/schema/$schema.ts'


	// Context
	import { getOnNestedCollapsibleClose } from '$/context/onNestedCollapsibleClose.ts'

	const onNestedCollapsibleClose = getOnNestedCollapsibleClose()


	// State
	import type { Snippet } from 'svelte'
	import { SvelteSet } from 'svelte/reactivity'

	let {
		entityType,
		id,
		title,
		href,
		open = $bindable(true),
		body,
	}: {
		entityType: _EntityType
		id: string
		title: string
		href: string
		open?: boolean
		body?: Snippet
	} = $props()

	const emptyItems = new SvelteSet<number>()
	const emptyPlaceholderKeys = new SvelteSet<number>()


	// Components
	import Collapsible from '$/components/Collapsible.svelte'
	import Heading from '$/components/Heading.svelte'
	import UnorderedList from '$/components/UnorderedList.svelte'
</script>


<article
	{id}
	style:view-transition-name={`EntitiesList-${id}`}
>
	<Collapsible
		bind:open
		onclose={() => onNestedCollapsibleClose?.(id)}
		{...{ 'data-card': '' }}
	>
		{#snippet Summary()}
			<header
				data-row-item="flexible"
				data-row="wrap gap-4"
				style:view-transition-name={`EntitiesList-Summary-${id}`}
			>
				<Heading>
					<a href={href}>{title}</a>
				</Heading>
			</header>
		{/snippet}

		{#snippet Annotation()}
			<span data-text="annotation">{entityDefinitionByType[entityType].label}</span>
		{/snippet}

		{#snippet children()}
			<UnorderedList
				items={emptyItems}
				placeholderKeys={emptyPlaceholderKeys}
				getKey={(k) => k}
				getSortValue={(k) => k}
			>
				{#snippet Item()}
					<span aria-hidden="true"></span>
				{/snippet}

				{#snippet Empty()}
					{#if body}
						{@render body()}
					{:else}
						<div
							class="entity-details"
							style:view-transition-name={`EntitiesList-Details-${id}`}
						>
							<p>–</p>
						</div>
					{/if}
				{/snippet}
			</UnorderedList>
		{/snippet}
	</Collapsible>
</article>


<style>
	article {
		:global {
			[data-columns] {
				> section {
					break-after: column;

					> details[data-scroll-container] {
						--scrollContainer-sizeBlock: calc(80cqb - 6rem);
					}
				}
			}
		}
	}

	.entity-details {
		display: contents;
	}
</style>

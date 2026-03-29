<script module lang="ts">
	export enum EntityLayout {
		Id = 'Id',
		Summary = 'Summary',
		Details = 'Details',
		SummaryDetails = 'SummaryDetails',
	}
</script>


<script
	lang="ts"
	generics="
		_EntityType extends EntityType
	"
>
	// Types/constants
	import type { EntityType } from '$/schema/$EntityType.ts'
	import {
		type EntityId,
		entityDefinitionByType,
	} from '$/schema/$schema.ts'


	// Context
	import { getOnNestedCollapsibleClose } from '$/context/onNestedCollapsibleClose.ts'

	const onNestedCollapsibleClose = getOnNestedCollapsibleClose()


	// State
	import type { ComponentProps, Snippet } from 'svelte'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import type { SvelteHTMLElements } from 'svelte/elements'

	let {
		entityType,
		entityId,

		title,
		href,

		layout = EntityLayout.SummaryDetails,

		open = $bindable(layout === EntityLayout.SummaryDetails),
		ontoggle,

		Id,
		Summary,
		CollapsibleProps,
		Details,

		...articleProps
	}: WithRest<
		{
			entityType: _EntityType
			entityId: EntityId<_EntityType>

			title?: string
			href?: string

			layout?: EntityLayout

			open?: boolean
			ontoggle?: (e: Event) => void

			Id?: Snippet
			Summary?: Snippet<[{
				open: boolean,
			}]>
			CollapsibleProps?: ComponentProps<typeof Collapsible>
			Details?: Snippet<[{
				open: boolean,
			}]>
		},
		SvelteHTMLElements['article']
	> = $props()


	// Functions
	import { stringify } from 'devalue'


	// Components
	import Collapsible from '$/components/Collapsible.svelte'
	import EntitySummary from './EntitySummary.svelte'
</script>


{#if layout === EntityLayout.Id}
	{#if Id}
		{@render Id()}
	{/if}
{:else if layout === EntityLayout.Details}
	{#if Details}
		{@render Details({
			open: true,
		})}
	{/if}
{:else}
	<article
		{...articleProps}
		id={stringify(entityId)}
		style:view-transition-name={`EntityView-${stringify(entityId)}`}
	>
		<Collapsible
			bind:open
			{ontoggle}
			onclose={() => onNestedCollapsibleClose?.(stringify(entityId as EntityId))}
			{...{
				'data-card': '',
				...CollapsibleProps,
			}}
		>
			{#snippet Summary({
				open,
			})}
				{#if Summary}
					{@render Summary({
						open,
					})}
				{:else}
					<EntitySummary
						{entityType}
						{entityId}
						{title}
						{href}
					/>
				{/if}
			{/snippet}

			{#snippet Annotation()}
				<span data-text="annotation">{entityDefinitionByType[entityType].label}</span>
			{/snippet}

			{#snippet children({
				open,
			})}
				{#if (
					Details
					&& (
						(layout === EntityLayout.Summary && open)
						|| (layout === EntityLayout.SummaryDetails)
					)
				)}
					<div data-column>
						{@render Details({
							open,
						})}
					</div>
				{/if}
			{/snippet}
		</Collapsible>
	</article>
{/if}


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
</style>

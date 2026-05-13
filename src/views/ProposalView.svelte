<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import {
		ProposalCategory,
		proposalCategoryById,
	} from '$/constants/Proposal.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import ProposalSchema from '$/schema/Proposal.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Props
	let {
		children,
		entityId,
		href,
		open = $bindable(true),
		...entityViewRest
	}: WithRest<
		{
			children?: Snippet
			entityId: typeof ProposalSchema.id.infer
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
			| 'Heading'
		>
	> = $props()


	// Functions
	const proposalHeadingTitle = (
		m: {
			documentBody?: string | null
			documentTitle?: string | null
		},
		proposalEntityId: typeof ProposalSchema.id.infer,
	) => {
		const identifier = `${proposalCategoryById[proposalEntityId.category].label}-${proposalEntityId.number}`
		const trimmedTitle = (m.documentTitle ?? '').trim()
		const match = (
			proposalEntityId.category === ProposalCategory.Ensip ?
				(m.documentBody ?? '').match(/#\s*(ENSIP-\d+:\s*.+)/)
			:
				null
		)
		const headingTitle = (
			trimmedTitle !== '' ?
				trimmedTitle
			:
				(match?.[1] ?? '').trim()
		)
		return (
			headingTitle === '' ?
				identifier
			:
				new RegExp(
					`^${identifier.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*:`,
					'i',
				).test(headingTitle) ?
					headingTitle
				:
					`${identifier.trim()}: ${headingTitle}`
		)
	}


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const proposal = useEntity(
		EntityType.Proposal,
		entityId,
		{
			$: [
				entityId.category === ProposalCategory.Caip ?
					Source.Caips_Github
				: entityId.category === ProposalCategory.Ensip ?
					Source.Ensips_Github
				:
					Source.EthereumEips_Github,
			],
			documentBody: {},
			documentStatus: {},
			documentTitle: {},
		},
	)


	// Components
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import Markdown from '$/components/Markdown.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
</script>


<EntityView
	entityType={EntityType.Proposal}
	{entityId}
	{href}
	{open}
	{...entityViewRest}
>
	{#snippet Heading()}
		<ResourceBoundary
			resource={proposal}
			placeholderText="Loading proposal…"
		>
			{#snippet children(p)}
				<HeadingComponent>
					{proposalHeadingTitle(p, entityId)}
				</HeadingComponent>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<ResourceBoundary
			resource={proposal}
			placeholderText="Loading proposal…"
		>
			{#snippet children(p)}
				<dl>
					<div>
						<dt>Status</dt>
						<dd>{p.documentStatus}</dd>
					</div>
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details({ open: _open })}
		<EntityDetails
			entityType={EntityType.Proposal}
			{entityId}
		>
			<ResourceBoundary
				resource={proposal}
				placeholderText="Loading proposal…"
			>
				{#snippet children(p)}
					{#if p.documentBody.trim() === ''}
						<p data-text="muted">No proposal body available.</p>
					{:else}
						<Markdown content={p.documentBody} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		</EntityDetails>

		{#if children}
			{@render children()}
		{/if}
	{/snippet}
</EntityView>

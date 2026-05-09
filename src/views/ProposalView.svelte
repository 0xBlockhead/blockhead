<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { WithRest } from '$/typescript/WithRest.ts'

	import { useEntity } from '$/collections/$queries.svelte.ts'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import Markdown from '$/components/Markdown.svelte'
	import QueryBoundary from '$/components/QueryBoundary.svelte'
	import {
		ProposalCategory,
		proposalCategoryById,
	} from '$/constants/Proposal.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import ProposalSchema from '$/schema/Proposal.ts'
	import { Source } from '$/sources/$Source.ts'


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
		>
	> = $props()

	// (Derived)
	const proposalQuery = useEntity(
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

	const proposalFields = $derived(
		proposalQuery.data?.[EntityMetaKey.Fields],
	)

	const headingTitle = $derived(
		(() => {
			const identifier = `${proposalCategoryById[entityId.category].label}-${entityId.number}`
			const core = (
				String(proposalFields?.documentTitle ?? '').trim() !== '' ?
					String(proposalFields?.documentTitle).trim()
				:	entityId.category === ProposalCategory.Ensip ?
						String(proposalFields?.documentBody ?? '').match(/#\s*(ENSIP-\d+:\s*.+)/)?.[1]?.trim()
						?? null
					:	null
			)
			const title = String(core ?? '').trim()
			return (
				title === '' ?
					identifier
				:	new RegExp(
						`^${identifier.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*:`,
						'i',
					).test(title) ?
						title
					:	`${identifier.trim()}: ${title}`
			)
		})(),
	)
</script>


<EntityView
	entityType={EntityType.Proposal}
	{entityId}
	title={headingTitle}
	{href}
	{open}
	{...entityViewRest}
>
	{#snippet Content()}
		<dl>
			{#if proposalFields?.documentStatus}
				<div>
					<dt>Status</dt>
					<dd>{proposalFields.documentStatus}</dd>
				</div>
			{/if}
		</dl>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		<EntityDetails
			entityType={EntityType.Proposal}
			{entityId}
		>
			<QueryBoundary
				query={proposalQuery}
			>
				{#snippet children(proposal)}
					{#if proposal === undefined}
						<p data-text="muted">
							No proposal data for this item yet. Try again shortly.
						</p>
					{:else if proposal[EntityMetaKey.Fields]?.documentBody}
						<Markdown content={proposal[EntityMetaKey.Fields].documentBody} />
					{:else}
						<p data-text="muted">
							No document body yet.
						</p>
					{/if}
				{/snippet}
			</QueryBoundary>
		</EntityDetails>

		{#if children}
			{@render children()}
		{/if}
	{/snippet}
</EntityView>

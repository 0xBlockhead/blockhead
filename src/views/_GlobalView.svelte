<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// State
	const view = {
		route: {
			slot: 'GlobalRouteChildren',
			selectorNormalization: 'global hub route composition',
			kind: 'route',
			component: 'GlobalView',
			children: 'route',
		},
		lists: [
			{
				id: 'nav',
				label: 'Navigation',
				slot: 'GlobalNavigation',
			},
			{
				id: 'ai',
				label: 'AI',
				slot: 'GlobalAiCatalogs',
			},
			{
				id: 'proposals',
				label: 'Proposals',
				slot: 'GlobalProposalFilters',
			},
		],
		slots: [
			{
				slot: 'GlobalRouteChildren',
				label: 'route children',
				for: 'Content',
			},
			{
				slot: 'GlobalNavigation',
				label: 'route shortcut list',
				for: 'List',
			},
		],
		closed: [
			{
				label: 'scope/title',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'scope/title',
					},
				],
			],
			blocks: [
				[
					{
						label: 'Dune usage when no route children are supplied',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Nav',
					items: [
						{
							label: 'route shortcut list',
						},
					],
				},
				{
					label: 'AI',
					items: [
						{
							label: '_GlobalAiModelCatalog',
						},
						{
							label: '_GlobalAiArtifactCatalog',
						},
						{
							label: '_GlobalAgentNetwork',
						},
					],
				},
				{
					label: 'Proposals',
					items: [
						{
							label: 'SpecificationProposal list filtered by proposalRealms/proposalCategories',
						},
					],
				},
				{
					label: 'Usage',
					items: [
						{
							label: 'Dune credit counters',
						},
						{
							label: 'but those children do not create separate global entity families',
						},
					],
				},
			],
		},
	} satisfies ComponentProps<typeof EntityView2>['view']

	let {
		selection,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType._Global>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView2>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()


	// Components
	import EntityView2 from '$/components/EntityView2.svelte'
</script>


<EntityView2
	{selection}
	entityType={EntityType._Global}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>

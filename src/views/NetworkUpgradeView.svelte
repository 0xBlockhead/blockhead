<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// State
	const view = {
	closed: [
		'$network',
		'upgradeId',
		'name',
	],
	content: {
		dl: [
			[
				'$network',
				'upgradeId',
				'name',
				{
					label: 'latest status',
				},
				'$$specificationProposals',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Network',
				items: [
					{
						label: 'parent Network row',
					},
				],
			},
			{
				label: 'Status observations',
				items: [
					{
						label: 'NetworkUpgrade_Timestamp list',
					},
				],
			},
			{
				label: 'Domain-specific upgrade',
				items: [
					{
						label: 'Ethereum execution/consensus upgrade rows or other stack-specific upgrade rows when linked',
					},
				],
			},
			{
				label: 'Proposals',
				items: [
					{
						label: 'linked SpecificationProposal rows',
					},
				],
			},
			{
				label: 'Non-goals',
				items: [
					{
						label: 'not protocol family',
					},
					{
						label: 'not ecosystem roadmap',
					},
					{
						label: 'not docs page identity',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'specification-proposals',
			label: 'specification proposals',
			field: '$$specificationProposals',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'timestamps',
			label: 'timestamps',
			field: '$$timestamps',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
	],
} satisfies ComponentProps<typeof EntityView2>['view']

	let {
		selection,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.NetworkUpgrade>
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
	entityType={EntityType.NetworkUpgrade}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>

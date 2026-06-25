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
		'programHash',
		'programKind',
	],
	content: {
		dl: [
			[
				'$network',
				'programHash',
				'programKind',
				'tealVersion',
				{
					label: 'latest bytecode/disassembly availability',
				},
				'$$applications',
				'$$transactions',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Applications',
				items: [
					{
						label: 'applications using this approval/clear program',
					},
				],
			},
			{
				label: 'Transactions',
				items: [
					{
						label: 'transactions carrying or creating the program',
					},
				],
			},
			{
				label: 'Program evidence',
				items: [
					{
						label: 'source-scoped bytecode/disassembly/source-map observations',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'timestamps',
			label: 'timestamps',
			field: '$$timestamps',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'applications',
			label: 'applications',
			field: '$$applications',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'transactions',
			label: 'transactions',
			field: '$$transactions',
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
			selection: EntityProxyResource<typeof schema, EntityType.AlgorandTealProgram>
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
	entityType={EntityType.AlgorandTealProgram}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>

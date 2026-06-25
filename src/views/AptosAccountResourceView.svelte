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
		'$account',
		'resourceType',
		{
			label: 'latest value summary',
		},
	],
	content: {
		dl: [
			[
				'$account',
				'resourceType',
				{
					label: 'latest value summary',
				},
				{
					label: 'latest ledger version/source',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Resource observations',
				items: [
					{
						label: 'ledger-versioned resource values',
					},
				],
			},
			{
				label: 'Account',
				items: [
					{
						label: 'parent Aptos account',
					},
				],
			},
			{
				label: 'Move struct',
				items: [
					{
						label: 'Move struct type when the type tag resolves',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'account resource lookup/indexer payload',
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
	],
} satisfies ComponentProps<typeof EntityView2>['view']

	let {
		selection,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.AptosAccountResource>
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
	entityType={EntityType.AptosAccountResource}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>

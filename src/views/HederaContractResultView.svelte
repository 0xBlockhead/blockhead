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
		'$transaction',
		'$contract',
		'status',
	],
	content: {
		dl: [
			[
				'$transaction',
				'$contract',
				'status',
				{
					label: 'gas used/limit',
				},
				'amountTinybar',
				'ethereumHash',
				{
					label: 'error',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Actions',
				items: [
					{
						label: 'contract action trace rows',
					},
				],
			},
			{
				label: 'Logs',
				items: [
					{
						label: 'contract log rows',
					},
				],
			},
			{
				label: 'Function parameters',
				items: [
					{
						label: 'raw input',
					},
				],
			},
			{
				label: 'Bloom',
				items: [
					{
						label: 'bloom/filter evidence',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'contract result payload',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'actions',
			label: 'actions',
			field: '$$actions',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'logs',
			label: 'logs',
			field: '$$logs',
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
			selection: EntityProxyResource<typeof schema, EntityType.HederaContractResult>
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
	entityType={EntityType.HederaContractResult}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>

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
		'amendmentId',
		'name',
		{
			label: 'latest status',
		},
	],
	content: {
		dl: [
			[
				'amendmentId',
				'name',
				{
					label: 'latest status',
				},
				{
					label: 'latest enabled ledger',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Status history',
				items: [
					{
						label: 'XrplAmendment_Timestamp list',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'feature command payload',
					},
					{
						label: 'validator voting/support evidence when exposed',
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
			selection: EntityProxyResource<typeof schema, EntityType.XrplAmendment>
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
	entityType={EntityType.XrplAmendment}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>

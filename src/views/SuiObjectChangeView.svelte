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
		'changeKind',
		{
			label: 'object id/type',
		},
		{
			label: 'owner',
		},
	],
	content: {
		dl: [
			[
				'changeKind',
				{
					label: 'object id/type',
				},
				{
					label: 'owner',
				},
				'version',
				'digest',
				'$transaction',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Transaction',
				items: [
					{
						label: 'SuiTransaction',
					},
				],
			},
			{
				label: 'Object',
				items: [
					'objectId',
					'objectType',
					'ownerSelector',
				],
			},
			{
				label: 'Version/digest',
				items: [
					'version',
					'digest',
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'Sui transaction effects objectChanges payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.SuiObjectChange>
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
	entityType={EntityType.SuiObjectChange}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>

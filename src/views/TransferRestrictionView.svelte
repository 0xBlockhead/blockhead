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
		'$assetInstance',
		'restrictionKey',
		'source',
	],
	content: {
		dl: [
			[
				'$assetInstance',
				'restrictionKey',
				'source',
				'restrictionKind',
				'$profile',
				'message',
				'ruleSelector',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Profile',
				items: [
					{
						label: 'regulated-asset profile',
					},
				],
			},
			{
				label: 'Checks',
				items: [
					{
						label: 'source/time transfer checks',
					},
				],
			},
			{
				label: 'Evidence',
				items: [
					{
						label: 'module config',
					},
					{
						label: 'restriction-code mapping',
					},
					{
						label: 'transfer-hook rule',
					},
					{
						label: 'or explicit registry restriction',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'checks',
			label: 'checks',
			field: '$$checks',
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
			selection: EntityProxyResource<typeof schema, EntityType.TransferRestriction>
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
	entityType={EntityType.TransferRestriction}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>

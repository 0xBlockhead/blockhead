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
			{
				label: 'asset instance',
			},
			{
				label: 'restriction key',
			},
			'source',
		],
		content: {
			dl: [
				[
					{
						label: 'asset instance',
					},
					{
						label: 'restriction key',
					},
					'source',
					{
						label: 'restriction kind',
					},
					{
						label: 'profile',
					},
					'message',
					{
						label: 'rule selector',
					},
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

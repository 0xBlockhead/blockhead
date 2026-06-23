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
				label: 'regulated asset profile',
			},
			{
				label: 'module key',
			},
			{
				label: 'module selector',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'regulated asset profile',
					},
					{
						label: 'module key',
					},
					{
						label: 'module selector',
					},
					{
						label: 'rule kind',
					},
					{
						label: 'config summary',
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
							label: 'parent regulated asset profile',
						},
					],
				},
				{
					label: 'Restrictions',
					items: [
						{
							label: 'transfer restrictions derived from this module',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'contract calls/events',
						},
						{
							label: 'verified ABI',
						},
						{
							label: 'or Token-2022 extension payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.ComplianceModule>
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
	entityType={EntityType.ComplianceModule}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>

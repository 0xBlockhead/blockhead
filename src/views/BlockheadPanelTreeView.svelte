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
				label: 'panel tree id',
			},
			{
				label: 'local dashboard workspace kind',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'panel tree id',
					},
					{
						label: 'local dashboard workspace kind',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Layout',
					items: [
						{
							label: 'saved geometry when modeled',
						},
					],
				},
				{
					label: 'Panels',
					items: [
						{
							label: 'saved panel route refs when modeled',
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadPanelTree>
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
	entityType={EntityType.BlockheadPanelTree}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>

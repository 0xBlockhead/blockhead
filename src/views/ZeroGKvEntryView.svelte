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
				label: 'network',
			},
			'namespace',
			'key',
		],
		content: {
			dl: [
				[
					{
						label: 'network',
					},
					'namespace',
					'key',
					{
						label: 'value hash',
					},
					{
						label: 'owner',
					},
					{
						label: 'storage log entry',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Storage log',
					items: [
						{
							label: 'linked storage log entry',
						},
					],
				},
				{
					label: 'Owner',
					items: [
						{
							label: 'owner EVM account when resolved',
						},
					],
				},
				{
					label: 'Network',
					items: [
						{
							label: 'parent 0G network',
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
			selection: EntityProxyResource<typeof schema, EntityType.ZeroGKvEntry>
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
	entityType={EntityType.ZeroGKvEntry}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>

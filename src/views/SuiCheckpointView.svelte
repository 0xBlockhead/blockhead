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
			'sequence',
			'digest',
			'epoch',
		],
		content: {
			dl: [
				[
					'sequence',
					'digest',
					'epoch',
					{
						label: 'timestamp',
					},
					{
						label: 'previous digest',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Network',
					items: [
						{
							label: 'SuiNetwork',
						},
					],
				},
				{
					label: 'Checkpoint header',
					items: [
						'sequence',
						'digest',
						'epoch',
						{
							label: 'timestamp',
						},
						{
							label: 'previous digest',
						},
					],
				},
				{
					label: 'Transactions',
					items: [
						{
							label: 'SuiTransaction list',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'Sui checkpoint payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.SuiCheckpoint>
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
	entityType={EntityType.SuiCheckpoint}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>

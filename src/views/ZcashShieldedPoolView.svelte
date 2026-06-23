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
			'pool',
		],
		content: {
			dl: [
				[
					{
						label: 'network',
					},
					'pool',
					{
						label: 'activation network upgrade',
					},
					{
						label: 'note protocol',
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
							label: 'shielded actions referencing this pool',
						},
					],
				},
				{
					label: 'Blocks',
					items: [
						{
							label: 'pool block-state rows when resolved',
						},
					],
				},
				{
					label: 'Network',
					items: [
						{
							label: 'parent Zcash network',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'Zcashd resolver constant mapping',
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
			selection: EntityProxyResource<typeof schema, EntityType.ZcashShieldedPool>
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
	entityType={EntityType.ZcashShieldedPool}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>

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
		'apiHost',
		'allowance',
		'fetchedAt',
	],
	content: {
		dl: [
			[
				'apiHost',
				'allowance',
				'fetchedAt',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Allowance',
				items: [
					{
						label: 'global fast-burn allowance value',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'Iris API host',
					},
					{
						label: 'fetch timestamp',
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
			selection: EntityProxyResource<typeof schema, EntityType.CctpAllowance>
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
	entityType={EntityType.CctpAllowance}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>

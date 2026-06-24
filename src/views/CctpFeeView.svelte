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
			label: 'API host',
		},
		{
			label: 'from domain',
		},
		{
			label: 'to domain',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'API host',
				},
				{
					label: 'from domain',
				},
				{
					label: 'to domain',
				},
				{
					label: 'fee-row count',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Fee rows',
				items: [
					{
						label: 'finality threshold',
					},
					{
						label: 'minimum fee',
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
						label: 'from/to numeric domain query',
					},
				],
			},
			{
				label: 'Target model',
				items: [
					{
						label: 'CctpBurnFee_Timestamp when timestamp schema exists',
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
			selection: EntityProxyResource<typeof schema, EntityType.CctpFee>
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
	entityType={EntityType.CctpFee}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>

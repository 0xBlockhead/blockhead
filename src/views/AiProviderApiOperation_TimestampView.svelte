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
			label: 'operation',
		},
		{
			label: 'observation time',
		},
		{
			label: 'availability',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'operation',
				},
				{
					label: 'timestamp',
				},
				'source',
				{
					label: 'availability',
				},
			],
			[
				{
					label: 'supported model selectors',
				},
				{
					label: 'modalities',
				},
				{
					label: 'streaming/tool/structured support',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Operation',
				items: [
					{
						label: 'AiProviderApiOperation',
					},
				],
			},
			{
				label: 'Model support',
				items: [
					{
						label: 'supported model selectors',
					},
				],
			},
			{
				label: 'Policies',
				items: [
					{
						label: 'context/rate-limit/pricing policies',
					},
				],
			},
			{
				label: 'Error',
				items: [
					{
						label: 'error field',
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
			selection: EntityProxyResource<typeof schema, EntityType.AiProviderApiOperation_Timestamp>
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
	entityType={EntityType.AiProviderApiOperation_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>

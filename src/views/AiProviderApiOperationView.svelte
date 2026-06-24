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
			label: 'provider',
		},
		{
			label: 'operation id',
		},
		{
			label: 'kind',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'provider',
				},
				{
					label: 'operation id',
				},
				'label',
				{
					label: 'kind',
				},
			],
			[
				{
					label: 'HTTP method',
				},
				{
					label: 'path template',
				},
				{
					label: 'documentation URL',
				},
				{
					label: 'latest support observation',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Provider',
				items: [
					{
						label: 'AiModelProvider',
					},
				],
			},
			{
				label: 'Observations',
				items: [
					{
						label: 'AiProviderApiOperation_Timestamp list',
					},
				],
			},
			{
				label: 'Models',
				items: [
					{
						label: 'supported model selectors from latest observation',
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
			selection: EntityProxyResource<typeof schema, EntityType.AiProviderApiOperation>
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
	entityType={EntityType.AiProviderApiOperation}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>

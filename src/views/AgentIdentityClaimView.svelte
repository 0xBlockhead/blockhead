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
			label: 'subject',
		},
		{
			label: 'identity kind',
		},
		{
			label: 'object',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'subject kind/selector',
				},
				{
					label: 'identity kind',
				},
				{
					label: 'object kind/selector',
				},
			],
			[
				'source',
				{
					label: 'timestamp',
				},
				'confidence',
				{
					label: 'verification method',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Evidence',
				items: [
					{
						label: 'document',
					},
					{
						label: 'evidence URI/hash algorithm/hash',
					},
					'signature',
				],
			},
			{
				label: 'Subject',
				items: [
					{
						label: 'subject selector',
					},
				],
			},
			{
				label: 'Object',
				items: [
					{
						label: 'object selector',
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
			selection: EntityProxyResource<typeof schema, EntityType.AgentIdentityClaim>
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
	entityType={EntityType.AgentIdentityClaim}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>

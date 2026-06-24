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
			label: 'card',
		},
		{
			label: 'content hash',
		},
		{
			label: 'name/version',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'card',
				},
				{
					label: 'content hash algorithm/hash',
				},
				{
					label: 'fetched at',
				},
				{
					label: 'snapshot kind',
				},
			],
			[
				'name',
				'version',
				{
					label: 'protocol version',
				},
				{
					label: 'provider',
				},
				{
					label: 'preferred transport',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Interfaces',
				items: [
					{
						label: 'A2aAgentInterface list',
					},
				],
			},
			{
				label: 'Services',
				items: [
					{
						label: 'A2aAgentService list',
					},
				],
			},
			{
				label: 'Skills',
				items: [
					{
						label: 'A2aAgentSkill list',
					},
				],
			},
			{
				label: 'Capabilities',
				items: [
					'capabilities',
					'extensions',
				],
			},
			{
				label: 'Security',
				items: [
					{
						label: 'security schemes',
					},
					{
						label: 'security requirements',
					},
					'signatures',
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
			selection: EntityProxyResource<typeof schema, EntityType.A2aAgentCard_Snapshot>
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
	entityType={EntityType.A2aAgentCard_Snapshot}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>

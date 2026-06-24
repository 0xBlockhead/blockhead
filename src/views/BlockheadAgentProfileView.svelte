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
			label: 'profile id',
		},
		'label',
		{
			label: 'primary refs',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'profile id',
				},
				'label',
				{
					label: 'created/updated at',
				},
			],
			[
				{
					label: 'ACP runtime',
				},
				{
					label: 'A2A service',
				},
				{
					label: 'MCP server',
				},
				{
					label: 'EIP-8004 registration',
				},
				{
					label: 'model',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Connections',
				items: [
					{
						label: 'BlockheadAgentConnection list',
					},
				],
			},
			{
				label: 'Conversations',
				items: [
					{
						label: 'BlockheadAgentConversation list',
					},
				],
			},
			{
				label: 'Protocol refs',
				items: [
					{
						label: 'ACP/A2A/MCP/EIP-8004/model refs',
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadAgentProfile>
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
	entityType={EntityType.BlockheadAgentProfile}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>

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
			label: 'runtime id',
		},
		{
			label: 'program version',
		},
		{
			label: 'transport',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'runtime id',
				},
				{
					label: 'source',
				},
				{
					label: 'program version',
				},
				{
					label: 'program install',
				},
				{
					label: 'transport kind',
				},
			],
			[
				{
					label: 'process id',
				},
				{
					label: 'initialized at',
				},
				{
					label: 'session refs',
				},
				{
					label: 'latest health',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Sessions',
				items: [
					{
						label: 'AcpSession list',
					},
				],
			},
			{
				label: 'Health',
				items: [
					{
						label: 'AcpAgentRuntime_Timestamp list',
					},
				],
			},
			{
				label: 'Program',
				items: [
					{
						label: 'AcpAgentProgramVersion',
					},
					{
						label: 'BlockheadAgentProgramInstall',
					},
				],
			},
			{
				label: 'Local source',
				items: [
					{
						label: 'BlockheadSource',
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
			selection: EntityProxyResource<typeof schema, EntityType.AcpAgentRuntime>
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
	entityType={EntityType.AcpAgentRuntime}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>

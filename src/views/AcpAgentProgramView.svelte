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
			label: 'registry id/package',
		},
		'label',
		{
			label: 'repository',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'registry agent id',
				},
				{
					label: 'package name',
				},
				'label',
				'description',
			],
			[
				{
					label: 'repository URL',
				},
				{
					label: 'website URL',
				},
				'authors',
				'license',
			],
			[
				{
					label: 'supports authentication',
				},
				{
					label: 'version refs',
				},
				{
					label: 'document refs',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Versions',
				items: [
					{
						label: 'AcpAgentProgramVersion list',
					},
				],
			},
			{
				label: 'Documents',
				items: [
					{
						label: 'AiDocument list',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'ACP registry/GitHub references',
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
			selection: EntityProxyResource<typeof schema, EntityType.AcpAgentProgram>
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
	entityType={EntityType.AcpAgentProgram}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>

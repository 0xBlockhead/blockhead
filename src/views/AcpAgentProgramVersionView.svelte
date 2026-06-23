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
				label: 'program',
			},
			{
				label: 'version/artifact',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'program',
					},
					'version',
					{
						label: 'artifact',
					},
				],
				[
					{
						label: 'release date',
					},
					{
						label: 'distribution kind',
					},
					'command',
				],
				[
					'arguments',
					{
						label: 'environment keys',
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
					label: 'Program',
					items: [
						{
							label: 'AcpAgentProgram',
						},
					],
				},
				{
					label: 'Artifact',
					items: [
						{
							label: 'AiArtifact',
						},
					],
				},
				{
					label: 'Distribution',
					items: [
						{
							label: 'distribution JSON',
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
			],
		},
	} satisfies ComponentProps<typeof EntityView2>['view']

	let {
		selection,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.AcpAgentProgramVersion>
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
	entityType={EntityType.AcpAgentProgramVersion}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>

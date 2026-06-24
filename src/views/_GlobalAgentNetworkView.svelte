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
			'networkId',
		],
		content: {
			dl: [
				[
					'networkId',
					'label',
					'protocolKind',
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'acp programs',
					when: 'open',
					items: [
						'$$acpPrograms',
					],
				},
				{
					label: 'a2a cards',
					when: 'open',
					items: [
						'$$a2aCards',
					],
				},
				{
					label: 'mcp servers',
					when: 'open',
					items: [
						'$$mcpServers',
					],
				},
				{
					label: 'eip8004 registrations',
					when: 'open',
					items: [
						'$$eip8004Registrations',
					],
				},
				{
					label: 'blockhead profiles',
					when: 'open',
					items: [
						'$$blockheadProfiles',
					],
				},
				{
					label: 'timestamps',
					when: 'open',
					items: [
						'$$timestamps',
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
			selection: EntityProxyResource<typeof schema, EntityType._GlobalAgentNetwork>
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
	entityType={EntityType._GlobalAgentNetwork}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>

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
				label: 'agent card URL',
			},
			{
				label: 'latest snapshot',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'agent card URL',
					},
					{
						label: 'latest snapshot',
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
					label: 'Snapshots',
					items: [
						{
							label: 'A2aAgentCard_Snapshot list',
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
							label: 'well-known URL',
						},
						{
							label: 'EIP-8004 declarations',
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
			selection: EntityProxyResource<typeof schema, EntityType.A2aAgentCard>
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
	entityType={EntityType.A2aAgentCard}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>

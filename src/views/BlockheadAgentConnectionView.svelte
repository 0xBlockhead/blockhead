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
				label: 'connection id',
			},
			{
				label: 'profile',
			},
			{
				label: 'kind',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'connection id',
					},
					{
						label: 'profile',
					},
					{
						label: 'source',
					},
					{
						label: 'kind',
					},
				],
				[
					{
						label: 'endpoint URL',
					},
					{
						label: 'auth kind',
					},
					'enabled',
					{
						label: 'latest health',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Profile',
					items: [
						{
							label: 'BlockheadAgentProfile',
						},
					],
				},
				{
					label: 'Source',
					items: [
						{
							label: 'BlockheadSource',
						},
					],
				},
				{
					label: 'Health',
					items: [
						{
							label: 'BlockheadAgentConnection_Timestamp list',
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadAgentConnection>
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
	entityType={EntityType.BlockheadAgentConnection}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>

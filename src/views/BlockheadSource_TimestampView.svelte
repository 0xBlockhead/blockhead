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
		'$source',
		'timestampMs',
		'health',
	],
	content: {
		dl: [
			[
				'$source',
				'timestampMs',
				'enabled',
				'health',
				'latencyMs',
			],
			[
				'statusCode',
				{
					label: 'rate-limit remaining/reset',
				},
				'resolverCount',
				'error',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Source',
				items: [
					{
						label: 'parent local source definition',
					},
				],
			},
			{
				label: 'Probe result',
				items: [
					{
						label: 'HTTP/RPC/GraphQL status',
					},
					'error',
				],
			},
			{
				label: 'Rate limits',
				items: [
					{
						label: 'remaining/reset fields',
					},
				],
			},
			{
				label: 'Resolver coverage',
				items: [
					'resolverCount',
					{
						label: 'local capability notes',
					},
				],
			},
			{
				label: 'Local config',
				items: [
					'enabled',
					{
						label: 'environment gating result',
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadSource_Timestamp>
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
	entityType={EntityType.BlockheadSource_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
